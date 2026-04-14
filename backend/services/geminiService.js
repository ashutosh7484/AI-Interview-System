// backend/services/geminiService.js

import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
// Try this model instead
const BASE_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';
// ─── Helper: call Gemini API directly ────────────────────
const callGemini = async (prompt) => {
  const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Gemini API call failed');
  }

  return data.candidates[0].content.parts[0].text;
};

// ─── Helper: clean and parse JSON from AI response ───────
const parseJSON = (text) => {
  try {
    const cleaned = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('❌ JSON parse failed. Raw response:\n', text);
    throw new Error('AI returned invalid JSON. Please try again.');
  }
};

// ─────────────────────────────────────────────────────────
// 1. GENERATE INTERVIEW QUESTIONS
// ─────────────────────────────────────────────────────────
export const generateQuestions = async (
  jobRole,
  difficulty = 'medium',
  numQuestions = 5
) => {
  const difficultyGuide = {
    easy:   'basic conceptual questions suitable for freshers',
    medium: 'intermediate questions mixing theory and practical scenarios',
    hard:   'advanced questions involving system design, edge cases, and deep expertise',
  };

  const prompt = `
You are a senior technical interviewer at a top tech company.
Generate exactly ${numQuestions} interview questions for a "${jobRole}" position.
Difficulty level: ${difficulty} — ${difficultyGuide[difficulty]}

Rules:
- Questions must be specific to the "${jobRole}" role
- Mix different question types: conceptual, situational, problem-solving
- Each question should be clear and concise (1-3 sentences max)
- Do NOT include answers
- Do NOT number the questions

Respond with ONLY a valid JSON array of strings. No explanation, no markdown.
Example: ["Question one here?", "Question two here?"]
`;

  const text = await callGemini(prompt);
  const questions = parseJSON(text);

  if (!Array.isArray(questions)) {
    throw new Error('AI did not return a question array');
  }

  return questions.slice(0, numQuestions);
};

// ─────────────────────────────────────────────────────────
// 2. EVALUATE CANDIDATE ANSWERS
// ─────────────────────────────────────────────────────────
export const evaluateAnswers = async (jobRole, difficulty, qaPairs) => {
  const formattedQA = qaPairs
    .map((pair, i) =>
      `Q${i + 1}: ${pair.question}\nA${i + 1}: ${pair.answer || '(no answer provided)'}`
    )
    .join('\n\n');

  const prompt = `
You are an expert technical interviewer evaluating a candidate for a "${jobRole}" role.
Difficulty level: ${difficulty}

Here are the candidate's interview answers:

${formattedQA}

Evaluate each answer and respond with ONLY a valid JSON object.
No explanation, no markdown, no extra text — just raw JSON.

Scoring guide:
- 0–3:  Poor (wrong, irrelevant, or blank)
- 4–6:  Average (partially correct, missing key details)
- 7–8:  Good (correct with minor gaps)
- 9–10: Excellent (thorough, accurate, well-explained)

Required JSON format:
{
  "questions": [
    {
      "score": <number 0-10>,
      "feedback": "<2-3 sentence specific feedback on this answer>"
    }
  ],
  "overallFeedback": "<3-4 sentence summary of overall performance>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<area 1>", "<area 2>"]
}

The "questions" array must have exactly ${qaPairs.length} items in the same order.
`;

  const text = await callGemini(prompt);
  const evaluation = parseJSON(text);

  if (!evaluation.questions || !Array.isArray(evaluation.questions)) {
    throw new Error('AI evaluation missing questions array');
  }

  // Ensure correct length
  while (evaluation.questions.length < qaPairs.length) {
    evaluation.questions.push({ score: 0, feedback: 'Not evaluated.' });
  }
  evaluation.questions = evaluation.questions.slice(0, qaPairs.length);

  // Clamp scores to 0-10
  evaluation.questions = evaluation.questions.map((q) => ({
    ...q,
    score: Math.min(10, Math.max(0, Number(q.score) || 0)),
  }));

  return {
    questions:       evaluation.questions,
    overallFeedback: evaluation.overallFeedback || 'No overall feedback provided.',
    strengths:       evaluation.strengths    || [],
    improvements:    evaluation.improvements || [],
  };
};