require("dotenv").config();
const express = require("express");
const multer = require("multer");
const B2 = require("backblaze-b2");
const cors = require("cors");

const app = express();

// ✅ CORS - Local testing ke liye
app.use(cors({
  origin: [
    'http://localhost:5173',      // Vite dev server
    'http://localhost:3000',      // React dev server  
    'http://localhost:5000',      // Aapka local
    '*'                           // ⚠️ Temporary - baad mein Firebase URL add karein
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

const upload = multer({ storage: multer.memoryStorage() });

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APP_KEY,
});

// ✅ Upload Endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    await b2.authorize();
    
    const uploadUrlData = await b2.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID,
    });

    const fileName = `images/${Date.now()}-${req.file.originalname}`;

    await b2.uploadFile({
      uploadUrl: uploadUrlData.data.uploadUrl,
      uploadAuthToken: uploadUrlData.data.authorizationToken,
      fileName: fileName,
      data: req.file.buffer,
    });

    const fileUrl = `https://f005.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}`;

    console.log("✅ Uploaded:", fileUrl);
    res.json({ success: true, url: fileUrl });

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("B2 Server Running ✅");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
