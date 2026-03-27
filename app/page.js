'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext.js';
import { AuthWrapper } from '../components/AuthWrapper.js';
import MatchSetup from '../components/MatchSetup.js';

function HomePage() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">🏓 Pickleball Scoring</h1>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8 sm:pt-1">
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/history"
                  className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  History
                </Link>
                <Link
                  href="/multi-court"
                  className="text-orange-600 hover:text-orange-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Multi-Court
                </Link>
                <Link
                  href="/league"
                  className="text-purple-600 hover:text-purple-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  League Board
                </Link>
                <Link
                  href="/live"
                  className="text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Live OBS
                </Link>
                <Link
                  href="/viewer/demo"
                  className="text-purple-600 hover:text-purple-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  OBS Viewer
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-purple-600 hover:text-purple-800 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Pickleball Scoring System
            </h2>
            <p className="text-lg text-gray-600">
              Create and manage pickleball matches with real-time scoring
            </p>
          </div>

          {/* Match Setup */}
          <MatchSetup />
        </div>
      </main>
    </div>
  );
}

export default function ProtectedHomePage() {
  return (
    <AuthWrapper>
      <HomePage />
    </AuthWrapper>
  );
}
