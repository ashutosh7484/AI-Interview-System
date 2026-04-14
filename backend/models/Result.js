// backend/models/Result.js

import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
    },
    jobRole:      { type: String, required: true },
    difficulty:   { type: String, required: true },
    totalScore:   { type: Number, required: true },    // 0–100
    totalQuestions: { type: Number, required: true },
    overallFeedback: { type: String, default: '' },
    strengths:    [String],   // AI-identified strong areas
    improvements: [String],   // AI-identified weak areas
    timeTaken:    { type: Number, default: 0 },        // seconds
  },
  { timestamps: true }
);

const Result = mongoose.model('Result', resultSchema);
export default Result;