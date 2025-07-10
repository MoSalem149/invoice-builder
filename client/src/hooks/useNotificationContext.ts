// useNotificationContext.ts
import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { NotificationContextType } from "../types";

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};
