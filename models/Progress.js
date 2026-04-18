const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject:         { type: String },
  completedTopics: { type: Number, default: 0 },
  pendingTopics:   { type: Number, default: 0 },
  revisionStatus:  { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
}, { timestamps: true });

module.exports = mongoose.model('Progress', ProgressSchema);