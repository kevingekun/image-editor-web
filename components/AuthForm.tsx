import React, { useState } from 'react';
// FIX: `useAuth` is imported from `../hooks/useAuth` not `../contexts/AuthContext`.
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

interface AuthFormProps {
  isRegister: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (isRegister) {
      if (!/^[a-zA-Z0-9]+$/.test(username)) {
        setError('Username must contain only letters and numbers.');
        setIsLoading(false);
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        setIsLoading(false);
        return;
      }
    }

    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-white mb-6">
        {isRegister ? 'Create Account' : 'Login'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="username"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" isLoading={isLoading} className="w-full">
          {isRegister ? 'Register' : 'Login'}
        </Button>
      </form>
    </Card>
  );
};

export default AuthForm;