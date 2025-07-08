import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question } from '../../types';

const ExamInterface: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 120 minutes in seconds
  const [examStarted, setExamStarted] = useState(false);

  // Mock exam data - replace with API call
  const [exam] = useState({
    id: examId,
    title: 'Mathematics Final Exam',
    description: 'Comprehensive mathematics examination covering algebra and calculus',
    duration: 120,
    totalPoints: 100,
    questions: [
      {
        id: '1',
        text: 'What is the derivative of x²?',
        type: 'multiple-choice' as const,
        options: ['x', '2x', 'x²', '2x²'],
        points: 10,
      },
      {
        id: '2',
        text: 'Solve for x: 2x + 5 = 13',
        type: 'short-answer' as const,
        points: 15,
      },
      {
        id: '3',
        text: 'The derivative of a constant is zero.',
        type: 'true-false' as const,
        points: 5,
      },
    ] as Question[],
  });

  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examStarted, timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = () => {
    // Handle exam submission
    console.log('Submitting exam:', { examId, answers });
    navigate('/student');
  };

  const startExam = () => {
    setExamStarted(true);
  };

  const currentQuestion = exam.questions[currentQuestionIndex];

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto p-8">
          <div className="card text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{exam.title}</h1>
            <p className="text-gray-600 mb-6">{exam.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{exam.duration}</div>
                <div className="text-sm text-gray-500">Minutes</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{exam.questions.length}</div>
                <div className="text-sm text-gray-500">Questions</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{exam.totalPoints}</div>
                <div className="text-sm text-gray-500">Total Points</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-yellow-800 mb-2">Important Instructions:</h3>
              <ul className="text-sm text-yellow-700 space-y-1 text-left">
                <li>• You cannot go back once you start the exam</li>
                <li>• The timer will automatically submit your exam when time runs out</li>
                <li>• Make sure you have a stable internet connection</li>
                <li>• Do not refresh the page during the exam</li>
              </ul>
            </div>

            <button
              onClick={startExam}
              className="btn-primary text-lg px-8 py-3"
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{exam.title}</h1>
              <p className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500">Time Remaining</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Question {currentQuestionIndex + 1}
                </h2>
                <p className="text-gray-600">{currentQuestion.text}</p>
              </div>

              <div className="space-y-4">
                {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <label key={index} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={option}
                          checked={answers[currentQuestion.id] === option}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'true-false' && (
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value="true"
                        checked={answers[currentQuestion.id] === 'true'}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="text-gray-700">True</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value="false"
                        checked={answers[currentQuestion.id] === 'false'}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="text-gray-700">False</span>
                    </label>
                  </div>
                )}

                {currentQuestion.type === 'short-answer' && (
                  <textarea
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="input-field"
                    rows={4}
                    placeholder="Enter your answer here..."
                  />
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentQuestionIndex(Math.min(exam.questions.length - 1, currentQuestionIndex + 1))}
                  disabled={currentQuestionIndex === exam.questions.length - 1}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {exam.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`p-2 text-sm font-medium rounded ${
                      currentQuestionIndex === index
                        ? 'bg-primary-600 text-white'
                        : answers[exam.questions[index].id]
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-primary-600 rounded"></div>
                  <span>Current Question</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 rounded"></div>
                  <span>Unanswered</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={handleSubmit}
                  className="w-full btn-primary"
                >
                  Submit Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface; 