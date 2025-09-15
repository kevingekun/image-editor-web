import React from 'react';
import { Link } from 'react-router-dom';
// FIX: `useAuth` is imported from `../hooks/useAuth` not `../contexts/AuthContext`.
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';
import Logo from './Logo';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-white tracking-tight">
            <Logo className="h-8 w-8 text-indigo-400" />
            <span>AI Image Editor</span>
          </Link>
          <nav>
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-300">
                  <span className="font-bold text-indigo-400">{user.points}</span> Points
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-300">Welcome, {user.username}</span>
                {/* FIX: Removed non-existent 'size' prop from Button. */}
                <Button onClick={logout} variant="secondary">
                  Logout
                </Button>
              </div>
            ) : (
                <Link to="/auth">
                    <Button variant="primary">Login</Button>
                </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;