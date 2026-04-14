// backend/models/Interview.js

import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  answerText:   { type: String, default: '' },
  score:        { type: Number, default: null },   // AI score (0–10)
  feedback:     { type: String, default: '' },     // AI per-question feedback
});

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobRole: {
      type: String,
      required: true,        // e.g. "Frontend Developer"
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    questions: [questionSchema],  // Array of Q&A pairs
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'abandoned'],
      default: 'in-progress',
    },
    totalScore:    { type: Number, default: null },   // Final % score
    overallFeedback: { type: String, default: '' },   // AI summary
  },
  { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;