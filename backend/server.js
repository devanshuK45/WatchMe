// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tmdb', tmdbRoutes);

app.get('/', (req, res) => {
    res.send('WatchMe Backend Running...');
});

// Health check endpoint for cold-start detection
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/watchme';
console.log('Attempting to connect to MongoDB...', mongoURI.split('@').pop());

mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 10000, // 10s
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
