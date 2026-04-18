const express   = require('express');
const Flashcard = require('../models/Flashcard');
const { protect } = require('../middleware/authMiddleware');
const router    = express.Router();

// Auto generate flashcards from text
function generateFromText(text, materialId, userId) {
  const lines = text
    .split(/[\n.]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20);

  const cards = [];
  for (let i = 0; i + 1 < lines.length; i += 2) {
    cards.push({
      materialId,
      userId,
      question:   lines[i] + '?',
      answer:     lines[i + 1],
      difficulty: 'medium',
    });
  }
  return cards;
}

// POST /api/flashcards/generate  — generate flashcards from text
router.post('/generate', protect, async (req, res) => {
  try {
    const { text, materialId } = req.body;

    if (!text || !materialId) {
      return res.status(400).json({ msg: 'Text and materialId are required' });
    }

    const cards = generateFromText(text, materialId, req.user.id);
    const saved = await Flashcard.insertMany(cards);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// POST /api/flashcards  — manually add one flashcard
router.post('/', protect, async (req, res) => {
  try {
    const { materialId, question, answer, difficulty } = req.body;
    const card = await Flashcard.create({
      materialId,
      userId: req.user.id,
      question,
      answer,
      difficulty: difficulty || 'medium',
    });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET /api/flashcards  — get all flashcards for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const cards = await Flashcard.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// PATCH /api/flashcards/:id/difficulty  — update difficulty level
router.patch('/:id/difficulty', protect, async (req, res) => {
  try {
    const card = await Flashcard.findByIdAndUpdate(
      req.params.id,
      { difficulty: req.body.difficulty },
      { new: true }
    );
    res.json(card);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// DELETE /api/flashcards/:id  — delete a flashcard
router.delete('/:id', protect, async (req, res) => {
  try {
    await Flashcard.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Flashcard deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;