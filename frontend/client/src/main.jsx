import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { SidebarContextProvider } from "./context/sidebarContext.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <NotificationProvider>
        <ProfileProvider>
      <SidebarContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SidebarContextProvider>
      </ProfileProvider>
  </NotificationProvider>
  // </React.StrictMode>
);
