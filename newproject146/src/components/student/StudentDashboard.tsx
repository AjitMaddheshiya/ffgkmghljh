import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Exam } from '../../types';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available');

  const [availableExams] = useState<Exam[]>([
    {
      id: '1',
      title: 'Mathematics Final Exam',
      description: 'Comprehensive mathematics examination covering algebra and calculus',
      duration: 120,
      totalPoints: 100,
      questions: [],
      instructorId: '2',
      createdAt: '2024-01-15T10:30:00Z',
      isActive: true,
    },
    {
      id: '2',
      title: 'Physics Quiz',
      description: 'Basic physics concepts and problem solving',
      duration: 60,
      totalPoints: 50,
      questions: [],
      instructorId: '2',
      createdAt: '2024-01-10T14:20:00Z',
      isActive: true,
    },
  ]);

  const [completedExams] = useState([
    {
      id: '3',
      title: 'English Literature Quiz',
      score: 85,
      totalPoints: 100,
      completedAt: '2024-01-12T15:30:00Z',
    },
    {
      id: '4',
      title: 'History Midterm',
      score: 92,
      totalPoints: 100,
      completedAt: '2024-01-08T10:15:00Z',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Student Dashboard
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Available Exams</h3>
            <p className="text-3xl font-bold text-primary-600">{availableExams.length}</p>
            <p className="text-sm text-gray-500">Ready to take</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Completed Exams</h3>
            <p className="text-3xl font-bold text-primary-600">{completedExams.length}</p>
            <p className="text-sm text-gray-500">Finished</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Average Score</h3>
            <p className="text-3xl font-bold text-primary-600">
              {completedExams.length > 0 
                ? Math.round(completedExams.reduce((acc, exam) => acc + exam.score, 0) / completedExams.length)
                : 0
              }%
            </p>
            <p className="text-sm text-gray-500">Overall performance</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('available')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'available'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Available Exams
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'completed'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed Exams
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'available' && (
          <div className="grid gap-6">
            {availableExams.map((exam) => (
              <div key={exam.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{exam.title}</h3>
                    <p className="text-gray-600 mb-3">{exam.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-1 font-medium">{exam.duration} minutes</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Points:</span>
                        <span className="ml-1 font-medium">{exam.totalPoints}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Questions:</span>
                        <span className="ml-1 font-medium">{exam.questions.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className="ml-1 font-medium text-green-600">Available</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Link
                      to={`/exam/${exam.id}`}
                      className="btn-primary"
                    >
                      Start Exam
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {availableExams.length === 0 && (
              <div className="card text-center py-12">
                <p className="text-gray-500 mb-4">No available exams at the moment</p>
                <p className="text-sm text-gray-400">Check back later for new exams</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="grid gap-6">
            {completedExams.map((exam) => (
              <div key={exam.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{exam.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Score:</span>
                        <span className="ml-1 font-medium">{exam.score}/{exam.totalPoints}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Percentage:</span>
                        <span className="ml-1 font-medium">{Math.round((exam.score / exam.totalPoints) * 100)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Completed:</span>
                        <span className="ml-1 font-medium">
                          {new Date(exam.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className={`ml-1 font-medium ${
                          (exam.score / exam.totalPoints) >= 0.7 ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {(exam.score / exam.totalPoints) >= 0.7 ? 'Passed' : 'Needs Review'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button className="btn-secondary">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {completedExams.length === 0 && (
              <div className="card text-center py-12">
                <p className="text-gray-500 mb-4">No completed exams yet</p>
                <p className="text-sm text-gray-400">Start taking exams to see your results here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard; 