import React, { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { LanguageProvider } from "./context/LanguageContext";
import {
  NotificationProvider,
} from "./context/NotificationContext";
import { useAuth } from "./hooks/useAuth";
import { useNotificationContext } from "./hooks/useNotificationContext";
import NotificationContainer from "./components/UI/NotificationContainer";
import LoginModal from "./components/Auth/LoginModal";
import RegisterModal from "./components/Auth/RegisterModal";
import ForgotPasswordModal from "./components/Auth/ForgotPasswordModal";
import Navbar from "./components/Layout/Navbar";
import Dashboard from "./components/Dashboard/Dashboard";
import Settings from "./components/Settings/Settings";
import History from "./components/History/History";
import CreateInvoice from "./components/Create/CreateInvoice";
import { useLanguage } from "./hooks/useLanguage";

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const { notifications, removeNotification } = useNotificationContext();
  const { state: authState } = useAuth();
  const { t } = useLanguage();

  // Update document title based on current page
  useEffect(() => {
    const pageTitles = {
      dashboard: `${t("navigation.dashboard")} - ${t(
        "navigation.invoiceBuilder"
      )}`,
      create: `${t("navigation.create")} - ${t("navigation.invoiceBuilder")}`,
      settings: `${t("navigation.settings")} - ${t(
        "navigation.invoiceBuilder"
      )}`,
      history: `${t("navigation.history")} - ${t("navigation.invoiceBuilder")}`,
    };

    document.title =
      pageTitles[currentPage as keyof typeof pageTitles] ||
      t("navigation.invoiceBuilder");
  }, [currentPage, t]);

  // Handle page changes with authentication checks
  const handlePageChange = (page: string) => {
    if (
      !authState.isAuthenticated &&
      ["create", "settings", "history"].includes(page)
    ) {
      setShowLoginModal(true);
      return;
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onPageChange={handlePageChange} />;
      case "settings":
        if (!authState.isAuthenticated)
          return <Dashboard onPageChange={handlePageChange} />;
        return <Settings />;
      case "history":
        if (!authState.isAuthenticated)
          return <Dashboard onPageChange={handlePageChange} />;
        return <History />;
      case "create":
        if (!authState.isAuthenticated)
          return <Dashboard onPageChange={handlePageChange} />;
        return <CreateInvoice />;
      default:
        return <Dashboard onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onShowLogin={() => setShowLoginModal(true)}
        onShowRegister={() => setShowRegisterModal(true)}
      />
      <main className="pb-8">{renderPage()}</main>
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
        onShowForgotPassword={() => {
          setShowLoginModal(false);
          setShowForgotPasswordModal(true);
        }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSwitchToLogin={() => {
          setShowForgotPasswordModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AppProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
