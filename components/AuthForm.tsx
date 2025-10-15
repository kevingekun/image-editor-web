import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { sendEmailCode } from '../services/api';
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
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const turnstileWidgetId = useRef<string | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [countdown]);

  useEffect(() => {
    if (!turnstileContainerRef.current) {
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
            setTurnstileError(t('auth.securityCheckExpired'));
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

  const handleSendEmailCode = async () => {
    if (!email) {
      setError(t('auth.pleaseEnterEmail'));
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('auth.pleaseEnterValidEmail'));
      return;
    }
    
    setError(null);
    setIsSendingCode(true);
    
    try {
      await sendEmailCode(email, 'REGISTER');
      setCountdown(60); // 60秒倒计时
      setError(null);
    } catch (err: any) {
      setError(err.message || t('auth.failedToSendCode'));
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTurnstileError(null);
    setIsLoading(true);

    if (!turnstileToken) {
      setError(t('auth.pleaseCompleteSecurityCheck'));
      setIsLoading(false);
      return;
    }

    if (isRegister) {
      if (!/^[a-zA-Z0-9]+$/.test(username)) {
        setError(t('auth.usernameLettersNumbers'));
        setIsLoading(false);
        return;
      }
      if (password.length < 8) {
        setError(t('auth.passwordMinLength'));
        setIsLoading(false);
        return;
      }
      if (!email) {
        setError(t('auth.pleaseEnterEmail'));
        setIsLoading(false);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError(t('auth.pleaseEnterValidEmail'));
        setIsLoading(false);
        return;
      }
      if (!emailCode) {
        setError(t('auth.pleaseEnterVerificationCode'));
        setIsLoading(false);
        return;
      }
    }

    try {
      if (isRegister) {
        await register(username, password, email, emailCode, turnstileToken);
      } else {
        await login(username, password, turnstileToken);
      }
    } catch (err: any) {
      setError(err.message || t('auth.unexpectedError'));
      if (turnstileWidgetId.current && window.turnstile) {
        try {
          window.turnstile.reset(turnstileWidgetId.current);
          setTurnstileToken(null);
        } catch (resetErr) {
          console.error('Turnstile reset error:', resetErr);
          setTurnstileError(t('auth.failedToResetSecurityCheck'));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-white mb-6">
        {isRegister ? t('auth.register') : t('auth.login')}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="username"
          label={t('auth.username')}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          id="password"
          label={t('auth.password')}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {isRegister && (
          <>
            <Input
              id="email"
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="space-y-2">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    id="emailCode"
                    label={t('auth.verificationCode')}
                    type="text"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    placeholder={t('auth.enterVerificationCode')}
                    required
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleSendEmailCode}
                  disabled={!email || isSendingCode || countdown > 0}
                  isLoading={isSendingCode}
                  className="h-12 px-4 text-sm whitespace-nowrap mb-0"
                >
                  {countdown > 0 ? `${countdown}s` : t('auth.sendCode')}
                </Button>
              </div>
            </div>
          </>
        )}
        <div
          ref={turnstileContainerRef}
          className="my-4 flex justify-center"
          aria-label="Security verification"
        >
          {turnstileError && <p className="text-red-400 text-sm">{turnstileError}</p>}
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" isLoading={isLoading} className="w-full">
          {isRegister ? t('auth.registerButton') : t('auth.loginButton')}
        </Button>
      </form>
    </Card>
  );
};

export default AuthForm;