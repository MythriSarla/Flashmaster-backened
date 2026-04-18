const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject:  { type: String, required: true },
  title:    { type: String, required: true },
  fileUrl:  { type: String },
  fileType: { type: String },
  topic:    { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Material', MaterialSchema);