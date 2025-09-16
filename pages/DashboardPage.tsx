import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: `useAuth` is imported from `../hooks/useAuth` not `../contexts/AuthContext`.
import { useAuth } from '../hooks/useAuth';
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('editor');

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
              <h2 className="text-3xl font-bold text-white mb-2">Custom Image Editing</h2>
              <p className="text-gray-400 mb-6">Or, use your own prompt for more creative control.</p>
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
        <Card className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                {isAuthenticated && user ? (
                    <>
                        <h1 className="text-3xl font-bold text-white">Welcome, {user.username}!</h1>
                        <p className="text-gray-300 mt-1">You have <span className="font-bold text-indigo-400 text-lg">{user.points}</span> points.</p>
                    </>
                ) : (
                    <>
                         <h1 className="text-3xl font-bold text-white">Welcome to the AI Image Editor</h1>
                         <p className="text-gray-300 mt-1">Log in or sign up to get started.</p>
                    </>
                )}
            </div>
            <Button onClick={() => navigate('/payment')}>
                Purchase Points
            </Button>
        </Card>

      <div className="flex space-x-2 border-b border-gray-700 mb-6">
          <button className={getTabClass('editor')} onClick={() => setActiveTab('editor')}>Image Editor</button>
          {isAuthenticated && (
            <>
                <button className={getTabClass('orders')} onClick={() => setActiveTab('orders')}>Order History</button>
                <button className={getTabClass('edits')} onClick={() => setActiveTab('edits')}>Edit History</button>
                <button className={getTabClass('profile')} onClick={() => setActiveTab('profile')}>Profile</button>
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
