import React, { useState, useEffect } from "react";
import { Save, Upload, Building, Edit } from "lucide-react";
import { useApp } from "../../hooks/useApp";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { useNotificationContext } from "../../hooks/useNotificationContext";
import {
  validateCompanyName,
  validateEmail,
  validatePhoneNumber,
  validateCompanyAddress,
  validateWatermark,
  validateTaxRate,
} from "../../utils/validation";
// const DEFAULT_LOGO = "/images/default-logo.png";

const Settings: React.FC = () => {
  const { state, dispatch } = useApp();
  const { state: authState } = useAuth();
  const { t, isRTL, language, setLanguage } = useLanguage();
  const { showSuccess, showError } = useNotificationContext();
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    ...state.company,
    language: state.company.language || "it",
    currency: state.company.currency || "CHF",
    logo: state.company.logo || "",
    email: state.company.email || "",
    phone: state.company.phone || "",
    address: state.company.address || "",
    watermark: state.company.watermark || "",
    showNotes: state.company.showNotes || false,
    showTerms: state.company.showTerms || false,
    taxRate: state.company.taxRate || 0,
  });

  const [pendingNotification, setPendingNotification] = useState<{
    type: "success" | "error";
    titleKey: string;
    messageKey: string;
    duration?: number;
  } | null>(null);

  useEffect(() => {
    if (pendingNotification) {
      const { type, titleKey, messageKey, duration } = pendingNotification;
      const showFunc = type === "success" ? showSuccess : showError;
      showFunc(t(titleKey), t(messageKey), duration);
      setPendingNotification(null);
    }
  }, [pendingNotification, t]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as "en" | "ar" | "it";
    setFormData((prev) => ({ ...prev, language: newLanguage }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, logo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation (only required field)
    const nameError = validateCompanyName(formData.name, t);
    if (nameError) newErrors.name = nameError;

    // Optional field validations (only validate if there's content)
    if (formData.email) {
      const emailError = validateEmail(formData.email, t);
      if (emailError) newErrors.email = emailError;
    }

    if (formData.phone) {
      const phoneError = validatePhoneNumber(formData.phone, t);
      if (phoneError) newErrors.phone = phoneError;
    }

    if (formData.address) {
      const addressError = validateCompanyAddress(formData.address, t);
      if (addressError) newErrors.address = addressError;
    }

    if (formData.watermark) {
      const watermarkError = validateWatermark(formData.watermark, t);
      if (watermarkError) newErrors.watermark = watermarkError;
    }

    // Tax Rate validation (always validate if it exists)
    const taxRateError = validateTaxRate(formData.taxRate || 0, t);
    if (taxRateError) newErrors.taxRate = taxRateError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setPendingNotification({
        type: "error",
        titleKey: "validation.validationError",
        messageKey: "validation.fixErrorsBelow",
      });
      return;
    }

    if (!authState.isAuthenticated || !authState.token) {
      setPendingNotification({
        type: "error",
        titleKey: "settings.authRequired",
        messageKey: "settings.loginToSave",
      });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/company`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            logo: formData.logo,
            name: formData.name,
            address: formData.address,
            email: formData.email,
            phone: formData.phone,
            currency: formData.currency,
            language: formData.language,
            watermark: formData.watermark,
            showNotes: formData.showNotes,
            showTerms: formData.showTerms,
            taxRate: formData.taxRate,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "UPDATE_COMPANY", payload: data.data });
        setIsEditing(false);

        // Update the language context first
        setLanguage(formData.language);

        // Queue the success notification
        setPendingNotification({
          type: "success",
          titleKey: "settings.settingsSavedSuccess",
          messageKey: "settings.settingsSavedMessage",
          duration: 4000,
        });
      } else {
        const errorData = await response.json();
        setPendingNotification({
          type: "error",
          titleKey: "settings.saveFailed",
          messageKey: errorData.message || "settings.tryAgain",
        });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setPendingNotification({
        type: "error",
        titleKey: "settings.networkError",
        messageKey: "settings.connectionFailed",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      ...state.company,
      language: language,
      logo: state.company.logo || "",
      email: state.company.email || "",
      phone: state.company.phone || "",
      address: state.company.address || "",
      watermark: state.company.watermark || "",
      showNotes: state.company.showNotes || false,
      showTerms: state.company.showTerms || false,
      taxRate: state.company.taxRate || 0,
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1
          className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-2 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("settings.title")}
        </h1>
        <p className={`text-gray-600 ${isRTL ? "text-right" : "text-left"}`}>
          {t("settings.subtitle")}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div
            className={`flex items-center justify-between ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <h2
              className={`text-base sm:text-lg font-semibold text-gray-900 flex items-center ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Building className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
              {t("settings.companyInformation")}
            </h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className={`flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors ${
                  isRTL ? "space-x-reverse flex-row-reverse" : ""
                }`}
              >
                <Edit className="h-4 w-4" />
                <span>{t("settings.editSettings")}</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Company Logo */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("settings.companyLogo")}
            </label>
            <div
              className={`flex items-center space-x-4 ${
                isRTL ? "space-x-reverse flex-row-reverse" : ""
              }`}
            >
              {formData.logo ? (
                <img
                  src={formData.logo}
                  alt="Company Logo"
                  className="h-16 w-16 object-contain border border-gray-300 rounded-lg"
                />
              ) : (
                <div className="h-16 w-16 flex items-center justify-center border border-gray-300 rounded-lg bg-gray-100">
                  <span className="text-xs text-gray-500">
                    {t("settings.noLogo")}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <label
                  className={`inline-block bg-white border ${
                    errors.logo ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-4 py-2 ${
                    isEditing
                      ? "cursor-pointer hover:bg-gray-50"
                      : "bg-gray-50 cursor-not-allowed opacity-75"
                  } flex items-center space-x-2 ${
                    isRTL ? "space-x-reverse flex-row-reverse" : ""
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium text-gray-700">
                    {formData.logo
                      ? t("settings.changeLogo")
                      : t("settings.uploadLogo")}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={!isEditing}
                  />
                </label>
                {errors.logo && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.logo}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("settings.companyName")}{" "}
              {isEditing && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isRTL ? "text-right" : "text-left"
              } ${!isEditing ? "bg-gray-50 cursor-not-allowed" : ""} ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("settings.enterCompanyName")}
              dir={isRTL ? "rtl" : "ltr"}
            />
            {errors.name && (
              <p
                className={`text-red-500 text-sm mt-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Company Email */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("settings.companyEmail")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isRTL ? "text-right" : "text-left"
              } ${!isEditing ? "bg-gray-50 cursor-not-allowed" : ""} ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("settings.enterCompanyEmail")}
              dir={isRTL ? "rtl" : "ltr"}
            />
            {errors.email && (
              <p
                className={`text-red-500 text-sm mt-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Company Phone */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("settings.companyPhone")}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isRTL ? "text-right" : "text-left"
              } ${!isEditing ? "bg-gray-50 cursor-not-allowed" : ""} ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("settings.enterCompanyPhone")}
              dir={isRTL ? "rtl" : "ltr"}
            />
            {errors.phone && (
              <p
                className={`text-red-500 text-sm mt-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {errors.phone}
              </p>
            )}
          </div>

          {/* Company Address */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("settings.companyAddress")}{" "}
            </label>
            <textarea
              name="address"
              value={formData.address.replace(/\\n/g, "\n")}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isRTL ? "text-right" : "text-left"
              } ${!isEditing ? "bg-gray-50 cursor-not-allowed" : ""} ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("settings.enterCompanyAddress")}
              dir={isRTL ? "rtl" : "ltr"}
            />
            {errors.address && (
              <p
                className={`text-red-500 text-sm mt-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {errors.address}
              </p>
            )}
          </div>

          {/* Language */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("settings.language")}
            </label>
            <select
              name="language"
              value={formData.language || "it"}
              onChange={handleLanguageChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isRTL ? "text-right" : "text-left"
              } ${!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}`}
            >
              <option value="it">{t("languages.italian")}</option>
              <option value="en">{t("languages.english")}</option>
              {/* <option value="ar">{t("languages.arabic")}</option> */}
            </select>
          </div>

          {/* Currency */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("settings.currency")}
            </label>
            <select
              name="currency"
              value={formData.currency || "CHF"}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isRTL ? "text-right" : "text-left"
              } ${!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}`}
            >
              <option value="CHF">{t("currencies.chf")}</option>
              <option value="USD">{t("currencies.usd")}</option>
              {/* <option value="EGP">{t("currencies.egp")}</option> */}
            </select>
          </div>

          {/* Watermark */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("settings.watermark")}
            </label>
            <input
              type="text"
              name="watermark"
              value={formData.watermark}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isRTL ? "text-right" : "text-left"
              } ${!isEditing ? "bg-gray-50 cursor-not-allowed" : ""} ${
                errors.watermark ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("settings.watermarkPlaceholder")}
              dir={isRTL ? "rtl" : "ltr"}
            />
            {errors.watermark && (
              <p
                className={`text-red-500 text-sm mt-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {errors.watermark}
              </p>
            )}
            <p
              className={`text-gray-500 text-xs mt-1 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("settings.watermarkHint")}
            </p>
          </div>

          {/* Tax Rate */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("settings.taxRate")} (%)
            </label>
            <input
              type="number"
              name="taxRate"
              value={formData.taxRate || 0}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="0"
              max="100"
              step="0.1"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isRTL ? "text-right" : "text-left"
              } ${!isEditing ? "bg-gray-50 cursor-not-allowed" : ""} ${
                errors.taxRate ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0"
              dir={isRTL ? "rtl" : "ltr"}
            />
            {errors.taxRate && (
              <p
                className={`text-red-500 text-sm mt-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {errors.taxRate}
              </p>
            )}
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showNotes"
                name="showNotes"
                checked={formData.showNotes}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="showNotes"
                className={`ml-2 block text-sm text-gray-700 ${
                  isRTL ? "mr-2" : "ml-2"
                }`}
              >
                {t("settings.showNotes")}
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showTerms"
                name="showTerms"
                checked={formData.showTerms}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="showTerms"
                className={`ml-2 block text-sm text-gray-700 ${
                  isRTL ? "mr-2" : "ml-2"
                }`}
              >
                {t("settings.showTerms")}
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div
              className={`flex items-center space-x-4 ${
                isRTL ? "space-x-reverse flex-row-reverse" : ""
              }`}
            >
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleSave}
                className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 ${
                  isRTL ? "space-x-reverse flex-row-reverse" : ""
                }`}
              >
                <Save className="h-4 w-4" />
                <span>{t("settings.saveSettings")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
