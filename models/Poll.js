// File: models/poll.js

const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
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

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
