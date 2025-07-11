import React from "react";
import { useApp } from "../../hooks/useApp";
import { useLanguage } from "../../hooks/useLanguage";
import { Invoice } from "../../types";

interface InvoicePreviewProps {
  invoice: Partial<Invoice>;
  onClientClick?: () => void;
  onDetailsClick?: () => void;
  onProductsClick?: () => void;
  onNotesClick?: () => void;
  onTermsClick?: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  onClientClick,
  onDetailsClick,
  onProductsClick,
  onNotesClick,
  onTermsClick,
}) => {
  const { state } = useApp();
  const { t, isRTL } = useLanguage();

  // Updated currency symbol logic
  const currencySymbol = () => {
    switch (state.company.currency) {
      case "CHF":
        return "CHF";
      case "USD":
        return "$";
      case "EGP":
        return isRTL ? "ج.م" : "EGP";
      default:
        return "CHF";
    }
  };

  return (
    <div
      className={`bg-white p-4 sm:p-8 shadow-lg print:shadow-none print:p-0 relative ${
        isRTL ? "rtl" : "ltr"
      }`}
      style={{ minHeight: "11in", maxWidth: "8.5in", margin: "0 auto" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Watermark - visible in both preview and print */}
      {state.company.watermark && (
        <div
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10 print:opacity-20"
          style={{
            transform: "rotate(-45deg)",
            fontSize: "120px",
            fontWeight: "bold",
            textTransform: "uppercase",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            fontFamily: isRTL
              ? "'Noto Sans Arabic', Arial, sans-serif"
              : "Arial, sans-serif",
          }}
        >
          {state.company.watermark}
        </div>
      )}

      {/* Header - NOT CLICKABLE */}
      <div
        className={`flex ${
          isRTL ? "flex-row-reverse" : ""
        } justify-between items-start mb-6 sm:mb-8`}
      >
        {/* Left side - INVOICE title */}
        <div className={`${isRTL ? "text-right" : "text-left"}`}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t("invoice.invoice")}
          </h1>
        </div>

        {/* Right side - Company Logo */}
        <div
          className={`flex ${
            isRTL ? "flex-row-reverse" : ""
          } items-center justify-end`}
        >
          {state.company.logo && (
            <img
              src={state.company.logo}
              alt="Company Logo"
              className="object-contain h-auto w-auto 
                        max-h-[80px] max-w-[160px] 
                        md:max-h-[120px] md:max-w-[240px] 
                        lg:max-h-[150px] lg:max-w-[300px]
                        print:max-h-[150px] print:max-w-[300px]"
            />
          )}
        </div>
      </div>

      {/* Company Info - NOT CLICKABLE */}
      <div className={`mb-6 sm:mb-8 ${isRTL ? "text-right" : "text-left"}`}>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          {state.company.name}
        </h2>
        <p className="text-gray-600 whitespace-pre-line text-sm sm:text-base">
          {state.company.address}
        </p>
        {state.company.email && (
          <p className="text-gray-600 text-sm sm:text-base">
            {state.company.email}
          </p>
        )}
        {state.company.phone && (
          <p className="text-gray-600 text-sm sm:text-base">
            {state.company.phone}
          </p>
        )}
      </div>

      {/* Invoice Details and Bill To */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8 ${
          isRTL ? "text-right" : ""
        }`}
      >
        {/* Bill To Section - CLICKABLE */}
        <div
          className={`${
            isRTL ? "order-2 lg:order-2" : "order-1 lg:order-1"
          } cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors print:hover:bg-transparent print:cursor-default print:p-0`}
          onClick={onClientClick}
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            {t("invoice.billTo")}
          </h3>
          {invoice.client ? (
            <div className="text-gray-700 text-sm sm:text-base">
              <p className="font-medium">{invoice.client.name}</p>
              <p className="whitespace-pre-line break-words">
                {invoice.client.address}
              </p>
              <p>{invoice.client.phone}</p>
            </div>
          ) : (
            <p className="text-gray-400 italic print:hidden text-sm sm:text-base">
              {t("invoice.clickToSelectClient")}
            </p>
          )}
        </div>

        {/* Invoice Details Section - CLICKABLE */}
        <div
          className={`${
            isRTL
              ? "text-left order-1 lg:order-1"
              : "text-right order-2 lg:order-2"
          } cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors print:hover:bg-transparent print:cursor-default print:p-0`}
          onClick={onDetailsClick}
        >
          <div className="mb-4">
            <p className="text-xs sm:text-sm text-gray-600">
              {t("invoice.invoiceNumber")}
            </p>
            <p className="font-medium text-gray-900 text-sm sm:text-base">
              {invoice.number || "INV-0001"}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-xs sm:text-sm text-gray-600">
              {t("invoice.invoiceDate")}
            </p>
            <p className="font-medium text-gray-900 text-sm sm:text-base">
              {invoice.date || t("invoice.selectDate")}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-xs sm:text-sm text-gray-600">
              {t("invoice.dueDate")}
            </p>
            <p className="font-medium text-gray-900 text-sm sm:text-base">
              {invoice.dueDate || t("invoice.selectDate")}
            </p>
          </div>
        </div>
      </div>

      {/* Items Table - CLICKABLE */}
      <div
        className="mb-6 sm:mb-8 cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors print:hover:bg-transparent print:cursor-default print:p-0 overflow-x-auto"
        onClick={onProductsClick}
      >
        <table className="w-full border-collapse border border-gray-300 min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th
                className={`border border-gray-300 px-2 sm:px-4 py-2 ${
                  isRTL ? "text-right" : "text-left"
                } text-xs sm:text-sm`}
              >
                {t("invoice.product")}
              </th>
              <th className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm w-24">
                {t("invoice.price")}
              </th>
              <th className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm w-24 whitespace-nowrap">
                {t("invoice.discount")}
              </th>
              <th className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm w-24">
                {t("invoice.amount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item, index) => (
                <tr key={index}>
                  <td
                    className={`border border-gray-300 px-2 sm:px-4 py-2 ${
                      isRTL ? "text-right" : "text-left"
                    } text-xs sm:text-base max-w-xs`}
                  >
                    <div className="font-medium">
                      {item.name}
                      {item.quantity !== 1 ? ` × ${item.quantity}` : ""}
                    </div>
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-1 whitespace-pre-wrap break-words">
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
                    {currencySymbol()}
                    {(
                      item.amount /
                      item.quantity /
                      (1 - item.discount / 100)
                    ).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
                    {item.discount}%
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
                    {currencySymbol()}
                    {item.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="print:hidden">
                <td
                  colSpan={4}
                  className="border border-gray-300 px-2 sm:px-4 py-6 sm:py-8 text-center text-gray-400 italic text-xs sm:text-sm"
                >
                  {t("invoice.clickToAddProducts")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        className={`flex ${
          isRTL ? "justify-start" : "justify-end"
        } mb-6 sm:mb-8`}
      >
        {/* Totals - NOT CLICKABLE */}
        <div className="w-full sm:w-64">
          <div className="flex justify-between mb-2 text-sm sm:text-base">
            <span className="text-gray-700">{t("invoice.subtotal")}</span>
            <span className="font-medium">
              {currencySymbol()}
              {(invoice.subtotal || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mb-2 text-sm sm:text-base">
            <span className="text-gray-700">
              {t("invoice.totalTax")} ({state.company.taxRate || 0}%)
            </span>
            <span className="font-medium">
              {currencySymbol()}
              {(invoice.tax || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-base sm:text-lg font-semibold border-t pt-2">
            <span>{t("invoice.total")}</span>
            <span>
              {currencySymbol()}
              {(invoice.total || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes - CLICKABLE - Only show if showNotes is true or there are notes */}
      {(state.company.showNotes || invoice.notes) && (
        <div
          className={`mb-4 sm:mb-6 ${
            isRTL ? "text-right" : "text-left"
          } cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors print:hover:bg-transparent print:cursor-default print:p-0`}
          onClick={onNotesClick}
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            {t("invoice.notes")}
          </h3>
          <p className="text-gray-700 whitespace-pre-line text-sm sm:text-base">
            {invoice.notes || (
              <span className="text-gray-400 italic print:hidden">
                {t("invoice.clickToAddNotes")}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Terms - CLICKABLE - Only show if showTerms is true or there are terms */}
      {(state.company.showTerms || invoice.terms) && (
        <div
          className={`${
            isRTL ? "text-right" : "text-left"
          } cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors print:hover:bg-transparent print:cursor-default print:p-0`}
          onClick={onTermsClick}
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            {t("invoice.terms")}
          </h3>
          <p className="text-gray-700 whitespace-pre-line text-sm sm:text-base">
            {invoice.terms || (
              <span className="text-gray-400 italic print:hidden">
                {t("invoice.clickToAddTerms")}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;
