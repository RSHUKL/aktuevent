import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import FeedbackForm from './pages/FeedbackForm';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/feedback" replace />} />
        <Route path="feedback" element={<FeedbackForm />} />
        <Route path="login" element={<Login />} />
        <Route 
          path="dashboard/*" 
          element={
            <ProtectedRoute isAllowed={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;