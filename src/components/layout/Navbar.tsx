import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, LineChart, MessageSquareText, LogIn } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-accent-500" />
            <span className="text-xl font-bold text-neutral-900">Campus Pulse</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              to="/feedback" 
              className="text-neutral-700 hover:text-primary-600 font-medium flex items-center space-x-1"
            >
              <MessageSquareText className="h-5 w-5" />
              <span>Feedback</span>
            </Link>

            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                to="/dashboard" 
                className="text-neutral-700 hover:text-primary-600 font-medium flex items-center space-x-1"
              >
                <LineChart className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-neutral-600">
                  Welcome, <span className="font-medium">{user?.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="btn btn-secondary flex items-center space-x-1 py-1.5"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="btn btn-primary flex items-center space-x-1 py-1.5"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;