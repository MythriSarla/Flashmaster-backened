const express   = require('express');
const StudyPlan = require('../models/StudyPlan');
const { protect } = require('../middleware/authMiddleware');
const router    = express.Router();

// POST /api/plans  — create a new study plan
router.post('/', protect, async (req, res) => {
  try {
    const { subject, examDate, dailyStudyHours, chapters } = req.body;

    const plan = await StudyPlan.create({
      userId: req.user.id,
      subject,
      examDate,
      dailyStudyHours,
      chapters: chapters || [],
    });

    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET /api/plans  — get all study plans for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const plans = await StudyPlan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// PATCH /api/plans/:id/chapter  — mark a chapter as completed
router.patch('/:id/chapter', protect, async (req, res) => {
  try {
    const { chapterIndex, completed } = req.body;
    const plan = await StudyPlan.findById(req.params.id);

    if (!plan) return res.status(404).json({ msg: 'Plan not found' });

    plan.chapters[chapterIndex].completed = completed;
    await plan.save();

    res.json(plan);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// DELETE /api/plans/:id  — delete a study plan
router.delete('/:id', protect, async (req, res) => {
  try {
    await StudyPlan.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Study plan deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
