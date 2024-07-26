import { useContext } from "react";
import { AdminNotificationContext } from "../context/adminNotificationContext";

export const useAdminNotificationContext = () => {
  const context = useContext(AdminNotificationContext);

  if (!context) {
    throw new Error("useAdminNotificationContext must be used within the AdminNotificationContextProvider");
  }

  return context;
}
