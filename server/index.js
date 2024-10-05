import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import socketHandler from './socketHandler/socketHandler.js';
import userRoute from "./routes/user.route.js"
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

dotenv.config();

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

const app = express();

app.use(cookieParser());
app.use(cors(corsOptions)); 
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

socketHandler(io);

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

mongoose.connect(DB_URL)
    .then(()=>{console.log("Database connected successfully!");})
    .catch((error)=>{console.log("Database connected failed! \n",error.message);})

app.use('/uploads', express.static(uploadsDir));
app.use("/api/user", userRoute);