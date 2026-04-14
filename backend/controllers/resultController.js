// backend/controllers/resultController.js

import Result from '../models/Result.js';

// ─── @route  GET /api/results ────────────────────────────
// ─── @access Protected ───────────────────────────────────
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('interview', 'questions');

    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  GET /api/results/:id ────────────────────────
// ─── @access Protected ───────────────────────────────────
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate({
        path:   'interview',
        select: 'questions jobRole difficulty',
      });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    if (result.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  GET /api/results/stats/summary ──────────────
// ─── @access Protected ───────────────────────────────────
export const getStatsSummary = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id });

    if (!results.length) {
      return res.status(200).json({
        totalInterviews: 0,
        averageScore:    0,
        bestScore:       0,
        recentRoles:     [],
      });
    }

    const totalInterviews = results.length;
    const averageScore = Math.round(
      results.reduce((sum, r) => sum + r.totalScore, 0) / totalInterviews
    );
    const bestScore = Math.max(...results.map((r) => r.totalScore));
    const recentRoles = [
      ...new Set(results.slice(0, 5).map((r) => r.jobRole)),
    ];

    res.status(200).json({
      totalInterviews,
      averageScore,
      bestScore,
      recentRoles,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};