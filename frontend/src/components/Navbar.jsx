// frontend/src/components/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center 
                          justify-center text-white font-bold text-sm">AI</div>
          <span className="text-white font-semibold text-lg">InterviewAI</span>
        </Link>

        {/* Right side */}
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">
              👋 {user.name}
            </span>
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white text-sm transition"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 
                         hover:text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;