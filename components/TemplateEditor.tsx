
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getPromptTemplates } from '../services/api';
import type { PromptTemplate } from '../types';
import Spinner from './ui/Spinner';
import TemplateRow from './TemplateRow';

const TemplateEditor: React.FC = () => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getPromptTemplates();
        
        // Display templates in reverse order of how they are received from the API.
        // This typically shows the newest templates first, which is a common and useful default.
        setTemplates(data.templates.reverse());
      } catch (err: any) {
        setError(err.message || 'Failed to fetch editing templates.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center p-8"><Spinner /></div>;
  }

  if (error) {
    return <p className="text-red-400 text-center">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">{t('editor.templateTitle')}</h2>
      <p className="text-gray-400 mb-6">{t('editor.templateSubtitle')}</p>
      {templates.length > 0 ? (
        templates.map(template => <TemplateRow key={template.id} template={template} />)
      ) : (
        <p className="text-gray-400">{t('editor.noTemplates')}</p>
      )}
    </div>
  );
};

export default TemplateEditor;
