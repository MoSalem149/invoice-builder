import React, { createContext, useContext, ReactNode } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationContextType } from "../types";

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const notifications = useNotifications();

  // Adapt the notifications value to match the expected type
  const adaptedNotifications = {
    ...notifications,
    notifications: notifications.notifications.map((notification) => ({
      ...notification,
      onClose: () => notification.onClose(notification.id), // Adapt the onClose signature
    })),
  };

  return (
    <NotificationContext.Provider value={adaptedNotifications}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export { NotificationContext };
