const express    = require('express');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer     = require('multer');
const Material   = require('../models/Material');
const { protect } = require('../middleware/authMiddleware');
const router     = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'flashmaster',
    resource_type:  'auto',
    allowed_formats: ['pdf', 'png', 'jpg', 'jpeg', 'txt', 'pptx', 'docx'],
  },
});

const upload = multer({ storage });

// POST /api/materials — upload material to Cloudinary
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
    console.error('Upload error:', err.message);
    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
});

// GET /api/materials — get all materials for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const materials = await Material.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// DELETE /api/materials/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;