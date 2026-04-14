// backend/testGemini.js
// Run with: node testGemini.js

import dotenv from 'dotenv';
dotenv.config();
console.log("Starting Gemini test...");
console.log("KEY FROM ENV:", process.env.GEMINI_API_KEY);
import { generateQuestions, evaluateAnswers } from './services/geminiService.js';
console.log("API KEY:", process.env.GEMINI_API_KEY);
const run = async () => {
  console.log('\n─── TEST 1: Generate Questions ───────────────');
  const questions = await generateQuestions('Frontend Developer', 'medium', 3);
  console.log('✅ Questions:', questions);

  console.log('\n─── TEST 2: Evaluate Answers ─────────────────');
  const qaPairs = questions.map((q, i) => ({
    question: q,
    answer: i === 0
      ? 'React hooks are functions that let you use state and lifecycle features in functional components. useState manages local state, useEffect handles side effects.'
      : i === 1
      ? 'I am not sure about this one.'
      : '', // Blank answer to test scoring
  }));

  const evaluation = await evaluateAnswers('Frontend Developer', 'medium', qaPairs);
  console.log('✅ Evaluation:');
  console.log('  Per-question scores:',
    evaluation.questions.map(q => `${q.score}/10`)
  );
  console.log('  Overall Feedback:', evaluation.overallFeedback);
  console.log('  Strengths:', evaluation.strengths);
  console.log('  Improvements:', evaluation.improvements);
};

run().catch(console.error);