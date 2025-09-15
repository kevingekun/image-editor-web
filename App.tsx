import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
// FIX: `useAuth` is imported from `./hooks/useAuth` not `./contexts/AuthContext`.
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PaymentPage from './pages/PaymentPage';

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return(
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <Header />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
                <Routes>
                    <Route path="/auth" element={isAuthenticated ? <Navigate to="/" /> : <AuthPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/" element={<DashboardPage />} />
                </Routes>
            </main>
            <footer className="text-center py-6">
                <p className="text-sm text-gray-500">
                    Powered by <span className="font-semibold text-gray-400">DouBao AI</span>
                </p>
            </footer>
        </div>
    );
};

//Google Gemini Nano Banana


const App: React.FC = () => {
  return (
    <AuthProvider>
        <HashRouter>
            <AppRoutes />
        </HashRouter>
    </AuthProvider>
  );
};

export default App;