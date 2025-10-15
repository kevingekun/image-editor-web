import React from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
// FIX: `useAuth` is imported from `./hooks/useAuth` not `./contexts/AuthContext`.
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { useAuth } from './hooks/useAuth';
import { useLanguage } from './contexts/LanguageContext';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PaymentPage from './pages/PaymentPage';
import AboutUsPage from './pages/AboutUsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { t } = useLanguage();

    return(
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <Header />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
                <Routes>
                    <Route path="/auth" element={isAuthenticated ? <Navigate to="/" /> : <AuthPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/about" element={<AboutUsPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/" element={<DashboardPage />} />
                </Routes>
            </main>
            <footer className="text-center py-6">
                 <div className="flex justify-center items-center space-x-4 mb-2">
                    <Link to="/about" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">{t('footer.aboutUs')}</Link>
                    <span className="text-gray-600">|</span>
                    <Link to="/privacy" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">{t('footer.privacyPolicy')}</Link>
                </div>
                <p className="text-sm text-gray-500">
                    {t('footer.poweredBy')} <span className="font-semibold text-gray-400">Gemini Nano Banana</span>
                </p>
            </footer>
        </div>
    );
};

//Google Gemini Nano Banana


const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
          <HashRouter>
              <AppRoutes />
          </HashRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;