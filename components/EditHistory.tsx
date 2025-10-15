
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getImageEditHistory } from '../services/api';
import type { ImageEdit } from '../types';
import Card from './ui/Card';
import Spinner from './ui/Spinner';

const EditHistory: React.FC = () => {
  const [edits, setEdits] = useState<ImageEdit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getImageEditHistory();
        setEdits(data.edits);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch edit history.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-4">{t('common.imageEditHistory')}</h2>
       {isLoading && <div className="flex justify-center p-8"><Spinner /></div>}
      {error && <p className="text-red-400">{error}</p>}
      {!isLoading && !error && edits.length === 0 && <p className="text-gray-400">{t('common.noEditsYet')}</p>}
      {!isLoading && !error && edits.length > 0 && (
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('common.date')}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('common.pointsDeducted')}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('common.result')}</th>
                </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
                {edits.map(edit => (
                    <tr key={edit.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(edit.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">-{edit.pointsDeducted}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {edit.modelResult ? (
                            <a href={edit.modelResult} target="_blank" rel="noopener noreferrer">
                                <img 
                                    src={edit.modelResult} 
                                    alt="Edited result" 
                                    className="h-16 w-16 object-cover rounded-md hover:opacity-80 transition-opacity" 
                                />
                            </a>
                        ) : (
                            'N/A'
                        )}
                    </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
      )}
    </Card>
  );
};

export default EditHistory;
