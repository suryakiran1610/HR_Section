import { Route, Routes, Navigate } from "react-router-dom";
import './App.css'
import "flowbite";
import HrDashboard from "./pages/HR/HrDashboard";



function App() {

  return (
    <>
      <Routes>
      <Route path="/company">
          <Route path="hrdashboard" element={<HrDashboard />} />
      </Route>
      </Routes>
    </>
  )
}

export default App
