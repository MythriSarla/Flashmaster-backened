const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const Material = require('../models/Material');
const { protect } = require('../middleware/authMiddleware');
const router   = express.Router();

// Setup file storage using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST /api/materials  — upload a new material
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const { subject, title, topic } = req.body;

    const material = await Material.create({
      userId:   req.user.id,
      subject,
      title,
      topic,
      fileUrl:  req.file ? req.file.path : '',
      fileType: req.file ? req.file.mimetype : '',
    });

    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET /api/materials  — get all materials for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const materials = await Material.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// DELETE /api/materials/:id  — delete a material
router.delete('/:id', protect, async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;