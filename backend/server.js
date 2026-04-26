const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/british-auction-rfq';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const { router: authRouter, authMiddleware } = require('./routes/auth');

// Routes
app.use('/api/auth', authRouter);

// Protected routes using authMiddleware
app.use('/api/rfqs', authMiddleware, require('./routes/rfqs'));
app.use('/api/bids', authMiddleware, require('./routes/bids'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


echo "# gocomet-assignment" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Pushpendra8318/gocomet-assignment.git
git push -u origin main
