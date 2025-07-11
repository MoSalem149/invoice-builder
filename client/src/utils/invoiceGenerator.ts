import { Invoice } from "../types";

// Define the CompanyInfo type
export interface CompanyInfo {
  logo: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  currency: "CHF" | "USD" | "EGP";
  language: "it" | "en" | "ar";
  watermark?: string;
  showNotes?: boolean;
  showTerms?: boolean;
  taxRate?: number;
}

// Translation mappings
const translations = {
  invoice: {
    it: "FATTURA",
    en: "INVOICE",
    ar: "فاتورة",
  },
  billTo: {
    it: "Fattura a:",
    en: "Bill To:",
    ar: "فاتورة إلى:",
  },
  invoiceNumber: {
    it: "Numero fattura",
    en: "Invoice #",
    ar: "رقم الفاتورة",
  },
  invoiceDate: {
    it: "Data fattura",
    en: "Invoice Date",
    ar: "تاريخ الفاتورة",
  },
  dueDate: {
    it: "Scadenza",
    en: "Due Date",
    ar: "تاريخ الاستحقاق",
  },
  product: {
    it: "Prodotto",
    en: "Product",
    ar: "المنتج",
  },
  price: {
    it: "Prezzo",
    en: "Price",
    ar: "السعر",
  },
  discount: {
    it: "Sconto %",
    en: "Discount %",
    ar: "الخصم %",
  },
  amount: {
    it: "Importo",
    en: "Amount",
    ar: "المبلغ",
  },
  subtotal: {
    it: "Subtotale:",
    en: "Subtotal:",
    ar: "المجموع الفرعي:",
  },
  totalTax: {
    it: "Tassa:",
    en: "Tax:",
    ar: "الضريبة:",
  },
  total: {
    it: "Totale:",
    en: "Total:",
    ar: "الإجمالي:",
  },
  notes: {
    it: "Note:",
    en: "Notes:",
    ar: "ملاحظات:",
  },
  terms: {
    it: "Termini e condizioni:",
    en: "Terms & Conditions:",
    ar: "الشروط والأحكام:",
  },
};

export const generateInvoicePDF = (
  invoice: Invoice,
  companyInfo: CompanyInfo,
  isRTL: boolean
): string => {
  // Determine currency symbol based on currency and language
  let currencySymbol = "$";
  switch (companyInfo.currency) {
    case "CHF":
      currencySymbol = "CHF";
      break;
    case "USD":
      currencySymbol = "$";
      break;
    case "EGP":
      currencySymbol = isRTL ? "ج.م" : "EGP";
      break;
  }

  // Get language from company info
  const lang = companyInfo.language || "it";
  const dir = isRTL ? "rtl" : "ltr";

  // Get appropriate translations
  const t = (key: keyof typeof translations) => translations[key][lang];

  return `
    <!DOCTYPE html>
    <html dir="${dir}" lang="${lang}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t("invoice")} ${invoice.number}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: ${
              isRTL
                ? "'Noto Sans Arabic', Arial, sans-serif"
                : lang === "it"
                ? "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                : "Arial, sans-serif"
            };
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 20px;
            direction: ${dir};
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border: 1px solid #ddd;
            position: relative;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            flex-direction: ${isRTL ? "row-reverse" : "row"};
          }
          
          .invoice-title {
            font-size: 36px;
            font-weight: bold;
            color: #333;
          }
          
          .company-logo {
            max-height: 150px;
            max-width: 300px;
          }
          
          .company-info {
            margin-bottom: 40px;
            text-align: ${isRTL ? "right" : "left"};
          }
          
          .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          
          .company-address {
            color: #666;
            white-space: pre-line;
          }
          
          .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
          }

          .company-contact {
            color: #666;
            margin-top: 5px;
            text-align: ${isRTL ? "right" : "left"};
          }
          
          .bill-to, .invoice-info {
            text-align: ${isRTL ? "right" : "left"};
          }
          
          .invoice-info {
            text-align: ${isRTL ? "left" : "right"};
          }
          
          .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
          }
          
          .client-name {
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .client-details {
            color: #666;
            white-space: pre-line;
            word-wrap: break-word;
            max-width: 250px;
          }
          
          .invoice-meta {
            margin-bottom: 10px;
          }
          
          .meta-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 2px;
          }
          
          .meta-value {
            font-weight: bold;
            color: #333;
          }
          
          /* Updated Items Table Styles */
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            min-width: 100%;
            border: 1px solid #ddd;
          }
          
          .items-table th {
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            padding: 8px 16px;
            text-align: ${isRTL ? "right" : "left"};
            font-size: 12px;
            font-weight: normal;
          }
          
          .items-table td {
            border: 1px solid #ddd;
            padding: 8px 16px;
            text-align: ${isRTL ? "right" : "left"};
            font-size: 14px;
          }
          
          /* Fixed width for price, discount, amount columns */
          .items-table th:nth-child(2),
          .items-table td:nth-child(2),
          .items-table th:nth-child(3),
          .items-table td:nth-child(3),
          .items-table th:nth-child(4),
          .items-table td:nth-child(4) {
            width: 100px;
            text-align: center;
          }
          
          /* Amount column specific alignment */
          .items-table th:nth-child(4),
          .items-table td:nth-child(4) {
            text-align: ${isRTL ? "left" : "right"};
          }
          
          /* Discount column specific alignment */
          .items-table th:nth-child(3),
          .items-table td:nth-child(3) {
            text-align: center;
          }
          
          /* Product cell styling */
          .product-name {
            font-weight: bold;
            margin-bottom: 4px;
            font-size: 14px;
          }
          
          .product-description {
            font-size: 12px;
            color: #666;
            white-space: pre-wrap;
            word-wrap: break-word;
            margin-top: 4px;
          }
          
          .totals {
            display: flex;
            justify-content: ${isRTL ? "flex-start" : "flex-end"};
            margin-bottom: 40px;
          }
          
          .totals-table {
            width: 300px;
          }
          
          .totals-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
          }
          
          .totals-row.total {
            border-top: 2px solid #333;
            padding-top: 10px;
            font-weight: bold;
            font-size: 18px;
          }
          
          .notes-section,
          .terms-section {
            margin-bottom: 30px;
            text-align: ${isRTL ? "right" : "left"};
          }
          
          .section-content {
            color: #666;
            white-space: pre-line;
            margin-top: 10px;
            word-wrap: break-word;
          }
          
          .watermark {
            position: fixed; 
            opacity: 0.1;
            font-size: 120px;
            color: #000;
            z-index: 9999;
            width: 100%;
            text-align: center;
            top: 50%;
            left: 0;
            transform: translateY(-50%) rotate(-45deg);
            font-weight: bold;
            text-transform: uppercase;
            pointer-events: none;
            user-select: none;
            background: none !important;
            white-space: nowrap;
            font-family: ${
              isRTL
                ? "'Noto Sans Arabic', Arial, sans-serif"
                : "Arial, sans-serif"
            };
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
          }
          
          @media print {
            body {
              padding: 0;
            }
            .invoice-container {
              border: none;
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Watermark -->
          ${
            companyInfo.watermark
              ? `<div class="watermark">${companyInfo.watermark}</div>`
              : ""
          }
          
          <!-- Header -->
          <div class="header">
            <div class="invoice-title">${t("invoice")}</div>
            ${
              companyInfo.logo
                ? `<img src="${companyInfo.logo}" alt="Company Logo" class="company-logo">`
                : ""
            }
          </div>
          
          <!-- Company Info -->
          <div class="company-info">
            <div class="company-name">${companyInfo.name}</div>
            ${
              companyInfo.address
                ? `<div class="company-address">${companyInfo.address}</div>`
                : ""
            }
            ${
              companyInfo.email
                ? `<div class="company-contact">${companyInfo.email}</div>`
                : ""
            }
            ${
              companyInfo.phone
                ? `<div class="company-contact">${companyInfo.phone}</div>`
                : ""
            }
          </div>
          
          <!-- Invoice Details -->
          <div class="invoice-details">
            <div class="bill-to">
              <div class="section-title">${t("billTo")}</div>
              <div class="client-name">${invoice.client.name}</div>
              ${
                invoice.client.address
                  ? `<div class="client-details">${invoice.client.address}</div>`
                  : ""
              }
              ${
                invoice.client.phone
                  ? `<div class="client-details">${invoice.client.phone}</div>`
                  : ""
              }
            </div>
            
            <div class="invoice-info">
              <div class="invoice-meta">
                <div class="meta-label">${t("invoiceNumber")}</div>
                <div class="meta-value">${invoice.number}</div>
              </div>
              <div class="invoice-meta">
                <div class="meta-label">${t("invoiceDate")}</div>
                <div class="meta-value">${invoice.date}</div>
              </div>
              <div class="invoice-meta">
                <div class="meta-label">${t("dueDate")}</div>
                <div class="meta-value">${invoice.dueDate}</div>
              </div>
            </div>
          </div>
          
          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th>${t("product")}</th>
                <th>${t("price")}</th>
                <th>${t("discount")}</th>
                <th>${t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items
                .map(
                  (item) => `
                <tr>
                  <td>
                    <div class="product-name">${item.name}${
                    item.quantity !== 1 ? ` × ${item.quantity}` : ""
                  }</div>
                    ${
                      item.description
                        ? `<div class="product-description">${item.description}</div>`
                        : ""
                    }
                  </td>
                  <td>${currencySymbol}${(
                    item.amount /
                    item.quantity /
                    (1 - item.discount / 100)
                  ).toFixed(2)}</td>
                  <td>${item.discount}%</td>
                  <td>${currencySymbol}${item.amount.toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <!-- Totals -->
          <div class="totals">
            <div class="totals-table">
              <div class="totals-row">
                <span>${t("subtotal")}</span>
                <span>${currencySymbol}${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div class="totals-row">
                <span>${t("totalTax")} (${companyInfo.taxRate || 0}%)</span>
                <span>${currencySymbol}${invoice.tax.toFixed(2)}</span>
              </div>
              <div class="totals-row total">
                <span>${t("total")}</span>
                <span>${currencySymbol}${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <!-- Notes -->
          ${
            invoice.notes && companyInfo.showNotes !== false
              ? `
            <div class="notes-section">
              <div class="section-title">${t("notes")}</div>
              <div class="section-content">${invoice.notes}</div>
            </div>
          `
              : ""
          }
          
          <!-- Terms -->
          ${
            invoice.terms && companyInfo.showTerms !== false
              ? `
            <div class="terms-section">
              <div class="section-title">${t("terms")}</div>
              <div class="section-content">${invoice.terms}</div>
            </div>
          `
              : ""
          }
        </div>
      </body>
    </html>
  `;
};

export const downloadInvoicePDF = (
  invoice: Invoice,
  companyInfo: CompanyInfo,
  isRTL: boolean
) => {
  const htmlContent = generateInvoicePDF(invoice, companyInfo, isRTL);

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Ensure fonts are loaded before printing
    const style = printWindow.document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap');
    `;
    printWindow.document.head.appendChild(style);

    // Use setTimeout to ensure everything is loaded
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      // Don't close immediately - let user see print dialog
    }, 500);
  } else {
    console.error("Failed to open print window");
  }
};
