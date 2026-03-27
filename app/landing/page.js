'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🏓 Pickleball Scoring</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Professional Pickleball Scoring System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Real-time match scoring, multi-court monitoring, and live OBS integration for tournaments and facilities.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Features</h2>
            <p className="text-lg text-gray-600">Everything you need for professional pickleball scoring</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-blue-600 text-4xl mb-4">🏓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Scoring</h3>
              <p className="text-gray-600">
                Live score updates with pickleball rules enforcement, serving indicators, and game progression tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-orange-600 text-4xl mb-4">🏟️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Court Support</h3>
              <p className="text-gray-600">
                Monitor and score up to 12 courts simultaneously with dynamic grid layouts and real-time synchronization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-red-600 text-4xl mb-4">📺</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">OBS Integration</h3>
              <p className="text-gray-600">
                Professional live streaming overlays with league boards, live scoreboards, and customizable viewer interfaces.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-purple-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">League Management</h3>
              <p className="text-gray-600">
                Tournament-style scoreboards with set tracking, game progression, and professional presentation.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-green-600 text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile Responsive</h3>
              <p className="text-gray-600">
                Works perfectly on phones, tablets, and desktops with touch-optimized interfaces.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-yellow-600 text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Access</h3>
              <p className="text-gray-600">
                Admin-controlled user accounts with approval workflows and role-based permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perfect For</h2>
            <p className="text-lg text-gray-600">Used by tournaments, facilities, and broadcasters</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tournaments</h3>
              <p className="text-gray-600">
                Professional tournament management with multi-court monitoring and live streaming.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏢</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Facilities</h3>
              <p className="text-gray-600">
                Court management systems for recreation centers, clubs, and sports complexes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📹</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Broadcasters</h3>
              <p className="text-gray-600">
                Professional OBS integration for live streaming and commentary overlays.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Create your account and request approval from your system administrator.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
