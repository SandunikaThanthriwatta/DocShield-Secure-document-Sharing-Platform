# 🛡️ DocShield

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat&logo=socket.io&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat&logo=firebase&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Storage-3448C5?style=flat&logo=cloudinary&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat&logo=vite&logoColor=white)

> A real-time secure document sharing platform with cryptographic digital signatures, live collaboration, and document integrity verification.

---

## 🗂️ Table of Contents

- [Overview](#-overview)
- [Key Security Principles](#-key-security-principles)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)

---

## 📌 Overview

**DocShield** is a full-stack web application that allows users to securely sign, send, and verify PDF documents using **digital signatures** and **cryptographic principles**. Built on the MERN stack with real-time capabilities via Socket.IO, DocShield ensures every document's integrity and authenticity throughout its lifecycle.

---

## 🔐 Key Security Principles

### 1. 🔒 Data Integrity

- **Hash Functions** — Cryptographic hash functions generate unique hash values of documents before and after signing, enabling detection of any post-sign tampering.
- **Digital Signatures** — The document hash is encrypted with the signer's private key. Any modification after signing causes verification to fail immediately.

### 2. 🕵️ Confidentiality

- **Secure Key Management** — Private keys used for digital signing are stored encrypted and accessed only by authorized processes, preventing unauthorized access.
- **Access Control** — Authentication and authorization mechanisms ensure only verified users can sign or verify PDF documents.

### 3. ⚡ Availability

- **Cloud Infrastructure** — Deployed on reliable, scalable cloud infrastructure to ensure continuous uptime and availability for all users.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| 🖥️ Frontend | React 18, Vite, MUI (Material UI) |
| 🌐 Backend | Node.js, Express.js |
| 🗄️ Database | MongoDB, Mongoose |
| 🔴 Real-time | Socket.IO |
| 🔑 Auth | Firebase Authentication |
| ☁️ Storage | Cloudinary |
| 📄 PDF | pdf-lib, pdfjs-dist, pdf-parse |
| 🔐 Crypto | node-forge, bcryptjs, jsonwebtoken |
| 📧 Email | Nodemailer |

---

## ✨ Features

- 📤 **Send & Receive Documents** — Compose and deliver PDF documents to other users securely
- ✍️ **Digital Signatures** — Sign PDFs with cryptographic private keys
- ✅ **Signature Verification** — Verify document authenticity and detect tampering
- 🖼️ **PDF Thumbnail Preview** — Visual preview of documents before opening
- 🔴 **Real-time Updates** — Live notifications and collaboration via Socket.IO
- 🔑 **OTP Authentication Flow** — Secure login with email-based OTP verification
- 📥 **Inbox & Compose** — Email-style interface for document management

---

## 📁 Project Structure

```
DocShield/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Navbar, Signup, CheckAuth
│   │   ├── pages/           # Inbox, Compose, and more
│   │   ├── security/        # Crypto utilities
│   │   └── middlewares/     # Client-side middleware
│   └── vite.config.js
│
└── server/                  # Node.js backend
    ├── controllers/         # Route controllers
    ├── models/              # Mongoose schemas
    ├── routes/              # API routes
    ├── middlewares/         # Auth & validation
    ├── firebase/            # Firebase config
    ├── cloudinary/          # Cloudinary config
    ├── socketHandler/       # Socket.IO logic
    └── index.js             # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB instance
- Firebase project
- Cloudinary account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/DocShield.git
cd DocShield

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Running the App

```bash
# Start the backend (from /server)
npm start

# Start the frontend (from /client)
npm run dev
```

---
