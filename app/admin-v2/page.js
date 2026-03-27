'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext.js';
import { getAllUsers, updateUserStatus } from '../../lib/auth-v2.js';

export default function AdminPage() {
  const { user, logout, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/dashboard');
      return;
    }

    loadUsers();
  }, [user, isAdmin, router]);

  const loadUsers = async () => {
    setLoading(true);
    const userList = await getAllUsers();
    setUsers(userList);
    setLoading(false);
  };

  const handleUpdateStatus = async (userId, status) => {
    setUpdating(prev => ({ ...prev, [userId]: true }));
    
    const result = await updateUserStatus(userId, status);
    
    if (result.success) {
      await loadUsers(); // Reload users
    } else {
      alert('Failed to update user status');
    }
    
    setUpdating(prev => ({ ...prev, [userId]: false }));
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const stats = {
    total: users.length,
    approved: users.filter(u => u.status === 'approved').length,
    pending: users.filter(u => u.status === 'pending').length,
    rejected: users.filter(u => u.status === 'rejected').length,
    admins: users.filter(u => u.role === 'admin').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-400 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-purple-400">🏓 Pickleball Pro</h1>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8 sm:pt-1">
                <Link
                  href="/dashboard"
                  className="text-purple-400 hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin"
                  className="text-purple-400 hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Welcome, {user?.name}</span>
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
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
            <p className="text-gray-400">Manage user accounts and system access</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-gray-900 border border-purple-500 rounded-xl p-6 shadow-lg shadow-purple-500/20">
              <div className="text-center">
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-purple-400">{stats.total}</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-green-500 rounded-xl p-6 shadow-lg shadow-green-500/20">
              <div className="text-center">
                <p className="text-sm text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-yellow-500 rounded-xl p-6 shadow-lg shadow-yellow-500/20">
              <div className="text-center">
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-red-500 rounded-xl p-6 shadow-lg shadow-red-500/20">
              <div className="text-center">
                <p className="text-sm text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-purple-500 rounded-xl p-6 shadow-lg shadow-purple-500/20">
              <div className="text-center">
                <p className="text-sm text-gray-400">Admins</p>
                <p className="text-2xl font-bold text-purple-400">{stats.admins}</p>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">User Management</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Referee Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          user.role === 'admin' 
                            ? 'bg-purple-500 text-black' 
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          user.status === 'approved' 
                            ? 'bg-green-500 text-black'
                            : user.status === 'pending'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-red-500 text-white'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-green-400">{user.refereeCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {user.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(user.id, 'approved')}
                                disabled={updating[user.id]}
                                className="bg-green-500 text-black px-3 py-1 rounded text-xs font-medium hover:bg-green-400 disabled:opacity-50"
                              >
                                {updating[user.id] ? '...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(user.id, 'rejected')}
                                disabled={updating[user.id]}
                                className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-400 disabled:opacity-50"
                              >
                                {updating[user.id] ? '...' : 'Reject'}
                              </button>
                            </>
                          )}
                          {user.status === 'approved' && user.role !== 'admin' && (
                            <button
                              onClick={() => handleUpdateStatus(user.id, 'rejected')}
                              disabled={updating[user.id]}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-400 disabled:opacity-50"
                            >
                              {updating[user.id] ? '...' : 'Deactivate'}
                            </button>
                          )}
                          {user.status === 'rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(user.id, 'pending')}
                              disabled={updating[user.id]}
                              className="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-medium hover:bg-yellow-400 disabled:opacity-50"
                            >
                              {updating[user.id] ? '...' : 'Review'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {users.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No users found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
