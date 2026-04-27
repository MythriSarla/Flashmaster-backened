const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app = express();

// ✅ FIX CORS HERE (replace old app.use(cors()))
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://flashmaster-frontend-qmf9.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/materials', require('./routes/materials'));
app.use('/api/flashcards', require('./routes/flashcards'));
app.use('/api/plans', require('./routes/studyplans'));
app.use('/api/progress', require('./routes/progress'));

// Test route
app.get('/', (req, res) => {
  res.send('FLASHMASTER API is running!');
});

// DEBUG (VERY IMPORTANT)
console.log("ENV CHECK:");
console.log("MONGO:", process.env.MONGO_URI ? "OK" : "MISSING");
console.log("CLOUD:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("KEY:", process.env.CLOUDINARY_API_KEY);
console.log("SECRET:", process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING");

// MongoDB + Server start
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