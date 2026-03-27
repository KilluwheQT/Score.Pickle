import MatchSetup from '../components/MatchSetup.js';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-800">🏓 Pickleball Score</span>
            </div>
            <div className="flex space-x-4">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <MatchSetup />
      </main>
    </div>
  );
}
