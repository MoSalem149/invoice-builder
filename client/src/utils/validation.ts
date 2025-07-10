export const validateClientName = (
  name: string,
  t: (key: string) => string
): string | null => {
  if (!name.trim()) {
    return t("validation.clientNameRequired");
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return t("validation.clientNameInvalid");
  }
  return null;
};

export const validateAddress = (
  address: string,
  t: (key: string) => string
): string | null => {
  if (!address.trim()) {
    return null;
  }
  if (address.length > 200) {
    return t("validation.addressTooLong");
  }
  return null;
};

export const validateWatermark = (
  watermark: string,
  t: (key: string) => string
): string | null => {
  if (watermark && watermark.length > 10) {
    return t("validation.watermarkTooLong");
  }
  return null;
};

export const validateTaxRate = (
  taxRate: number | string,
  t: (key: string) => string
): string | null => {
  const numTaxRate =
    typeof taxRate === "string" ? parseFloat(taxRate) : taxRate;
  if (isNaN(numTaxRate)) {
    return t("validation.taxRateInvalid");
  }
  if (numTaxRate < 0 || numTaxRate > 100) {
    return t("validation.taxRateInvalid");
  }
  return null;
};

export const validateProductName = (
  name: string,
  t: (key: string) => string
): string | null => {
  if (!name.trim()) {
    return t("validation.productNameRequired");
  }
  if (!/^[a-zA-Z0-9\s\-.,()]+$/.test(name)) {
    return t("validation.productNameInvalidChars");
  }
  if (name.length > 50) {
    return t("validation.productNameTooLong");
  }
  return null;
};

export const validateProductDescription = (
  description: string,
  t: (key: string) => string
): string | null => {
  if (!description.trim()) {
    return null;
  }
  if (!/^[a-zA-Z0-9\s\-.,()]+$/.test(description)) {
    return t("validation.productDescInvalidChars");
  }
  if (description.length > 200) {
    return t("validation.productDescTooLong");
  }
  return null;
};

export const validatePrice = (
  price: number | string,
  t: (key: string) => string
): string | null => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(numPrice) || numPrice < 0) {
    return t("validation.priceInvalid");
  }
  if (numPrice > 1000000) {
    return t("validation.priceTooHigh");
  }
  return null;
};

export const validateDiscountRate = (
  discount: number | string,
  t: (key: string) => string
): string | null => {
  const numDiscount =
    typeof discount === "string" ? parseFloat(discount) : discount;
  if (isNaN(numDiscount) || numDiscount < 0 || numDiscount > 100) {
    return t("validation.taxRateInvalid"); // Using same message as tax for now
  }
  return null;
};

export const validateEmail = (
  email: string,
  t: (key: string) => string
): string | null => {
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return t("validation.emailInvalid");
  }
  return null;
};

export const validatePhoneNumber = (
  phone: string,
  t: (key: string) => string,
  isEgyptianOnly: boolean = false
): string | null => {
  if (!phone.trim()) {
    return null; // Phone is optional
  }

  const cleanedPhone = phone.replace(/\s/g, "");

  if (isEgyptianOnly) {
    // Egyptian phone validation
    const egyptianRegex = /^(\+20|0)[1-9][0-9]{8,9}$/;
    if (!egyptianRegex.test(cleanedPhone)) {
      return t("validation.phoneNumberInvalidEgyptian");
    }
  } else {
    // International phone validation
    const internationalRegex = /^\+?[0-9\s\-()]{6,20}$/;
    if (!internationalRegex.test(phone)) {
      return t("validation.phoneNumberInvalidInternational");
    }
  }

  return null;
};

export const validateCompanyName = (
  name: string,
  t: (key: string) => string
): string | null => {
  if (!name.trim()) {
    return t("validation.companyNameRequired");
  }
  if (!/^[a-zA-Z0-9\s\-&.,'()]+$/.test(name)) {
    return t("validation.companyNameInvalidChars");
  }
  if (name.length > 100) {
    return t("validation.companyNameTooLong");
  }
  return null;
};

export const validateCompanyAddress = (
  address: string,
  t: (key: string) => string
): string | null => {
  if (address) {
    if (!/^[a-zA-Z0-9\s\-.,'()/#&]+$/.test(address)) {
      return t("validation.addressInvalidChars");
    }
    if (address.length > 200) {
      return t("validation.companyAddressTooLong");
    }
  }
  return null;
};

export const validateInvoiceNumber = (
  number: string,
  t: (key: string) => string
): string | null => {
  if (!number.trim()) {
    return t("validation.invoiceNumberRequired");
  }
  if (!/^[A-Z0-9-]+$/.test(number)) {
    return t("validation.invoiceNumberInvalid");
  }
  return null;
};

export const validateDate = (
  date: string,
  t: (key: string) => string
): string | null => {
  if (!date.trim()) {
    return t("validation.dateRequired");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return t("validation.dateInvalid");
  }
  return null;
};
