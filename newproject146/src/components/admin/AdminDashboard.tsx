import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserManagement from './UserManagement';
import ExamOverview from './ExamOverview';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              <Link
                to="/admin"
                className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                Overview
              </Link>
              <Link
                to="/admin/users"
                className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                User Management
              </Link>
              <Link
                to="/admin/exams"
                className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                Exam Overview
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/exams" element={<ExamOverview />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const AdminOverview: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-primary-600">1,234</p>
          <p className="text-sm text-gray-500">+12% from last month</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Exams</h3>
          <p className="text-3xl font-bold text-primary-600">45</p>
          <p className="text-sm text-gray-500">Currently running</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Submissions</h3>
          <p className="text-3xl font-bold text-primary-600">5,678</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New user registered</span>
              <span className="text-xs text-gray-400">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Exam completed</span>
              <span className="text-xs text-gray-400">5 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New exam created</span>
              <span className="text-xs text-gray-400">10 minutes ago</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Server Status</span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Security</span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 