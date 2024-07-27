import React, { useEffect, useState } from "react";
import { FiUsers, FiDollarSign, FiBell } from "react-icons/fi";
import { FaRegPaperPlane } from "react-icons/fa";
import axios from "axios";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import config from "../../../Functions/config";
import HRNav from "../../../components/HR/HR-Navbar/HRNav";
import HRSidebar from "../../../components/HR/HR-Sidebar/HRSidebar";


const HRDashboard = () => {
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [totalPlanPricing, setTotalPlanPricing] = useState(0);
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const fetchAllSectionCount = async () => {
    try {
      const [companiesRes, subscriptionsRes, notificationsRes, planPricingRes] =
        await Promise.all([
          axios.get(`${config.baseApiUrl}companies/`),
          axios.get(`${config.baseApiUrl}admin/subscriptions/`),
          axios.get(`${config.baseApiUrl}admin/notifications/`),
          axios.get(`${config.baseApiUrl}admin/create-subscription-plan/`),
        ]);

      setTotalCompanies(companiesRes.data.length);
      setTotalSubscriptions(subscriptionsRes.data.length);
      setTotalNotifications(notificationsRes.data.length);
      setTotalPlanPricing(planPricingRes.data.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllSectionCount();
  }, []);

  return (
    <>
      <div className="bg-[rgb(16,23,42)]">
        <HRNav />
        <div className="flex min-h-screen pt-20">
          <div className="w-fit md:fixed top-20 left-0 min-h-screen bottom-0 md:block hidden z-40">
            <HRSidebar sidebarToggle={sidebarToggle} />
          </div>

          <div
            className={`flex-1 min-h-screen overflow-auto transition-all duration-300 ${
              isSidebarCollapsed ? "md:ml-64 ml-0" : "md:ml-20 ml-0 md:px-16"
            }`}
          >
             <div className="w-full min-h-screen sm:px-6 lg:px-8 lg:py-7 mx-auto">
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HRDashboard;
