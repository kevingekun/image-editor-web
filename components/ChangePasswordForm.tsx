
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { changePassword as apiChangePassword } from '../services/api';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

const ChangePasswordForm: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 8) {
      setError(t('common.passwordTooShort'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('common.passwordsNotMatch'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiChangePassword(oldPassword, newPassword);
      setSuccess(response.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center text-white mb-6">
        {t('common.changePassword')}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="oldPassword"
          label={t('common.oldPassword')}
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Input
          id="newPassword"
          label={t('common.newPassword')}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <Input
          id="confirmPassword"
          label={t('common.confirmNewPassword')}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('common.updatePassword')}
        </Button>
      </form>
    </Card>
  );
};

export default ChangePasswordForm;
