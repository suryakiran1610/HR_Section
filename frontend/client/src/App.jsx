import { Route, Routes, Navigate } from "react-router-dom";
import HRDashboard from "./pages/HR/HR-Dashboard/HRDashboard";
import HRProfile from "./pages/HR/HR-Profile/HRProfile";
import "flowbite";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/company">
          <Route path="dashboard" element={<HRDashboard />} />
          <Route path="hrprofile" element={<HRProfile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
