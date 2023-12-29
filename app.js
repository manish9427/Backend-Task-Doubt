require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const pollRoutes = require('./routes/pollRoutes.js');

const app = express();
const PORT =  3000;

// Connect to MongoDB
mongoose.connect("mongodb+srv://manish9427:manish9427@project.hwbxf7p.mongodb.net/?retryWrites=true&w=majority");
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/polls', pollRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
