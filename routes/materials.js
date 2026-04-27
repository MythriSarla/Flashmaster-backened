const express = require('express');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Material = require('../models/Material');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'flashmaster',
    resource_type: 'raw',
    public_id: Date.now() + '-' + file.originalname,
  }),
});

const upload = multer({ storage });

// ============================
// ✅ POST /api/materials
// ============================
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    let { subject, title, topic } = req.body;

    // 🔥 Fix empty values
    subject = subject ? subject.toString().trim() : '';
    title = title ? title.toString().trim() : '';
    topic = topic ? topic.toString().trim() : '';

    if (!subject || !title) {
      return res.status(400).json({ msg: 'Subject and Title are required' });
    }

    const material = await Material.create({
      userId: req.user.id,
      subject,
      title,
      topic,
      fileUrl: req.file ? req.file.path : '',
      fileType: req.file ? req.file.mimetype : '',
    });

    res.status(201).json(material);

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({
      msg: 'Upload failed',
      error: err.message
    });
  }
});

// ============================
// ✅ GET materials
// ============================
router.get('/', protect, async (req, res) => {
  try {
    const materials = await Material.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ============================
// ✅ DELETE material
// ============================
router.delete('/:id', protect, async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;