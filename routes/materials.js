const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Material = require('../models/Material');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    let { subject, title, topic } = req.body;
    subject = subject ? subject.toString().trim() : '';
    title   = title   ? title.toString().trim()   : '';
    topic   = topic   ? topic.toString().trim()   : '';

    if (!subject || !title) {
      return res.status(400).json({ msg: 'Subject and Title are required' });
    }

    let fileUrl  = '';
    let fileType = '';

    if (req.file) {
      console.log('Buffer size:', req.file.buffer.length);
      console.log('Mimetype:', req.file.mimetype);

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'flashmaster', resource_type: 'raw', public_id: Date.now().toString() + '.pdf' },
          (error, result) => { if (error) reject(error); else resolve(result); }
        );
        stream.end(req.file.buffer);
      });

      console.log('Uploaded URL:', result.secure_url);
      fileUrl  = result.secure_url;
      fileType = req.file.mimetype;
    }

    const material = await Material.create({ userId: req.user.id, subject, title, topic, fileUrl, fileType });
    res.status(201).json(material);
  } catch (err) {
    console.error('UPLOAD ERROR:', err);
    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const materials = await Material.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
