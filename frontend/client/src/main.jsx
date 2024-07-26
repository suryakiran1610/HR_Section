import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AdminNotificationContextProvider } from "./context/adminNotificationContext.jsx";
import { SidebarContextProvider } from "./context/sidebarContext.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <AdminNotificationContextProvider>
        <ProfileProvider>
      <SidebarContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SidebarContextProvider>
      </ProfileProvider>
  </AdminNotificationContextProvider>
  // </React.StrictMode>
);
