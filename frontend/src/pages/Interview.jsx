import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interview = location.state?.interview;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers,      setAnswers]      = useState({});
  const [submitting,   setSubmitting]   = useState(false);
  const [timeElapsed,  setTimeElapsed]  = useState(0);
  const timerRef = useRef(null);

  // Redirect if no interview data
  useEffect(() => {
    if (!interview) navigate('/dashboard');
  }, [interview]);

  // Start timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeElapsed((t) => t + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  if (!interview) return null;

  const questions    = interview.questions || [];
  const totalQ       = questions.length;
  const currentQ     = questions[currentIndex];
  const progress     = ((currentIndex) / totalQ) * 100;
  const currentAnswer = answers[currentQ?.id] || '';

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
  };

  const handleNext = () => {
    if (currentIndex < totalQ - 1) setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const answeredCount = Object.values(answers).filter((a) => a.trim()).length;

  const handleSubmit = async () => {
    const unanswered = totalQ - answeredCount;
    if (unanswered > 0) {
      const confirm = window.confirm(
        `You have ${unanswered} unanswered question(s). Submit anyway?`
      );
      if (!confirm) return;
    }

    setSubmitting(true);
    clearInterval(timerRef.current);

    try {
      const formattedAnswers = questions.map((q) => ({
        questionId: q.id,
        answerText: answers[q.id] || '',
      }));

      const { data } = await API.post('/interview/submit', {
        interviewId: interview.interviewId,
        answers:     formattedAnswers,
        timeTaken:   timeElapsed,
      });

      navigate(`/results/${interview.interviewId}`, {
        state: { result: data },
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed. Try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Submitting Overlay */}
      {submitting && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center 
                        justify-center z-50">
          <div className="w-16 h-16 border-4 border-indigo-500 
                          border-t-transparent rounded-full animate-spin mb-6" />
          <p className="text-white text-xl font-semibold">
            AI is evaluating your answers...
          </p>
          <p className="text-gray-400 text-sm mt-2">
            This may take a few seconds
          </p>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white font-bold text-lg">{interview.jobRole}</h1>
            <span className="text-gray-400 text-sm capitalize">
              {interview.difficulty} • {totalQ} questions
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg 
                            px-4 py-2 text-indigo-400 font-mono font-semibold">
              ⏱ {formatTime(timeElapsed)}
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg 
                            px-4 py-2 text-gray-300 text-sm">
              {answeredCount}/{totalQ} answered
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center 
                            justify-center text-white text-sm font-bold">
              {currentIndex + 1}
            </div>
            <span className="text-gray-400 text-sm">
              Question {currentIndex + 1} of {totalQ}
            </span>
          </div>

          <p className="text-white text-lg font-medium leading-relaxed mb-8">
            {currentQ?.questionText}
          </p>

          <textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here... Be as detailed as possible."
            rows={7}
            className="w-full bg-gray-800 border border-gray-700 text-white 
                       rounded-xl px-5 py-4 focus:outline-none focus:border-indigo-500 
                       transition placeholder-gray-500 resize-none text-sm leading-relaxed"
          />

          <div className="flex items-center justify-between mt-3">
            <span className="text-gray-500 text-xs">
              {currentAnswer.length} characters
            </span>
            {currentAnswer.trim() && (
              <span className="text-green-400 text-xs">✓ Answered</span>
            )}
          </div>
        </div>

        {/* Question Navigator (dots) */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex
                  ? 'bg-indigo-500 scale-125'
                  : answers[questions[i].id]?.trim()
                  ? 'bg-green-500'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 
                       disabled:cursor-not-allowed text-gray-300 py-3 rounded-xl 
                       transition font-medium"
          >
            ← Previous
          </button>

          {currentIndex < totalQ - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white 
                         py-3 rounded-xl transition font-semibold"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-green-600 hover:bg-green-700 
                         disabled:bg-green-900 text-white py-3 rounded-xl 
                         transition font-semibold"
            >
              Submit Interview ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;