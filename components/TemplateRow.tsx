
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { editImageByTemplate } from '../services/api';
import type { PromptTemplate } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import Spinner from './ui/Spinner';

interface TemplateRowProps {
  template: PromptTemplate;
}

const ImagePreview: React.FC<{ src?: string | null, alt: string, label: string, isLoading?: boolean }> = ({ src, alt, label, isLoading = false }) => (
  <div className="flex flex-col items-center space-y-2 w-48 flex-shrink-0">
    <h4 className="text-sm font-semibold text-gray-300 h-5">{label}</h4>
    {isLoading ? (
      <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
        <Spinner />
      </div>
    ) : src ? (
      <img src={src} alt={alt} className="rounded-lg w-full h-48 object-cover" />
    ) : (
      <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-sm p-2 text-center">
        {alt}
      </div>
    )}
  </div>
);

const TemplateRow: React.FC<TemplateRowProps> = ({ template }) => {
  const [userImageFile, setUserImageFile] = useState<File | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const [editedUserImage, setEditedUserImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUserPoints, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUserImageFile(file);
      setEditedUserImage(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImagePreview(reader.result as string);
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

  const handleSubmit = async () => {
    if (!userImageFile) return;

    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (!user) return; // Type guard

    if (user.points < 1) {
      setError(t('editor.insufficientPoints'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedUserImage(null);

    try {
      const imageBase64 = await fileToBase64(userImageFile);
      const result = await editImageByTemplate(template.id, imageBase64);
      setEditedUserImage(result.result);
      updateUserPoints(result.points_remaining);
    } catch (err: any) {
      setError(err.message || 'Failed to edit image.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePreview = () => {
    if (editedUserImage) {
      window.open(editedUserImage, '_blank', 'noopener,noreferrer');
    }
  };

  const editedImages = template.imgEdited.split(',').filter(url => url);

  return (
    <Card className="mb-6">
      <h3 className="text-xl font-bold text-white mb-4">{template.templateType}</h3>
      <div className="flex items-center gap-4 overflow-x-auto p-2">
        <ImagePreview src={template.imgOriginal} alt={`Original example for ${template.templateType}`} label={t('editor.exampleOriginal')} />
        
        <div className="flex flex-col items-center space-y-2 w-48 flex-shrink-0">
            <h4 className="text-sm font-semibold text-gray-300 h-5">{t('editor.exampleEdited')}</h4>
            <div className="w-full h-48 bg-gray-700 rounded-lg overflow-hidden">
                {editedImages.length === 1 ? (
                    <img src={editedImages[0]} alt="Edited example 1" className="w-full h-full object-cover" />
                ) : (
                    <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-full h-full">
                        {editedImages.slice(0, 4).map((img, index) => (
                            <img key={index} src={img} alt={`Edited example ${index + 1}`} className="w-full h-full object-cover" />
                        ))}
                    </div>
                )}
            </div>
        </div>
        
        <ImagePreview src={userImagePreview} alt={t('editor.uploadYourPhoto')} label={t('editor.yourPhoto')} />

        <div className="flex flex-col items-center justify-center space-y-3 w-48 flex-shrink-0">
            <label htmlFor={`upload-${template.id}`} className="w-36 h-10 cursor-pointer bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold py-2 px-4 rounded-md transition-colors duration-200 text-center flex items-center justify-center">
                {t('editor.chooseFile')}
            </label>
            <input id={`upload-${template.id}`} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

            <Button className="w-36 h-10" onClick={handleSubmit} isLoading={isLoading} disabled={!userImageFile || (isAuthenticated && user?.points === 0)}>
                {t('editor.edit1Point')}
            </Button>
            
            <Button className="w-36 h-10" onClick={handlePreview} disabled={!editedUserImage || isLoading} variant="secondary">
                {t('editor.preview')}
            </Button>

            {error && <p className="text-red-400 text-xs text-center mt-1">{error}</p>}
        </div>

        <ImagePreview src={editedUserImage} alt={t('editor.yourEditedPhoto')} label={t('editor.yourResult')} isLoading={isLoading} />
      </div>
    </Card>
  );
};

export default TemplateRow;