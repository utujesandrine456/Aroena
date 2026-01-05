'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { api } from '../lib/api';


export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);


  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.login(email, password);
      const token = res.token;

      localStorage.setItem('adminToken', token);
      document.cookie = `admin=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
      router.push('/dashboard');
    } catch (err: any) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-[#FF4A1C]">Aroena Admin</h1>
          <p className="text-gray-600 mt-2">Hotel & Restaurant Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
            <p className="text-gray-600 mt-1">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A1C]/50 focus:border-[#FF4A1C] focus:outline-none transition-all duration-200"
                  placeholder="xxxxx@gmail.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A1C]/50 focus:border-[#FF4A1C] focus:outline-none transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}


            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF4A1C] hover:bg-[#FF5A2C] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF4A1C]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in to Dashboard'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              © {new Date().getFullYear()} Aroena Hotel. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <div className="w-1 h-1 bg-[#FF4A1C] rounded-full"></div>
              <div className="w-1 h-1 bg-[#FF4A1C] rounded-full"></div>
              <div className="w-1 h-1 bg-[#FF4A1C] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}