import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const Results = () => {
  const { id }      = useParams();
  const location    = useLocation();
  const navigate    = useNavigate();
  const [result,    setResult]    = useState(location.state?.result || null);
  const [loading,   setLoading]   = useState(!result);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!result) fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      // Try fetching as a result ID first, fallback to interview ID
      try {
        const { data } = await API.get(`/results/${id}`);
        setResult({
          totalScore:      data.result.totalScore,
          overallFeedback: data.result.overallFeedback,
          strengths:       data.result.strengths,
          improvements:    data.result.improvements,
          questions:       data.result.interview?.questions || [],
        });
      } catch {
        const { data } = await API.get(`/interview/${id}`);
        setResult({
          totalScore:      data.interview.totalScore,
          overallFeedback: data.interview.overallFeedback,
          strengths:       [],
          improvements:    [],
          questions:       data.interview.questions || [],
        });
      }
    } catch (err) {
      console.error('Failed to fetch result:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return { label: 'Excellent', color: 'text-green-400' };
    if (score >= 70) return { label: 'Good',      color: 'text-blue-400'  };
    if (score >= 50) return { label: 'Average',   color: 'text-yellow-400'};
    return               { label: 'Needs Work',  color: 'text-red-400'   };
  };

  const getPerQScoreColor = (score) => {
    if (score >= 8) return 'text-green-400 bg-green-400/10 border-green-400/30';
    if (score >= 6) return 'text-blue-400  bg-blue-400/10  border-blue-400/30';
    if (score >= 4) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    return 'text-red-400 bg-red-400/10 border-red-400/30';
  };

  const getScoreCircle = (score) => {
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (score / 100) * circumference;
    return { circumference, offset };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent 
                        rounded-full animate-spin" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Result not found</p>
          <button onClick={() => navigate('/dashboard')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { circumference, offset } = getScoreCircle(result.totalScore || 0);
  const scoreLabel = getScoreLabel(result.totalScore || 0);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Interview Complete! 🎉
          </h1>
          <p className="text-gray-400">Here's your detailed performance report</p>
        </div>

        {/* Score Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 
                        mb-8 flex flex-col md:flex-row items-center gap-8">
          {/* Circle Score */}
          <div className="flex-shrink-0">
            <svg width="140" height="140" className="-rotate-90">
              <circle cx="70" cy="70" r="54" fill="none"
                stroke="#1f2937" strokeWidth="10" />
              <circle cx="70" cy="70" r="54" fill="none"
                stroke={result.totalScore >= 75 ? '#22c55e'
                      : result.totalScore >= 50 ? '#eab308' : '#ef4444'}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="relative" style={{ marginTop: '-100px' }}>
              <div className={`text-4xl font-bold text-center 
                              ${getScoreColor(result.totalScore)}`}>
                {result.totalScore}%
              </div>
              <div className={`text-sm text-center ${scoreLabel.color}`}>
                {scoreLabel.label}
              </div>
            </div>
            <div style={{ height: '24px' }} />
          </div>

          {/* Overall Feedback */}
          <div className="flex-1">
            <h2 className="text-white font-bold text-lg mb-3">
              Overall Feedback
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              {result.overallFeedback}
            </p>
          </div>
        </div>

        {/* Strengths & Improvements */}
        {(result.strengths?.length > 0 || result.improvements?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Strengths */}
            <div className="bg-green-400/5 border border-green-400/20 
                            rounded-2xl p-6">
              <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                ✅ Strengths
              </h3>
              <ul className="space-y-2">
                {result.strengths?.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                    <span className="text-green-400 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-orange-400/5 border border-orange-400/20 
                            rounded-2xl p-6">
              <h3 className="text-orange-400 font-bold mb-4 flex items-center gap-2">
                🎯 Areas to Improve
              </h3>
              <ul className="space-y-2">
                {result.improvements?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                    <span className="text-orange-400 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['overview', 'details'].map((tab) => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize 
                          transition ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'overview' ? '📊 Score Overview' : '📝 Detailed Answers'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          /* Score Overview */
          <div className="space-y-3">
            {result.questions?.map((q, i) => (
              <div key={i}
                className="bg-gray-900 border border-gray-800 rounded-xl 
                           p-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center 
                                justify-center text-gray-400 text-sm font-bold 
                                flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm truncate">
                    {q.questionText}
                  </p>
                </div>
                <div className={`border rounded-lg px-3 py-1.5 text-center 
                                 min-w-[60px] flex-shrink-0 
                                 ${getPerQScoreColor(q.score ?? 0)}`}>
                  <div className="font-bold text-sm">{q.score ?? 0}/10</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Detailed Answers */
          <div className="space-y-6">
            {result.questions?.map((q, i) => (
              <div key={i}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-indigo-600/20 rounded-lg 
                                    flex items-center justify-center text-indigo-400 
                                    text-sm font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-white font-medium leading-relaxed text-sm">
                      {q.questionText}
                    </p>
                  </div>
                  <div className={`border rounded-lg px-3 py-1.5 text-center 
                                   min-w-[60px] flex-shrink-0 
                                   ${getPerQScoreColor(q.score ?? 0)}`}>
                    <div className="font-bold">{q.score ?? 0}/10</div>
                  </div>
                </div>

                {/* Answer */}
                <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase 
                                tracking-wide">Your Answer</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {q.answerText?.trim() || (
                      <span className="text-gray-500 italic">No answer provided</span>
                    )}
                  </p>
                </div>

                {/* Feedback */}
                {q.feedback && (
                  <div className="bg-indigo-500/5 border border-indigo-500/20 
                                  rounded-xl p-4">
                    <p className="text-xs text-indigo-400 mb-2 font-medium uppercase 
                                  tracking-wide">AI Feedback</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {q.feedback}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 
                       hover:text-white py-3 rounded-xl transition font-medium"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white 
                       font-semibold py-3 rounded-xl transition"
          >
            🚀 New Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;