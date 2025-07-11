import React, { useState, useEffect } from "react";
import {
  FileText,
  Users,
  Package,
  DollarSign,
  Plus,
  Settings,
  History,
} from "lucide-react";
import { useApp } from "../../hooks/useApp";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { Invoice } from "../../types";

interface DashboardProps {
  onPageChange: (page: string) => void;
}

interface DashboardStats {
  totalInvoices: number;
  totalClients: number;
  totalProducts: number;
  totalRevenue: number;
  recentInvoices?: Invoice[];
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const { state } = useApp();
  const { state: authState } = useAuth();
  const { t, isRTL } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    totalClients: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentInvoices: [],
  });
  const [globalStats, setGlobalStats] = useState<DashboardStats>({
    totalInvoices: 0,
    totalClients: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  const currencySymbol =
    state.company.currency === "USD"
      ? "$"
      : state.company.currency === "CHF"
      ? "CHF"
      : "ج.م";

  // Load dashboard statistics
  useEffect(() => {
    const loadStats = async () => {
      try {
        if (authState.isAuthenticated && authState.token) {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/dashboard/stats`,
            {
              headers: {
                Authorization: `Bearer ${authState.token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) throw new Error("Failed to fetch stats");
          const data = await response.json();
          setStats(data.data);
        }

        const globalResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/dashboard/global-stats`
        );
        if (!globalResponse.ok) throw new Error("Failed to fetch global stats");
        const globalData = await globalResponse.json();
        setGlobalStats(globalData.data);
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      }
    };

    loadStats();
  }, [authState.isAuthenticated, authState.token]);

  // Use user stats if authenticated, otherwise use global stats
  const displayStats = authState.isAuthenticated ? stats : globalStats;
  const activeClients = state.clients.filter((client) => !client.archived);
  const activeProducts = state.products.filter((product) => !product.archived);

  const statsData = [
    {
      title: t("dashboard.totalInvoices"),
      value: displayStats.totalInvoices,
      icon: FileText,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: t("dashboard.totalClients"),
      value: authState.isAuthenticated
        ? activeClients.length
        : displayStats.totalClients,
      icon: Users,
      color: "bg-green-50 text-green-600",
    },
    {
      title: t("dashboard.totalProducts"),
      value: authState.isAuthenticated
        ? activeProducts.length
        : displayStats.totalProducts,
      icon: Package,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: t("dashboard.totalRevenue"),
      value: `${currencySymbol}${displayStats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: t("dashboard.createNewInvoice"),
      description: t("dashboard.createNewInvoiceDesc"),
      icon: Plus,
      action: () => onPageChange("create"),
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: t("navigation.settings"),
      description: t("dashboard.settingsDesc"),
      icon: Settings,
      action: () => onPageChange("settings"),
      color: "bg-gray-600 hover:bg-gray-700",
    },
    {
      title: t("dashboard.viewInvoiceHistory"),
      description: t("dashboard.viewInvoiceHistoryDesc"),
      icon: History,
      action: () => onPageChange("history"),
      color: "bg-green-600 hover:bg-green-700",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1
          className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-2 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("dashboard.title")}
        </h1>
        <p className={`text-gray-600 ${isRTL ? "text-right" : "text-left"}`}>
          {authState.isAuthenticated
            ? t("dashboard.subtitle")
            : t("dashboard.welcomeMessage")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
            >
              <div
                className={`flex items-center justify-between ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-6 sm:mb-8">
        <h2
          className={`text-lg sm:text-xl font-semibold text-gray-900 mb-4 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("dashboard.quickActions")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`${
                  action.color
                } text-white p-4 sm:p-6 rounded-lg shadow-sm transition-colors ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 mb-3" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  {action.title}
                </h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Invoices */}
      <div>
        <h2
          className={`text-lg sm:text-xl font-semibold text-gray-900 mb-4 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("dashboard.recentInvoices")}
        </h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3
              className={`text-base sm:text-lg font-medium text-gray-900 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("dashboard.latestActivity")}
            </h3>
          </div>
          <div className="p-4 sm:p-6">
            {!authState.isAuthenticated ? (
              <p className="text-gray-500 text-center py-8">
                {t("auth.pleaseLoginToView")}
              </p>
            ) : stats.recentInvoices && stats.recentInvoices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {t("dashboard.noInvoicesYet")}
              </p>
            ) : (
              <div className="space-y-4">
                {(stats.recentInvoices || []).slice(0, 5).map((invoice) => (
                  <div
                    key={invoice._id}
                    className={`flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex items-center ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <FileText
                        className={`h-6 w-6 sm:h-8 sm:w-8 text-gray-400 ${
                          isRTL ? "ml-3" : "mr-3"
                        }`}
                      />
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">
                          {invoice.number}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {invoice.client.name}
                        </p>
                      </div>
                    </div>
                    <div className={isRTL ? "text-left" : "text-right"}>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        {currencySymbol}
                        {invoice.total.toFixed(2)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {new Date(invoice.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
