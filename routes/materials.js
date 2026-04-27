const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Material = require('../models/Material');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const fs = require('fs');

// ─────────────────────────────────────────────
// CLOUDINARY CONFIG
// ─────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─────────────────────────────────────────────
// MULTER (DISK STORAGE - IMPORTANT FIX)
// ─────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// ─────────────────────────────────────────────
// UPLOAD MATERIAL
// ─────────────────────────────────────────────
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    console.log("FILE RECEIVED:", req.file);

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const { subject, title, topic } = req.body;

    if (!subject || !title) {
      return res.status(400).json({ msg: 'Subject and Title are required' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'flashmaster',
      resource_type: 'auto',
    });

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    // Save to MongoDB
    const material = await Material.create({
      userId: req.user.id,
      subject: subject.trim(),
      title: title.trim(),
      topic: topic ? topic.trim() : '',
      fileUrl: result.secure_url,
      fileType: req.file.mimetype,
    });

    res.status(201).json(material);

  } catch (err) {
    console.error('UPLOAD ERROR:', err);
    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
});

// ─────────────────────────────────────────────
// GET MATERIALS
// ─────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const materials = await Material.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// DELETE MATERIAL
// ─────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;