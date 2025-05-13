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

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
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
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;



