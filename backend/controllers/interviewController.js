// backend/controllers/interviewController.js

import Interview from '../models/Interview.js';
import Result    from '../models/Result.js';
import {
  generateQuestions,
  evaluateAnswers,
} from '../services/geminiService.js';

// ─── @route  POST /api/interview/start ───────────────────
// ─── @access Protected ───────────────────────────────────
export const startInterview = async (req, res) => {
  try {
    const { jobRole, difficulty = 'medium', numQuestions = 5 } = req.body;

    if (!jobRole) {
      return res.status(400).json({ message: 'Job role is required' });
    }

    // Call Gemini to generate questions
    const questionsFromAI = await generateQuestions(
      jobRole,
      difficulty,
      numQuestions
    );

    // Build question objects (no answers yet)
    const questions = questionsFromAI.map((q) => ({
      questionText: q,
      answerText:   '',
      score:        null,
      feedback:     '',
    }));

    // Save interview session to DB
    const interview = await Interview.create({
      user:       req.user._id,
      jobRole,
      difficulty,
      questions,
      status:     'in-progress',
    });

    res.status(201).json({
      message:     'Interview started',
      interviewId: interview._id,
      jobRole:     interview.jobRole,
      difficulty:  interview.difficulty,
      questions:   interview.questions.map((q) => ({
        id:           q._id,
        questionText: q.questionText,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  POST /api/interview/submit ──────────────────
// ─── @access Protected ───────────────────────────────────
export const submitInterview = async (req, res) => {
  try {
    const { interviewId, answers, timeTaken = 0 } = req.body;
    // answers: [{ questionId, answerText }]

    if (!interviewId || !answers || !answers.length) {
      return res.status(400).json({ message: 'Interview ID and answers required' });
    }

    // Fetch interview from DB
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Ownership check
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({ message: 'Interview already submitted' });
    }

    // Map submitted answers onto question objects
    answers.forEach(({ questionId, answerText }) => {
      const question = interview.questions.id(questionId);
      if (question) question.answerText = answerText;
    });

    // Build Q&A pairs for AI evaluation
    const qaPairs = interview.questions.map((q) => ({
      question: q.questionText,
      answer:   q.answerText || '(no answer provided)',
    }));

    // Call Gemini to evaluate
    const evaluation = await evaluateAnswers(
      interview.jobRole,
      interview.difficulty,
      qaPairs
    );

    // Apply AI scores and feedback to each question
    evaluation.questions.forEach((evalQ, index) => {
      if (interview.questions[index]) {
        interview.questions[index].score    = evalQ.score;
        interview.questions[index].feedback = evalQ.feedback;
      }
    });

    // Calculate total score (average, scaled to 100)
    const totalScore = Math.round(
      (interview.questions.reduce((sum, q) => sum + (q.score || 0), 0) /
        (interview.questions.length * 10)) *
        100
    );

    interview.totalScore      = totalScore;
    interview.overallFeedback = evaluation.overallFeedback;
    interview.status          = 'completed';

    await interview.save();

    // Create result summary document
    const result = await Result.create({
      user:            req.user._id,
      interview:       interview._id,
      jobRole:         interview.jobRole,
      difficulty:      interview.difficulty,
      totalScore,
      totalQuestions:  interview.questions.length,
      overallFeedback: evaluation.overallFeedback,
      strengths:       evaluation.strengths    || [],
      improvements:    evaluation.improvements || [],
      timeTaken,
    });

    res.status(200).json({
      message:         'Interview submitted and evaluated',
      resultId:        result._id,
      totalScore,
      overallFeedback: evaluation.overallFeedback,
      strengths:       evaluation.strengths,
      improvements:    evaluation.improvements,
      questions: interview.questions.map((q) => ({
        questionText: q.questionText,
        answerText:   q.answerText,
        score:        q.score,
        feedback:     q.feedback,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  GET /api/interview/history ──────────────────
// ─── @access Protected ───────────────────────────────────
export const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user:   req.user._id,
      status: 'completed',
    })
      .sort({ createdAt: -1 })
      .select('jobRole difficulty totalScore createdAt questions');

    res.status(200).json({ interviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  GET /api/interview/:id ──────────────────────
// ─── @access Protected ───────────────────────────────────
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ interview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};