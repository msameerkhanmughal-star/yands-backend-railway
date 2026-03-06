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

app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Check env variables
console.log("ENV Check:");
console.log("B2_KEY_ID:", process.env.B2_KEY_ID ? "✅ Set" : "❌ Missing");
console.log("B2_APP_KEY:", process.env.B2_APP_KEY ? "✅ Set" : "❌ Missing");
console.log("B2_BUCKET_ID:", process.env.B2_BUCKET_ID ? "✅ Set" : "❌ Missing");
console.log("B2_BUCKET_NAME:", process.env.B2_BUCKET_NAME ? "✅ Set" : "❌ Missing");

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APP_KEY,
});

// Health Check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/", (req, res) => {
  res.send("B2 Server Running ✅");
});

// Upload Endpoint
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

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
