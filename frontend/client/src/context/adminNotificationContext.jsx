import { createContext, useEffect, useReducer } from "react";

export const AdminNotificationContext = createContext();

const adminNotificationReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_UNREAD_NOTIFICATIONS":
      return {
        ...state,
        unreadNotifications: action.payload,
        notificationCount: action.payload.length,
      };
    default:
      return state;
  }
};

export const AdminNotificationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminNotificationReducer, {
    unreadNotifications:
      JSON.parse(localStorage.getItem("unreadNotifications")) || [],
    notificationCount:
      JSON.parse(localStorage.getItem("unreadNotifications"))?.length || 0,
  });

  useEffect(() => {
    localStorage.setItem(
      "unreadNotifications",
      JSON.stringify(state.unreadNotifications)
    );
  }, [state.unreadNotifications]);

  return (
    <AdminNotificationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AdminNotificationContext.Provider>
  );
};
