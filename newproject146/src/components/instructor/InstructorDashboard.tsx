import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CreateExam from './CreateExam';
import ManageExams from './ManageExams';

const InstructorDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Instructor Dashboard
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
                to="/instructor"
                className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                Overview
              </Link>
              <Link
                to="/instructor/create-exam"
                className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                Create Exam
              </Link>
              <Link
                to="/instructor/manage-exams"
                className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                Manage Exams
              </Link>
              <Link
                to="/instructor/results"
                className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                View Results
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<InstructorOverview />} />
            <Route path="/create-exam" element={<CreateExam />} />
            <Route path="/manage-exams" element={<ManageExams />} />
            <Route path="/results" element={<ExamResults />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const InstructorOverview: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructor Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">My Exams</h3>
          <p className="text-3xl font-bold text-primary-600">12</p>
          <p className="text-sm text-gray-500">Total created</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Exams</h3>
          <p className="text-3xl font-bold text-primary-600">3</p>
          <p className="text-sm text-gray-500">Currently running</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Submissions</h3>
          <p className="text-3xl font-bold text-primary-600">156</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Exams</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Mathematics Final</h4>
                <p className="text-sm text-gray-500">Created 2 days ago</p>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Physics Quiz</h4>
                <p className="text-sm text-gray-500">Created 1 week ago</p>
              </div>
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">Draft</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/instructor/create-exam"
              className="block w-full text-left p-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
            >
              Create New Exam
            </Link>
            <Link
              to="/instructor/manage-exams"
              className="block w-full text-left p-3 bg-secondary-50 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              Manage Existing Exams
            </Link>
            <Link
              to="/instructor/results"
              className="block w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              View Exam Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExamResults: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Exam Results</h2>
      <div className="card">
        <p className="text-gray-500">Exam results will be displayed here.</p>
      </div>
    </div>
  );
};

export default InstructorDashboard; 