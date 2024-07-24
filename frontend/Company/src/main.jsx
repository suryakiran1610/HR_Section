import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { SidebarContextProvider } from './context/sidebarContext.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <SidebarContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SidebarContextProvider>
  // </React.StrictMode>,
)
