import express from "express"
import multer from "multer"
import { signupUser, signinUser, updateDocToMongo, getAllUserEmails, getUser, auth, sendOtp, verifyOtp } from "../controllers/user.controller.js"
import digitallyVerify from "../middlewares/digitallyVerify.js"
import decrypt from "../middlewares/decrypt.js"
import { cookieJwtAuth } from "../middlewares/cookieJwtAuth.js"
import fetch from "node-fetch"

const uploadFileMulter = multer({ storage: multer.memoryStorage() })

const route = express.Router();

route.post("/create-user", signupUser);
route.post("/signin-user", signinUser);
route.post('/auth', cookieJwtAuth, auth);

route.post("/verify-update-doc", uploadFileMulter.single('file'), decrypt, digitallyVerify, updateDocToMongo);

route.get("/get-all-emails", getAllUserEmails);
route.post("/get-user", getUser);

route.post("/send-otp", sendOtp);
route.post("/verify-otp", verifyOtp);

route.get("/download", async (req, res) => {
  const { url, name } = req.query;
  if (!url) return res.status(400).json({ error: 'No URL provided' });
  try {
    console.log('Fetching:', url);
    const response = await fetch(url);
    console.log('Status:', response.status);
    if (!response.ok) throw new Error(`Cloudinary fetch failed: ${response.status}`);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${name || 'document'}.pdf"`);
    response.body.pipe(res);
  } catch (err) {
    console.error('Download error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default route;
