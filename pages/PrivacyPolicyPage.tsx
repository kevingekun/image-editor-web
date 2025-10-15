import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/ui/Card';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="prose prose-invert max-w-none text-gray-300">
          <h1 className="text-3xl font-bold text-white mb-4">{t('privacy.title')}</h1>
          <p>{t('privacy.lastUpdated')}</p>

          <p>
            {t('privacy.intro')}
          </p>

          <h2 className="text-2xl font-bold text-white mt-6 mb-3">{t('privacy.infoCollectTitle')}</h2>
          <p>{t('privacy.infoCollectDesc')}</p>
          <ul>
            <li><strong>{t('privacy.personalData')}</strong></li>
            <li><strong>{t('privacy.imageData')}</strong></li>
            <li><strong>{t('privacy.paymentData')}</strong></li>
            <li><strong>{t('privacy.usageData')}</strong></li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-6 mb-3">{t('privacy.howWeUseTitle')}</h2>
          <p>{t('privacy.howWeUseDesc')}</p>
          <ul>
            <li>{t('privacy.createAccount')}</li>
            <li>{t('privacy.provideService')}</li>
            <li>{t('privacy.processTransactions')}</li>
            <li>{t('privacy.communicate')}</li>
            <li>{t('privacy.improveServices')}</li>
            <li>{t('privacy.monitorUsage')}</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-6 mb-3">{t('privacy.securityTitle')}</h2>
          <p>
            {t('privacy.securityDesc')}
          </p>

          <h2 className="text-2xl font-bold text-white mt-6 mb-3">{t('privacy.thirdPartyTitle')}</h2>
          <p>
            {t('privacy.thirdPartyDesc')}
          </p>
          <ul>
            <li><strong>{t('privacy.geminiApi')}</strong></li>
            <li><strong>{t('privacy.stripe')}</strong></li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-6 mb-3">{t('privacy.changesTitle')}</h2>
          <p>
            {t('privacy.changesDesc')}
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-6 mb-3">{t('privacy.contactTitle')}</h2>
          <p>
            {t('privacy.contactDesc')}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;
