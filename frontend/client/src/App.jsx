import { Route, Routes, Navigate } from "react-router-dom";
import HRDashboard from "./pages/HR/HR-Dashboard/HRDashboard";
import HRProfile from "./pages/HR/HR-Profile/HRProfile";
import HRLeaves from "./pages/HR/HR-Leaves/HRLeaves";
import ListEmployees from "./pages/HR/Employees/ListEmployees";
import EditEmployee from "./pages/HR/Employees/EditEmployee";
import AddEmployee from "./pages/HR/Employees/AddEmployee";
import ViewEmployee from "./pages/HR/Employees/ViewEmployee";
import "flowbite";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/company">
          <Route path="dashboard" element={<HRDashboard />} />
          <Route path="hrprofile" element={<HRProfile />} />
          <Route path="hrleaves" element={<HRLeaves />} />
          <Route path="employees" element={<ListEmployees />} />
          <Route path='employeeprofile/:id' element={<EditEmployee/>}/>
          <Route path="addemployee" element={<AddEmployee />} />
          <Route path='viewemployeeprofile/:id' element={<ViewEmployee/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;
