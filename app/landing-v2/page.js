'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-400">🏓 Pickleball Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-green-400 hover:text-green-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-green-500 text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-green-400"
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
          <h1 className="text-5xl font-bold text-green-400 mb-6">
            Professional Pickleball Scoring
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Real-time multi-court scoring system with referee authentication and live match tracking
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link
              href="/signup"
              className="bg-green-500 text-black px-8 py-3 rounded-lg font-medium hover:bg-green-400 transition-all transform hover:scale-105 shadow-lg shadow-green-500/30"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-gray-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Features</h2>
            <p className="text-lg text-gray-400">Everything you need for professional tournament management</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900 border border-green-500 rounded-xl p-6 shadow-lg shadow-green-500/20">
              <div className="text-green-400 text-4xl mb-4">🏓</div>
              <h3 className="text-xl font-bold text-white mb-2">Real-Time Scoring</h3>
              <p className="text-gray-400">
                Live score updates with pickleball rules enforcement and serving indicators
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900 border border-purple-500 rounded-xl p-6 shadow-lg shadow-purple-500/20">
              <div className="text-purple-400 text-4xl mb-4">🏟️</div>
              <h3 className="text-xl font-bold text-white mb-2">Multi-Court Support</h3>
              <p className="text-gray-400">
                Monitor and score multiple courts simultaneously with real-time synchronization
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900 border border-yellow-500 rounded-xl p-6 shadow-lg shadow-yellow-500/20">
              <div className="text-yellow-400 text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-white mb-2">Referee Authentication</h3>
              <p className="text-gray-400">
                Secure referee code system ensures only authorized users can update scores
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-900 border border-blue-500 rounded-xl p-6 shadow-lg shadow-blue-500/20">
              <div className="text-blue-400 text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-white mb-2">User Management</h3>
              <p className="text-gray-400">
                Admin approval workflow with role-based access control
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-900 border border-red-500 rounded-xl p-6 shadow-lg shadow-red-500/20">
              <div className="text-red-400 text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-white mb-2">Mobile Responsive</h3>
              <p className="text-gray-400">
                Works perfectly on phones, tablets, and desktops
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-900 border border-cyan-500 rounded-xl p-6 shadow-lg shadow-cyan-500/20">
              <div className="text-cyan-400 text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">Live Updates</h3>
              <p className="text-gray-400">
                Real-time Firebase integration for instant score synchronization
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-lg text-gray-400">Simple three-step process to get started</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-black">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sign Up</h3>
              <p className="text-gray-400">
                Create your account and wait for admin approval
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Get Approved</h3>
              <p className="text-gray-400">
                Admin approves your account and assigns referee code
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-black">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Start Scoring</h3>
              <p className="text-gray-400">
                Use your referee code to update scores on any court
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-400 mb-8">
            Join the professional pickleball scoring system today
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/signup"
              className="bg-green-500 text-black px-8 py-3 rounded-lg font-medium hover:bg-green-400 transition-all transform hover:scale-105 shadow-lg shadow-green-500/30"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="bg-gray-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
