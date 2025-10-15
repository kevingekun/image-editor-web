import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/ui/Card';

const AboutUsPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="prose prose-invert max-w-none text-gray-300">
          <h1 className="text-3xl font-bold text-white mb-4">{t('about.title')}</h1>
          
          <p>
            {t('about.welcome')}
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-6 mb-3">{t('about.technologyTitle')}</h2>
          <p>
            {t('about.technologyDesc')}
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-6 mb-3">{t('about.howItWorksTitle')}</h2>
          <p>
            {t('about.howItWorksDesc')}
          </p>
          <ul>
            <li><strong>{t('about.signUp')}</strong></li>
            <li><strong>{t('about.purchasePoints')}</strong></li>
            <li><strong>{t('about.startEditing')}</strong></li>
            <li><strong>{t('about.trackHistory')}</strong></li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-6 mb-3">{t('about.commitmentTitle')}</h2>
          <p>
            {t('about.commitmentDesc')}
          </p>
          
          <p>
            {t('about.thanks')}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AboutUsPage;
