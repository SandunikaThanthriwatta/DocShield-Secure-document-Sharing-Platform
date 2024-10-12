import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";
import forge from 'node-forge';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { generateKeyPair } from 'crypto';
import { promisify } from 'util';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const generateKeyPairAsync = promisify(generateKeyPair);
const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = join(__dirname, '..', 'uploads');

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const saveFileLocally = (buffer, filename) => {
  const filePath = join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return `${process.env.SERVER_URL}/uploads/${encodeURIComponent(filename)}`;
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const otp = generateOtp();
  const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.TICKETTWIST_EMAIL,
        pass: process.env.TICKETTWIST_EMAIL_PASSWORD
      },
    });

    await transporter.sendMail({
      from: process.env.TICKETTWIST_EMAIL,
      to: email,
      subject: 'Your DocShield OTP',
      html: `<p>Thank you for using DocShield!</p><p>Your One-Time Password (OTP) is:</p><h1 style='font-size: 24px; color: #4CAF50; text-align: center;'>${otp}</h1><p>This OTP is valid for the next 10 minutes. Please do not share this code with anyone.</p><p>If you did not request this OTP, please ignore this email.</p><p>Thank you,<br>The DocShield Team</p>`,
    });

    await User.updateOne({ email }, { otp, otpExpiresAt: otpExpiration });
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending OTP email' });
  }
};

export const verifyOtp = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    if (user.otpExpiresAt < new Date()) return res.status(400).json({ error: 'OTP has expired' });

    const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res
      .status(200)
      .cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'None' })
      .json({ message: 'OTP verified successfully!' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Error verifying OTP' });
  }
};

export const signupUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExistsMail = await User.findOne({ email });
    if (userExistsMail) return res.status(400).json({ error: 'User already exists!' });

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const { privateKey, publicKey } = await generateKeyPairAsync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding:  { type: 'pkcs1', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
    });
    const privateKeyPem = privateKey;
    const publicKeyPem  = publicKey;

    const user = new User({ ...req.body, password: hashedPassword, public_key: publicKeyPem });
    await user.save();

    res.status(200).json({ message: 'User created successfully!', private_key: privateKeyPem });
  } catch (error) {
    console.error('signupUser error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password!' });

    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password!' });

    res.status(200).json({ message: 'Signin successful!' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error!' });
  }
};

export const auth = async (req, res) => {
  res.status(200).json({ user: true, email: req.email });
};

export const updateDocToMongo = async (req, res) => {
  try {
    const { email, sender } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found!' });
    if (!req.file) return res.status(400).json({ error: 'No file received' });

    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toISOString().split('T')[0];
    const formattedTime = currentDateTime.toTimeString().split(' ')[0].replace(/:/g, '-');
    const publicId = `${req.body.name}_${formattedDate}_${formattedTime}`;

    // req.file is a Buffer set by the decrypt middleware
    const fileBuffer = Buffer.isBuffer(req.file) ? req.file : Buffer.from(req.file);
    const filename = `${publicId}.pdf`;
    const downloadURL = saveFileLocally(fileBuffer, filename);

    user.documents.push(downloadURL);
    user.senders.push(sender);
    await user.save();

    res.status(200).json({ message: 'Document uploaded successfully!', downloadURL, user });
  } catch (err) {
    console.error('Error uploading to Cloudinary:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllUserEmails = async () => {
  const users = await User.find({}, 'email public_key first_name last_name');
  return users.map(user => ({
    email: user.email,
    public_key: user.public_key,
    first_name: user.first_name,
    last_name: user.last_name,
  }));
};

export const getUser = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email }).select('-password -createdAt -updatedAt -__v');
    if (!user) return res.status(400).json({ message: 'User not found!' });
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error!' });
  }
};

export const getPublicKeyByEmail = async (email) => {
  const user = await User.findOne({ email }).select('public_key');
  return user ? user.public_key : null;
};
