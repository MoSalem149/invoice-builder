import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

interface TermsPanelProps {
  terms: string;
  onUpdate: (terms: string) => void;
  onClose: () => void;
}

const TermsPanel: React.FC<TermsPanelProps> = ({ terms, onUpdate, onClose }) => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState(terms);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className={`h-full bg-white border-r border-gray-200 flex flex-col ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className={`text-base sm:text-lg font-semibold text-gray-900 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <FileText className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('terms.termsConditions')}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="flex-1 mb-6">
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('terms.termsConditions')}
            </label>
            <textarea
              value={formData}
              onChange={(e) => setFormData(e.target.value)}
              rows={8}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
              placeholder={t('terms.addTermsPlaceholder')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('terms.updateTerms')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TermsPanel;