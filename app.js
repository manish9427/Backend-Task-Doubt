require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Model: poll.js
const Poll = mongoose.model('Poll', {
  pollTitle: { type: String, required: true },
  pollCategory: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  minReward: { type: Number, required: true },
  maxReward: { type: Number, required: true },
  questionSets: [
    {
      questionType: { type: String, required: true },
      questionText: { type: String, required: true },
      options: { type: [String], required: true }
    }
  ]
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/polls/all', async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/polls/:pollId', async (req, res) => {
  const { pollId } = req.params;

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    res.json(poll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/polls/create', async (req, res) => {
  const { pollTitle, pollCategory, startDate, endDate, minReward, maxReward, questionSets } = req.body;

  try {
    const newPoll = new Poll({
      pollTitle,
      pollCategory,
      startDate,
      endDate,
      minReward,
      maxReward,
      questionSets
    });

    const savedPoll = await newPoll.save();
    res.json({ pollId: savedPoll._id, message: 'Poll created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/polls/:pollId', async (req, res) => {
  const { pollId } = req.params;
  const updateParams = req.body;

  try {
    const updatedPoll = await Poll.findByIdAndUpdate(pollId, updateParams, { new: true });
    if (!updatedPoll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    res.json({ message: 'Poll updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/polls/:pollId', async (req, res) => {
  const { pollId } = req.params;

  try {
    const deletedPoll = await Poll.findByIdAndDelete(pollId);
    if (!deletedPoll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    res.json({ message: 'Poll deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
