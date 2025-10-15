
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import AuthForm from '../components/AuthForm';

const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AuthForm isRegister={isRegister} />
      <p className="mt-4 text-center text-sm text-gray-400">
        {isRegister ? t('auth.switchToLogin') : t('auth.switchToRegister')}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="font-medium text-indigo-400 hover:text-indigo-500 ml-1"
        >
          {isRegister ? t('auth.login') : t('auth.register')}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
