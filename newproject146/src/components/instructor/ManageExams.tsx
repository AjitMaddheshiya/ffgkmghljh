import React, { useState } from 'react';
import { Exam } from '../../types';

const ManageExams: React.FC = () => {
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
  ]);

  const toggleExamStatus = (examId: string) => {
    // Handle exam status toggle
    console.log('Toggling exam status:', examId);
  };

  const deleteExam = (examId: string) => {
    // Handle exam deletion
    console.log('Deleting exam:', examId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Exams</h2>
        <div className="flex space-x-2">
          <select className="input-field w-40">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {exams.map((exam) => (
          <div key={exam.id} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    exam.isActive 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {exam.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
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
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-1 font-medium">
                      {new Date(exam.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => toggleExamStatus(exam.id)}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    exam.isActive
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {exam.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200">
                  Edit
                </button>
                <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200">
                  View Results
                </button>
                <button
                  onClick={() => deleteExam(exam.id)}
                  className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {exams.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No exams found</p>
          <button className="btn-primary">
            Create Your First Exam
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageExams; 