const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
require('dotenv').config();
 
const app = express();
 
// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
// Routes
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/materials',  require('./routes/materials'));
app.use('/api/flashcards', require('./routes/flashcards'));
app.use('/api/plans',      require('./routes/studyplans'));
app.use('/api/progress',   require('./routes/progress'));
 
// Test route
app.get('/', (req, res) => {
  res.send('FLASHMASTER API is running!');
});
 
// Connect MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running on port ' + (process.env.PORT || 5000));
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });
 