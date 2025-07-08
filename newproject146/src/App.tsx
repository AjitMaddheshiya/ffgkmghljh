import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AdminDashboard from './components/admin/AdminDashboard';
import InstructorDashboard from './components/instructor/InstructorDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import ExamInterface from './components/student/ExamInterface';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/*" 
              element={
                <ProtectedRoute role="instructor">
                  <InstructorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/*" 
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/exam/:examId" 
              element={
                <ProtectedRoute role="student">
                  <ExamInterface />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 