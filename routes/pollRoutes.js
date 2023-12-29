const express = require('express');
const router = express.Router();
const Poll = require('../models/poll');

// GET all polls
router.get('/all', async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a specific poll by ID
router.get('/:pollId', async (req, res) => {
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

// POST create a new poll
router.post('/create', async (req, res) => {
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

// PUT update a specific poll by ID
router.put('/:pollId', async (req, res) => {
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

// DELETE a specific poll by ID
router.delete('/:pollId', async (req, res) => {
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

module.exports = router;
