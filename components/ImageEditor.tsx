
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { editImage as apiEditImage } from '../services/api';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import Spinner from './ui/Spinner';

const ImageEditor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUserPoints, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setEditedImage(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !prompt) return;

    if (!isAuthenticated) {
        navigate('/auth');
        return;
    }

    // Now that we know user is authenticated, user object should exist.
    if (!user) return; // Type guard

    if (user.points < 1) {
      setError(t('editor.insufficientPoints'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const imageBase64 = await fileToBase64(imageFile);
      const result = await apiEditImage(prompt, imageBase64);
      setEditedImage(result.result);
      updateUserPoints(result.points_remaining);
    } catch (err: any) {
      setError(err.message || 'Failed to edit image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (editedImage) {
      window.open(editedImage, '_blank', 'noopener,noreferrer');
    }
  };

  const getButtonText = () => {
    if(isLoading) return t('editor.editing');
    if(!isAuthenticated) return t('editor.loginToEdit');
    return t('editor.editImage');
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-4">{t('editor.title')}</h2>
      <p className="text-gray-400 mb-6">{t('editor.subtitle')} <br/>{t('editor.loginToStart')}</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t('editor.uploadImage')}</label>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="image-upload"
              className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-md transition-colors duration-200 inline-block"
              role="button"
            >
              {t('editor.chooseFile')}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              required
            />
            <span className="text-gray-400 text-sm">
              {imageFile ? imageFile.name : t('editor.noFileSelected')}
            </span>
          </div>
        </div>

        <Input
          id="prompt"
          label={t('editor.prompt')}
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('editor.promptPlaceholder')}
          required
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        <Button type="submit" isLoading={isLoading} disabled={!imageFile || !prompt || (isAuthenticated && user?.points === 0)}>
          {getButtonText()}
        </Button>
      </form>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{t('editor.original')}</h3>
          {originalImage ? (
            <img src={originalImage} alt="Original" className="rounded-lg w-full h-auto object-cover" />
          ) : (
            <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
              {t('editor.yourImageWillAppear')}
            </div>
          )}
        </div>
        <div>
           <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">{t('editor.edited')}</h3>
            <Button
              onClick={handlePreview}
              disabled={!editedImage || isLoading}
              variant="secondary"
              className="py-1 px-3 text-sm"
            >
              {t('editor.preview')}
            </Button>
          </div>
          {isLoading ? (
            <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <Spinner />
            </div>
          ) : editedImage ? (
            <img src={editedImage} alt="Edited" className="rounded-lg w-full h-auto object-cover" />
          ) : (
            <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
              {t('editor.aiGeneratedResult')}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ImageEditor;