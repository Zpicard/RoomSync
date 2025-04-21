import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password, username);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create account');
      toast.error(err.response?.data?.error || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create your account"
      subtitle="Join RoomSync to start managing your shared living space"
    >
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
          <h3 className="text-white font-medium text-lg mb-3">Creating Your Account</h3>
          <p className="text-white/80 text-sm mb-3">To create your account, please provide:</p>
          <ul className="text-white/80 text-sm space-y-2">
            <li className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">1</span>
              A username (3+ characters)
            </li>
            <li className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">2</span>
              A valid email address
            </li>
            <li className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">3</span>
              A secure password (6+ characters)
            </li>
          </ul>
        </div>

        {error && (
          <motion.div 
            className="bg-red-50 dark:bg-red-900/50 text-red-900 dark:text-red-200 text-sm p-3 rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-white/90 pl-1">
            Username
          </label>
          <div className="mt-1">
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-colors duration-200"
              placeholder="Choose a username (3+ characters)"
            />
          </div>
          <p className="text-xs text-white/60 pl-1">This will be your display name in the app</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-white/90 pl-1">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-colors duration-200"
              placeholder="Enter your email address"
            />
          </div>
          <p className="text-xs text-white/60 pl-1">We'll use this for account recovery and notifications</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-white/90 pl-1">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-colors duration-200"
              placeholder="Create a strong password (6+ characters)"
            />
          </div>
          <p className="text-xs text-white/60 pl-1">Use a mix of letters, numbers, and symbols for better security</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 pl-1">
            Confirm password
          </label>
          <div className="mt-1">
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-colors duration-200"
              placeholder="Re-enter your password"
            />
          </div>
          <p className="text-xs text-white/60 pl-1">Make sure it matches the password above</p>
        </div>

        <div>
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-xl"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-90 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="relative px-6 py-3.5 text-white font-medium text-center">
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create account'
              )}
            </div>
          </motion.button>
        </div>

        <div className="text-center space-y-4">
          <p className="text-white/80">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-blue-300 hover:text-blue-200 transition-colors duration-200 font-medium"
            >
              Sign in
            </Link>
          </p>
          <p className="text-white/60 text-sm">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.form>
    </AuthLayout>
  );
};

export default SignUp; 