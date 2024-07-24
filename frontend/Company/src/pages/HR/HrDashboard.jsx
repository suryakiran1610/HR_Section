import React, { useEffect, useState } from "react";
import { FiUsers, FiDollarSign, FiBell } from "react-icons/fi";
import { FaRegPaperPlane } from "react-icons/fa";
import axios from "axios";
import HrNavbar from "../../components/HR/HR-Navbar/HrNavbar";
import HrSidebar from "../../components/HR/HR-Sidebar/HrSidebar";
import { useSidebarContext } from "../../hooks/useSidebarContext";

const HrDashboard = () => {
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [totalPlanPricing, setTotalPlanPricing] = useState(0);
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  
  return (
    <>
       <div className="bg-[rgb(16,23,42)]">
        <HrNavbar />
        <div className="flex min-h-screen pt-20">
          <div className="w-fit md:fixed top-20 left-0 min-h-screen bottom-0 md:block hidden z-50">
            <HrSidebar sidebarToggle={sidebarToggle} />
          </div>

          <div
            className={`flex-1 min-h-screen overflow-auto transition-all duration-300 z-40 ${
              isSidebarCollapsed ? "md:ml-64 ml-0" : "md:ml-20 ml-0 md:px-16"
            }`}
          >
            <div className="bg-slate-900 min-h-full text-white px-4">
              <div className="bg-transparent px-4 py-16 text-white">
                <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-x-6 gap-y-12 max-w-7xl mx-auto">
                  <div className="text-center bg-gray-800 p-4 border-b-4 border-purple-700 rounded-md">
                    <FiUsers className="fill-purple-600 w-10 inline-block size-10" />
                    <h3 className="text-5xl font-extrabold mt-5">
                      {totalCompanies}
                    </h3>
                    <p className="text-gray-300 font-semibold mt-3">
                      Total Companies
                    </p>
                  </div>
                  <div className="text-center bg-gray-800 p-4 border-b-4 border-purple-700 rounded-md">
                    <FiDollarSign className="fill-purple-600 w-10 inline-block size-10" />
                    <h3 className="text-5xl font-extrabold mt-5">
                      {totalPlanPricing}
                    </h3>
                    <p className="text-gray-300 font-semibold mt-3">
                      Total Plan and Pricing
                    </p>
                  </div>
                  <div className="text-center bg-gray-800 p-4 border-b-4 border-purple-700 rounded-md">
                    <FaRegPaperPlane className="fill-purple-400 w-10 inline-block size-10" />
                    <h3 className="text-5xl font-extrabold mt-5">
                      {totalSubscriptions}
                    </h3>
                    <p className="text-gray-300 font-semibold mt-3">
                      Total Subscriptions
                    </p>
                  </div>
                  <div className="text-center bg-gray-800 p-4 border-b-4 border-purple-700 rounded-md">
                    <FiBell className="fill-purple-600 w-10 inline-block size-10" />
                    <h3 className="text-5xl font-extrabold mt-5">
                      {totalNotifications}
                    </h3>
                    <p className="text-gray-300 font-semibold mt-3">
                      Total Notifications
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HrDashboard;