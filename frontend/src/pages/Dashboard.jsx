import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Scientist', 'DevOps Engineer', 'UI/UX Designer',
  'Product Manager', 'Machine Learning Engineer',
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats,      setStats]      = useState(null);
  const [history,    setHistory]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [starting,   setStarting]   = useState(false);
  const [showModal,  setShowModal]  = useState(false);
  const [jobRole,    setJobRole]    = useState('Frontend Developer');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQ,       setNumQ]       = useState(5);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        API.get('/results/stats/summary'),
        API.get('/interview/history'),
      ]);
      setStats(statsRes.data);
      setHistory(historyRes.data.interviews || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = async () => {
    setStarting(true);
    try {
      const { data } = await API.post('/interview/start', {
        jobRole,
        difficulty,
        numQuestions: numQ,
      });
      navigate('/interview', { state: { interview: data } });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start interview');
    } finally {
      setStarting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 75) return 'bg-green-400/10 border-green-400/30';
    if (score >= 50) return 'bg-yellow-400/10 border-yellow-400/30';
    return 'bg-red-400/10 border-red-400/30';
  };

  const getDifficultyBadge = (d) => {
    const styles = {
      easy:   'bg-green-400/10 text-green-400 border border-green-400/30',
      medium: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30',
      hard:   'bg-red-400/10 text-red-400 border border-red-400/30',
    };
    return styles[d] || styles.medium;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent 
                        rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 mt-1">
            Ready to ace your next interview? Let's go.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: 'Total Interviews',
              value: stats?.totalInterviews ?? 0,
              icon: '🎯',
              color: 'text-indigo-400',
            },
            {
              label: 'Average Score',
              value: stats?.averageScore ? `${stats.averageScore}%` : 'N/A',
              icon: '📊',
              color: 'text-blue-400',
            },
            {
              label: 'Best Score',
              value: stats?.bestScore ? `${stats.bestScore}%` : 'N/A',
              icon: '🏆',
              color: 'text-yellow-400',
            },
          ].map((stat) => (
            <div key={stat.label}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="text-2xl mb-3">{stat.icon}</div>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Start Interview CTA */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 
                        border border-indigo-500/30 rounded-2xl p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center 
                          md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                Start a New Interview
              </h2>
              <p className="text-gray-400 text-sm">
                AI will generate questions tailored to your chosen role and difficulty.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold 
                         px-8 py-3 rounded-xl transition whitespace-nowrap"
            >
              🚀 Start Interview
            </button>
          </div>
        </div>

        {/* Interview History */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            Interview History
          </h2>

          {history.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 
                            text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-400">No interviews yet.</p>
              <p className="text-gray-500 text-sm mt-1">
                Start your first interview above!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((interview) => (
                <div key={interview._id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 
                             flex flex-col sm:flex-row sm:items-center 
                             sm:justify-between gap-4 hover:border-gray-700 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600/20 rounded-xl 
                                    flex items-center justify-center text-xl">
                      💼
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {interview.jobRole}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full 
                                         ${getDifficultyBadge(interview.difficulty)}`}>
                          {interview.difficulty}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {interview.questions?.length} questions
                        </span>
                        <span className="text-gray-500 text-xs">
                          {new Date(interview.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`border rounded-xl px-4 py-2 text-center 
                                    min-w-[80px] ${getScoreBg(interview.totalScore)}`}>
                      <div className={`text-xl font-bold 
                                      ${getScoreColor(interview.totalScore)}`}>
                        {interview.totalScore}%
                      </div>
                      <div className="text-gray-500 text-xs">Score</div>
                    </div>
                    <button
                      onClick={() => navigate(`/results/${interview._id}`)}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 
                                 hover:text-white px-4 py-2 rounded-lg text-sm transition"
                    >
                      View →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Start Interview Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center 
                        z-50 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 
                          w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-6">
              Configure Interview
            </h3>

            <div className="space-y-5">
              {/* Job Role */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Job Role
                </label>
                <select
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white 
                             rounded-lg px-4 py-3 focus:outline-none 
                             focus:border-indigo-500 transition"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['easy', 'medium', 'hard'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`py-2 rounded-lg text-sm font-medium capitalize 
                                  border transition ${
                        difficulty === d
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Number of Questions: <span className="text-indigo-400">{numQ}</span>
                </label>
                <input
                  type="range" min="3" max="10" value={numQ}
                  onChange={(e) => setNumQ(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-gray-500 text-xs mt-1">
                  <span>3</span><span>10</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 
                           py-3 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStartInterview}
                disabled={starting}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 
                           disabled:bg-indigo-800 text-white font-semibold 
                           py-3 rounded-xl transition flex items-center 
                           justify-center gap-2"
              >
                {starting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white 
                                    border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : '🚀 Start'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;