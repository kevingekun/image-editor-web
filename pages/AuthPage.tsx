
import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';

const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AuthForm isRegister={isRegister} />
      <p className="mt-4 text-center text-sm text-gray-400">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="font-medium text-indigo-400 hover:text-indigo-500 ml-1"
        >
          {isRegister ? 'Login' : 'Sign up'}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
