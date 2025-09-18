import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, config: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback': () => void;
      }) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

interface AuthFormProps {
  isRegister: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const { login, register } = useAuth();
  const turnstileWidgetId = useRef<string | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRegister || !turnstileContainerRef.current) {
      return;
    }

    // Load Turnstile script with timeout
    const loadTurnstileScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.turnstile) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Turnstile script'));
        document.head.appendChild(script);

        // 10-second timeout
        setTimeout(() => reject(new Error('Turnstile script load timed out')), 10000);
      });
    };

    const renderWidget = () => {
      if (!window.turnstile || !turnstileContainerRef.current) {
        setTurnstileError('Security check initialization failed: container or script unavailable');
        return;
      }
      try {
        turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: '0x4AAAAAAB1sAprgBvGnIIO1',
          callback: (token: string) => setTurnstileToken(token),
          'expired-callback': () => {
            setTurnstileToken(null);
            setTurnstileError('Security check expired. Please try again.');
          },
        });
        if (!turnstileWidgetId.current) {
          throw new Error('Failed to render security check widget');
        }
      } catch (err) {
        setTurnstileError('Failed to initialize security check. Please try again later.');
        console.error('Turnstile render error:', err);
      }
    };

    let isMounted = true;
    loadTurnstileScript()
      .then(() => {
        if (isMounted) {
          renderWidget();
        }
      })
      .catch((err) => {
        if (isMounted) {
          setTurnstileError(err.message || 'Failed to load security check');
          console.error('Turnstile script load error:', err);
        }
      });

    return () => {
      isMounted = false;
      if (turnstileWidgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidgetId.current);
        } catch (err) {
          console.error('Turnstile remove error:', err);
        }
        turnstileWidgetId.current = null;
      }
    };
  }, [isRegister]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTurnstileError(null);
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
    } else if (!turnstileToken) {
      setError('Please complete the security check.');
      setIsLoading(false);
      return;
    }

    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password, turnstileToken);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      if (!isRegister && turnstileWidgetId.current && window.turnstile) {
        try {
          window.turnstile.reset(turnstileWidgetId.current);
          setTurnstileToken(null);
        } catch (resetErr) {
          console.error('Turnstile reset error:', resetErr);
          setTurnstileError('Failed to reset security check. Please refresh the page.');
        }
      }
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
        {!isRegister && (
          <div
            ref={turnstileContainerRef}
            className="my-4 flex justify-center"
            aria-label="Security verification"
          >
            {turnstileError && <p className="text-red-400 text-sm">{turnstileError}</p>}
          </div>
        )}
        {(error || turnstileError) && (
          <p className="text-red-400 text-sm">{error || turnstileError}</p>
        )}
        <Button type="submit" isLoading={isLoading} className="w-full">
          {isRegister ? 'Register' : 'Login'}
        </Button>
      </form>
    </Card>
  );
};

export default AuthForm;