import React, { useState } from "react";
import {
  FileText,
  Home,
  Settings,
  History,
  Plus,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { useAuth } from "../../hooks/useAuth";

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onShowLogin: () => void;
  onShowRegister: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onPageChange,
  onShowLogin,
  onShowRegister,
}) => {
  const { t, isRTL } = useLanguage();
  const { state: authState, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: t("navigation.dashboard"), icon: Home },
    ...(authState.isAuthenticated
      ? [
          { id: "create", label: t("navigation.create"), icon: Plus },
          { id: "settings", label: t("navigation.settings"), icon: Settings },
          { id: "history", label: t("navigation.history"), icon: History },
        ]
      : []),
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex justify-between items-center h-16 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {/* Logo/Brand */}
          <div
            className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <button
              onClick={() => onPageChange("dashboard")}
              className="flex items-center focus:outline-none"
            >
              <FileText
                className={`h-8 w-8 text-gray-800 ${isRTL ? "ml-3" : "mr-3"}`}
              />
              <span className="text-xl font-semibold text-gray-800">
                {t("navigation.invoiceBuilder")}
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div
              className={`flex items-center space-x-4 ${
                isRTL ? "space-x-reverse" : ""
              }`}
            >
              <div
                className={`flex space-x-8 ${isRTL ? "space-x-reverse" : ""}`}
              >
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onPageChange(item.id)}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isRTL ? "flex-row-reverse" : ""
                      } ${
                        currentPage === item.id
                          ? "text-gray-900 bg-gray-100"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <IconComponent
                        className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Auth Buttons */}
              <div
                className={`flex items-center space-x-2 ${
                  isRTL ? "space-x-reverse" : ""
                }`}
              >
                {authState.isAuthenticated ? (
                  <div
                    className={`flex items-center space-x-2 ${
                      isRTL ? "space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 ${
                        isRTL ? "space-x-reverse flex-row-reverse" : ""
                      }`}
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {authState.user?.name || t("auth.user")}
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors ${
                        isRTL ? "space-x-reverse flex-row-reverse" : ""
                      }`}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t("auth.logout")}</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={onShowLogin}
                      className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors ${
                        isRTL ? "space-x-reverse flex-row-reverse" : ""
                      }`}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>{t("auth.login")}</span>
                    </button>
                    <button
                      onClick={onShowRegister}
                      className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors ${
                        isRTL ? "space-x-reverse flex-row-reverse" : ""
                      }`}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>{t("auth.signUp")}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 text-base font-medium rounded-md ${
                  isRTL ? "flex-row-reverse" : ""
                } ${
                  currentPage === item.id
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <IconComponent
                  className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                />
                {item.label}
              </button>
            );
          })}

          {/* Mobile Auth Buttons */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {authState.isAuthenticated ? (
              <div className="space-y-3">
                <div
                  className={`flex items-center px-3 py-2 text-base font-medium text-gray-600 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                    {authState.user?.name || t("auth.user")}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                    {t("auth.logout")}
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onShowLogin();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                    {t("auth.login")}
                  </span>
                </button>
                <button
                  onClick={() => {
                    onShowRegister();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                    {t("auth.signUp")}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
