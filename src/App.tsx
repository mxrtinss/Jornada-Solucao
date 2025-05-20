import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProgramDetailPage from './pages/ProgramDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/layout/Layout';
import { ToastProvider } from './contexts/ToastContext';
import CompletedProgramsPage from './pages/CompletedProgramsPage';
// Adicione a importação da página de funcionários
import EmployeesPage from './pages/EmployeesPage';
import WeekendLockScreen from './components/auth/WeekendLockScreen';
// Importe a página de teste
import TestWeekendLock from './pages/TestWeekendLock';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isWeekendLocked } = useAuth();
  
  if (isWeekendLocked) {
    return <WeekendLockScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

function App() {
  const { isWeekendLocked } = useAuth();
  
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          {isWeekendLocked ? (
            <Routes>
              <Route path="*" element={<WeekendLockScreen />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              <Route path="/programs/:id" element={
                <ProtectedRoute>
                  <ProgramDetailPage />
                </ProtectedRoute>
              } />
              
              <Route path="/completed-programs" element={
                <ProtectedRoute>
                  <CompletedProgramsPage />
                </ProtectedRoute>
              } />
              
              {/* Adicione a rota para a página de funcionários */}
              <Route path="/employees" element={
                <ProtectedRoute>
                  <EmployeesPage />
                </ProtectedRoute>
              } />
              
              <Route path="/test-weekend-lock" element={<TestWeekendLock />} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          )}
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;



