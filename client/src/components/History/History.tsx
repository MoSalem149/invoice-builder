import React, { useState, useEffect } from "react";
import { Download, Search, FileText, Edit } from "lucide-react";
import { useApp } from "../../hooks/useApp";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { useNotificationContext } from "../../hooks/useNotificationContext";
import { downloadInvoicePDF } from "../../utils/invoiceGenerator";
import { Invoice } from "../../types";

const History: React.FC = () => {
  const { state, updateInvoice } = useApp();
  const { state: authState } = useAuth();
  const { t, isRTL } = useLanguage();
  const { showSuccess, showError } = useNotificationContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Load invoices from backend
  useEffect(() => {
    const loadInvoices = async () => {
      if (!authState.isAuthenticated || !authState.token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/invoices`,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setInvoices(data.data.invoices);
        } else {
          showError("Failed to load invoices", "Please try again");
        }
      } catch (error) {
        console.error("Error loading invoices:", error);
        showError("Network error", "Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [authState.isAuthenticated, authState.token, showError]);

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.client.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getCurrencyDisplay = () => {
    switch (state.company.currency) {
      case "USD":
        return t("currencies.usd");
      case "EGP":
        return t("currencies.egp");
      case "CHF":
        return t("currencies.chf");
      default:
        return t("currencies.usd");
    }
  };

  const handleDownload = (invoice: Invoice) => {
    const companyForPDF = {
      ...state.company,
      address: state.company.address || "",
      email: state.company.email || "",
      phone: state.company.phone || "",
    };
    downloadInvoicePDF(invoice, companyForPDF, isRTL);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
  };

  const handleUpdateInvoice = async (updatedInvoice: Invoice) => {
    const success = await updateInvoice(updatedInvoice);
    if (success) {
      setInvoices(
        invoices.map((inv) =>
          inv.id === updatedInvoice.id ? updatedInvoice : inv
        )
      );
      setEditingInvoice(null);
      showSuccess("Invoice updated successfully", "Changes have been saved");
    } else {
      showError("Failed to update invoice", "Please try again");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1
          className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-2 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("history.title")}
        </h1>
        <p className={`text-gray-600 ${isRTL ? "text-right" : "text-left"}`}>
          {t("history.subtitle")}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className={`absolute ${
              isRTL ? "right-3" : "left-3"
            } top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`}
          />
          <input
            type="text"
            placeholder={t("history.searchInvoices")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${
              isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
            } py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2
            className={`text-base sm:text-lg font-semibold text-gray-900 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("history.allInvoices")}
          </h2>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">{t("history.noInvoicesFound")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className={`px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("invoice.invoiceNumber")}
                  </th>
                  <th
                    className={`px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("history.client")}
                  </th>
                  <th
                    className={`px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("invoice.invoiceDate")}
                  </th>
                  <th
                    className={`px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("invoice.dueDate")}
                  </th>
                  <th
                    className={`px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("invoice.total")}
                  </th>
                  <th
                    className={`px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("history.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div
                        className={`flex items-center ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <FileText
                          className={`h-4 w-4 text-gray-400 ${
                            isRTL ? "ml-2" : "mr-2"
                          }`}
                        />
                        <span className="font-medium text-gray-900 text-sm">
                          {invoice.number}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.client.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.client.phone}
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td
                      className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td
                      className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {getCurrencyDisplay().split(" ")[0]}{" "}
                      {invoice.total.toFixed(2)}
                    </td>
                    <td
                      className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`flex space-x-2 ${
                          isRTL ? "space-x-reverse" : ""
                        }`}
                      >
                        <button
                          onClick={() => handleEdit(invoice)}
                          className={`bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-1 ${
                            isRTL ? "space-x-reverse flex-row-reverse" : ""
                          }`}
                        >
                          <Edit className="h-3 w-3" />
                          <span>{t("common.edit")}</span>
                        </button>
                        <button
                          onClick={() => handleDownload(invoice)}
                          className={`bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 ${
                            isRTL ? "space-x-reverse flex-row-reverse" : ""
                          }`}
                        >
                          <Download className="h-3 w-3" />
                          <span>{t("history.download")}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Invoice {editingInvoice.number}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={editingInvoice.number}
                  onChange={(e) =>
                    setEditingInvoice({
                      ...editingInvoice,
                      number: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={editingInvoice.date}
                    onChange={(e) =>
                      setEditingInvoice({
                        ...editingInvoice,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editingInvoice.dueDate}
                    onChange={(e) =>
                      setEditingInvoice({
                        ...editingInvoice,
                        dueDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={editingInvoice.notes || ""}
                  onChange={(e) =>
                    setEditingInvoice({
                      ...editingInvoice,
                      notes: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Terms & Conditions
                </label>
                <textarea
                  value={editingInvoice.terms || ""}
                  onChange={(e) =>
                    setEditingInvoice({
                      ...editingInvoice,
                      terms: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setEditingInvoice(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateInvoice(editingInvoice)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
