import React, { useState } from 'react';
import { X, Calendar, Hash } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';
import { Invoice } from '../../../types';

interface InvoiceDetailsPanelProps {
  invoice: Partial<Invoice>;
  onUpdate: (updates: Partial<Invoice>) => void;
  onClose: () => void;
}

const InvoiceDetailsPanel: React.FC<InvoiceDetailsPanelProps> = ({ invoice, onUpdate, onClose }) => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    number: invoice.number || '',
    date: invoice.date || '',
    dueDate: invoice.dueDate || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">{t('details.invoiceDetails')}</h2>
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Number */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Hash className={`h-4 w-4 inline ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {t('invoice.invoiceNumber')}
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
              placeholder="INV-0001"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Invoice Date */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Calendar className={`h-4 w-4 inline ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {t('invoice.invoiceDate')}
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>

          {/* Due Date */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Calendar className={`h-4 w-4 inline ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {t('invoice.dueDate')}
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('details.updateDetails')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvoiceDetailsPanel;