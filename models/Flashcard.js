const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question:   { type: String, required: true },
  answer:     { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'difficult'], default: 'medium' },
}, { timestamps: true });

module.exports = mongoose.model('Flashcard', FlashcardSchema);