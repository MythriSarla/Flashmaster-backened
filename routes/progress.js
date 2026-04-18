const express  = require('express');
const Progress = require('../models/Progress');
const { protect } = require('../middleware/authMiddleware');
const router   = express.Router();

// POST /api/progress  — create progress record for a subject
router.post('/', protect, async (req, res) => {
  try {
    const { subject, completedTopics, pendingTopics, revisionStatus } = req.body;

    const progress = await Progress.create({
      userId: req.user.id,
      subject,
      completedTopics: completedTopics || 0,
      pendingTopics:   pendingTopics   || 0,
      revisionStatus:  revisionStatus  || 'Not Started',
    });

    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET /api/progress  — get all progress for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// PATCH /api/progress/:id  — update progress
router.patch('/:id', protect, async (req, res) => {
  try {
    const updated = await Progress.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;