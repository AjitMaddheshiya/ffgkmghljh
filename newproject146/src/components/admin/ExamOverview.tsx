import React, { useState } from 'react';
import { Exam } from '../../types';

const ExamOverview: React.FC = () => {
  const [exams] = useState<Exam[]>([
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
      title: 'Physics Midterm',
      description: 'Physics concepts and problem solving',
      duration: 90,
      totalPoints: 75,
      questions: [],
      instructorId: '2',
      createdAt: '2024-01-10T14:20:00Z',
      isActive: false,
    },
    {
      id: '3',
      title: 'English Literature Quiz',
      description: 'Analysis of classic literature works',
      duration: 60,
      totalPoints: 50,
      questions: [],
      instructorId: '2',
      createdAt: '2024-01-05T09:00:00Z',
      isActive: true,
    },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Exam Overview</h2>
        <div className="flex space-x-2">
          <select className="input-field w-40">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn-primary">
            Export Data
          </button>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {exam.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {exam.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exam.duration} minutes
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exam.totalPoints} points
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      exam.isActive 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {exam.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(exam.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                      View
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamOverview; 