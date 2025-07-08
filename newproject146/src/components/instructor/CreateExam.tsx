import React, { useState } from 'react';
import { Question } from '../../types';

const CreateExam: React.FC = () => {
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 60,
    totalPoints: 100,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    text: '',
    type: 'multiple-choice',
    points: 10,
    options: ['', '', '', ''],
  });

  const handleExamDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setExamData({
      ...examData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCurrentQuestion({
      ...currentQuestion,
      [e.target.name]: e.target.value,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    });
  };

  const addQuestion = () => {
    if (currentQuestion.text && currentQuestion.points) {
      const newQuestion: Question = {
        id: Date.now().toString(),
        text: currentQuestion.text,
        type: currentQuestion.type as 'multiple-choice' | 'true-false' | 'short-answer',
        points: currentQuestion.points,
        options: currentQuestion.type === 'multiple-choice' ? currentQuestion.options : undefined,
      };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion({
        text: '',
        type: 'multiple-choice',
        points: 10,
        options: ['', '', '', ''],
      });
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle exam creation
    console.log('Creating exam:', { ...examData, questions });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Exam</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Exam Details */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Exam Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Exam Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={examData.title}
                onChange={handleExamDataChange}
                className="input-field"
                placeholder="Enter exam title"
                required
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={examData.duration}
                onChange={handleExamDataChange}
                className="input-field"
                min="1"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={examData.description}
                onChange={handleExamDataChange}
                className="input-field"
                rows={3}
                placeholder="Enter exam description"
                required
              />
            </div>
            <div>
              <label htmlFor="totalPoints" className="block text-sm font-medium text-gray-700 mb-1">
                Total Points
              </label>
              <input
                type="number"
                id="totalPoints"
                name="totalPoints"
                value={examData.totalPoints}
                onChange={handleExamDataChange}
                className="input-field"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Questions</h3>
          
          {/* Add Question Form */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Add New Question</h4>
            <div className="space-y-4">
              <div>
                <label htmlFor="questionText" className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text
                </label>
                <textarea
                  id="questionText"
                  name="text"
                  value={currentQuestion.text}
                  onChange={handleQuestionChange}
                  className="input-field"
                  rows={2}
                  placeholder="Enter question text"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="questionType" className="block text-sm font-medium text-gray-700 mb-1">
                    Question Type
                  </label>
                  <select
                    id="questionType"
                    name="type"
                    value={currentQuestion.type}
                    onChange={handleQuestionChange}
                    className="input-field"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="short-answer">Short Answer</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="questionPoints" className="block text-sm font-medium text-gray-700 mb-1">
                    Points
                  </label>
                  <input
                    type="number"
                    id="questionPoints"
                    name="points"
                    value={currentQuestion.points}
                    onChange={handleQuestionChange}
                    className="input-field"
                    min="1"
                  />
                </div>
              </div>

              {currentQuestion.type === 'multiple-choice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options
                  </label>
                  <div className="space-y-2">
                    {currentQuestion.options?.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="input-field"
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={addQuestion}
                className="btn-primary"
              >
                Add Question
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-900">
                    Question {index + 1}: {question.text}
                  </h5>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Type: {question.type} | Points: {question.points}
                </div>
                {question.options && (
                  <div className="mt-2">
                    <div className="text-sm font-medium text-gray-700 mb-1">Options:</div>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {question.options.map((option, optIndex) => (
                        <li key={optIndex}>{option}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary"
            disabled={questions.length === 0}
          >
            Create Exam
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExam; 