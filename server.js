require("dotenv").config();
const express = require("express");
const multer = require("multer");
const B2 = require("backblaze-b2");
const cors = require("cors");

const app = express();

// ✅ CORS - Specific Origins (Security + Working)
app.use(cors({
  origin: [
    'http://localhost:5173',      // Vite default
    'http://localhost:3000',      // React default
    'https://your-firebase-app.web.app',  // Firebase hosting (change karein)
    '*'  // Temporary testing ke liye, baad mein hata dein
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

const upload = multer({ storage: multer.memoryStorage() });

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APP_KEY,
});

console.log("B2_BUCKET_ID:", process.env.B2_BUCKET_ID);
console.log("B2_BUCKET_NAME:", process.env.B2_BUCKET_NAME);

// ✅ Upload Endpoint - FIXED
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Har upload pe fresh authorize (best practice)
    await b2.authorize();
    
    const uploadUrlData = await b2.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID,
    });

    const file = req.file;
    const fileName = `images/${Date.now()}-${file.originalname}`;  // Folder mein save

    await b2.uploadFile({
      uploadUrl: uploadUrlData.data.uploadUrl,
      uploadAuthToken: uploadUrlData.data.authorizationToken,
      fileName: fileName,
      data: file.buffer,
    });

    // ✅ FIXED: Space hata diya! (f005 ya f002 check karein aapke B2 ke hisaab se)
    const fileUrl = `https://f005.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}`;

    console.log("✅ File uploaded:", fileUrl);
    res.json({ success: true, url: fileUrl });

  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("B2 Server Running ✅");
});

// ✅ FIXED: Railway port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
