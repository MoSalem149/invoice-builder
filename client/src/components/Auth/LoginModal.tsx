import React, { useState } from "react";
import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { useNotificationContext } from "../../hooks/useNotificationContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onShowForgotPassword: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onShowForgotPassword,
  onLoginSuccess,
}) => {
  const { login } = useAuth();
  const { t, isRTL } = useLanguage();
  const { showSuccess, showError } = useNotificationContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = t("auth.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("auth.validEmail");
    }

    if (!formData.password) {
      newErrors.password = t("auth.passwordRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    const success = await login(formData.email, formData.password);
    setIsLoading(false);

    if (success) {
      showSuccess(t("auth.loginSuccessful"), t("auth.welcomeBack"));
      onClose();
      setFormData({ email: "", password: "" });
      setErrors({});
      onLoginSuccess(); // Call this after successful login
    } else {
      showError(t("auth.loginFailed"), t("auth.invalidCredentials"));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div
          className={`flex items-center justify-between mb-6 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-900">
            {t("auth.login")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-1 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("auth.email")}
            </label>
            <div className="relative">
              <Mail
                className={`absolute ${
                  isRTL ? "right-3" : "left-3"
                } top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full ${
                  isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                } py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder={t("auth.email")}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
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

          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-1 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("auth.password")}
            </label>
            <div className="relative">
              <Lock
                className={`absolute ${
                  isRTL ? "right-3" : "left-3"
                } top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full ${
                  isRTL ? "pr-10 pl-10 text-right" : "pl-10 pr-10 text-left"
                } py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder={t("auth.password")}
                dir={isRTL ? "rtl" : "ltr"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute ${
                  isRTL ? "left-3" : "right-3"
                } top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p
                className={`text-red-500 text-sm mt-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {errors.password}
              </p>
            )}
          </div>

          <div className={`text-right mt-2 ${isRTL ? "text-left" : ""}`}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onShowForgotPassword();
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {t("auth.forgotPassword")}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? `${t("auth.login")}...` : t("auth.login")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t("auth.noAccount")}{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t("auth.signUp")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
