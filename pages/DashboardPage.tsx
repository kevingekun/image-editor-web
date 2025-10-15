import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: `useAuth` is imported from `../hooks/useAuth` not `../contexts/AuthContext`.
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import ImageEditor from '../components/ImageEditor';
import OrderHistory from '../components/OrderHistory';
import EditHistory from '../components/EditHistory';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import TemplateEditor from '../components/TemplateEditor';
import ChangePasswordForm from '../components/ChangePasswordForm';

type Tab = 'editor' | 'orders' | 'edits' | 'profile';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('editor');
  
  // Check if promotion is still active (until October 10, 2025)
  const isPromotionActive = () => {
    const endDate = new Date('2025-10-10T23:59:59');
    const now = new Date();
    return now <= endDate;
  };

  useEffect(() => {
    if (!isAuthenticated && (activeTab === 'orders' || activeTab === 'edits' || activeTab === 'profile')) {
        setActiveTab('editor');
    }
  }, [isAuthenticated, activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'editor':
        return (
          <div className="space-y-8">
            <TemplateEditor />
            <div className="border-t border-gray-700 pt-8">
              <h2 className="text-3xl font-bold text-white mb-2">{t('dashboard.customImageEditing')}</h2>
              <p className="text-gray-400 mb-6">{t('dashboard.customPrompt')}</p>
              <ImageEditor />
            </div>
          </div>
        );
      case 'orders':
        return isAuthenticated ? <OrderHistory /> : null;
      case 'edits':
        return isAuthenticated ? <EditHistory /> : null;
      case 'profile':
        return isAuthenticated ? <ChangePasswordForm /> : null;
      default:
        return null;
    }
  };
  
  const getTabClass = (tab: Tab) => {
      return `py-2 px-4 font-medium text-sm rounded-md transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`;
  }

  return (
    <div className="space-y-8">
        {/* Promotion Banner */}
        {isPromotionActive() && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg shadow-lg border-2 border-indigo-400">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
                  <span className="text-2xl">🎉</span>
                  {t('dashboard.promotionTitle')}
                </h2>
                <p className="text-indigo-100 text-sm mt-1">
                  {t('dashboard.promotionSubtitle')}
                </p>
              </div>
              {!isAuthenticated && (
                <Button 
                  onClick={() => navigate('/auth')} 
                  variant="secondary"
                  className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                  {t('dashboard.signUpNow')}
                </Button>
              )}
            </div>
          </div>
        )}
        
        <Card className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                {isAuthenticated && user ? (
                    <>
                        <h1 className="text-3xl font-bold text-white">{t('dashboard.welcome')}, {user.username}!</h1>
                        <p className="text-gray-300 mt-1">{t('dashboard.youHave')} <span className="font-bold text-indigo-400 text-lg">{user.points}</span> {t('dashboard.points')}。</p>
                    </>
                ) : (
                    <>
                         <h1 className="text-3xl font-bold text-white">{t('dashboard.welcomeGuest')}</h1>
                         <p className="text-gray-300 mt-1">{t('dashboard.loginPrompt')}</p>
                    </>
                )}
            </div>
            <Button onClick={() => navigate('/payment')}>
                {t('dashboard.purchasePoints')}
            </Button>
        </Card>

      <div className="flex space-x-2 border-b border-gray-700 mb-6">
          <button className={getTabClass('editor')} onClick={() => setActiveTab('editor')}>{t('dashboard.imageEditor')}</button>
          {isAuthenticated && (
            <>
                <button className={getTabClass('orders')} onClick={() => setActiveTab('orders')}>{t('dashboard.orderHistory')}</button>
                <button className={getTabClass('edits')} onClick={() => setActiveTab('edits')}>{t('dashboard.editHistory')}</button>
                <button className={getTabClass('profile')} onClick={() => setActiveTab('profile')}>{t('dashboard.profile')}</button>
            </>
          )}
      </div>
      
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default DashboardPage;
