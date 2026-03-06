require("dotenv").config();
const express = require("express");
const multer = require("multer");
const B2 = require("backblaze-b2");
const cors = require("cors");

const app = express();

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

const upload = multer({ storage: multer.memoryStorage() });

// Check env variables
console.log("Checking environment variables...");
console.log("B2_KEY_ID exists:", !!process.env.B2_KEY_ID);
console.log("B2_APP_KEY exists:", !!process.env.B2_APP_KEY);
console.log("B2_BUCKET_ID exists:", !!process.env.B2_BUCKET_ID);
console.log("B2_BUCKET_NAME exists:", !!process.env.B2_BUCKET_NAME);

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APP_KEY,
});

// Upload Endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).
