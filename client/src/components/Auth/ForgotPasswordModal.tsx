// src/components/Auth/ForgotPasswordModal.tsx
import React, { useState } from "react";
import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { useNotificationContext } from "../../hooks/useNotificationContext";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const { t, isRTL } = useLanguage();
  const { showSuccess, showError } = useNotificationContext();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<"request" | "reset">("request");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateRequestForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = t("auth.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("auth.validEmail");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newPassword) {
      newErrors.newPassword = t("auth.passwordRequired");
    } else if (newPassword.length < 8) {
      newErrors.newPassword = t("auth.passwordLength");
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t("auth.confirmPasswordRequired");
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t("auth.passwordsMatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRequestForm()) return;

    setIsLoading(true);
    try {
      // Normalize the email before sending
      let normalizedEmail = email.toLowerCase();
      if (email.includes("@gmail.com")) {
        const [local, domain] = email.split("@");
        normalizedEmail = `${local.replace(/\./g, "").split("+")[0]}@${domain}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: normalizedEmail }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess(t("auth.emailVerified"), t("auth.canResetPassword"));
        setStep("reset");
        // Store the normalized email for the reset step
        setEmail(normalizedEmail);
      } else {
        showError(t("auth.resetFailed"), data.message || t("auth.tryAgain"));
      }
    } catch (error) {
      console.error("Email verification error:", error);
      showError(t("auth.resetFailed"), t("auth.tryAgain"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateResetForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess(t("auth.passwordReset"), t("auth.canNowLogin"));
        onClose();
        onSwitchToLogin();
      } else {
        showError(t("auth.resetFailed"), data.message || t("auth.tryAgain"));
      }
    } catch (error) {
      console.error("Password reset error:", error);
      showError(t("auth.resetFailed"), t("auth.tryAgain"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
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
            {step === "request"
              ? t("auth.forgotPassword")
              : t("auth.resetPassword")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {step === "request" ? (
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <p className="text-gray-600 mb-4">
              {t("auth.forgotPasswordInstructions")}
            </p>

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
                  value={email}
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? `${t("auth.verifying")}...` : t("auth.verifyEmail")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-gray-600 mb-4">
              {t("auth.resetPasswordInstructions")}
            </p>

            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("auth.newPassword")}
              </label>
              <div className="relative">
                <Lock
                  className={`absolute ${
                    isRTL ? "right-3" : "left-3"
                  } top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`}
                />
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={newPassword}
                  onChange={handleInputChange}
                  className={`w-full ${
                    isRTL ? "pr-10 pl-10 text-right" : "pl-10 pr-10 text-left"
                  } py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.newPassword ? "border-red-500" : ""
                  }`}
                  placeholder={t("auth.newPassword")}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={`absolute ${
                    isRTL ? "left-3" : "right-3"
                  } top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p
                  className={`text-red-500 text-sm mt-1 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("auth.confirmPassword")}
              </label>
              <div className="relative">
                <Lock
                  className={`absolute ${
                    isRTL ? "right-3" : "left-3"
                  } top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full ${
                    isRTL ? "pr-10 pl-10 text-right" : "pl-10 pr-10 text-left"
                  } py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  placeholder={t("auth.confirmPassword")}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute ${
                    isRTL ? "left-3" : "right-3"
                  } top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p
                  className={`text-red-500 text-sm mt-1 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? `${t("auth.resetting")}...`
                : t("auth.resetPassword")}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setStep("request");
              onSwitchToLogin();
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {t("auth.backToLogin")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
