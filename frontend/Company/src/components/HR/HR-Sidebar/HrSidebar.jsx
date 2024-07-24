import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdKeyboardArrowLeft,
  MdOutlineCategory,
  MdOutlineAttachMoney,
  MdBusiness,
  MdSubscriptions,
  MdNotifications,
  MdSettings,
  MdLock,
  MdExitToApp,
  MdProductionQuantityLimits,
} from "react-icons/md";
import React from "react";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import "./HrSidebar.css";

const HrSidebar = ({ sidebarToggle }) => {
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [pass, setPass] = useState("");
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const passFromUrl = urlParams.get("password");
    if (passFromUrl) {
      setPass(passFromUrl);
    } else {
      setPass("");
    }
  }, [location.search]);

  const handleSignOut = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidebar = () => {
    sidebarToggle();
    if (isAccountSettingsOpen) {
      setIsAccountSettingsOpen(!isAccountSettingsOpen);
    }
  };

  const toggleAccountSettings = () => {
    setIsAccountSettingsOpen(!isAccountSettingsOpen);
  };

  const menu = [
    {
      name: "Dashboard",
      link: "/admin/dashboard",
      icon: MdOutlineDashboard,
    },
    {
      name: "Product & Features",
      link: "/admin/product-features",
      icon: MdOutlineCategory,
    },
    {
      name: "Plan & Pricing",
      link: "/admin/plan-pricing",
      icon: MdOutlineAttachMoney,
    },
    {
      name: "Company",
      link: "/admin/company",
      icon: MdBusiness,
    },
    {
      name: "Subscriptions",
      link: "/admin/subscriptions",
      icon: MdSubscriptions,
    },
    {
      name: "Product Purchase & Sales",
      link: "/admin/product-purchase-sales",
      icon: MdProductionQuantityLimits,
    },
    {
      name: "Notifications",
      link: "/admin/notifications",
      icon: MdNotifications,
    },
    {
      name: "Account Settings",
      icon: MdSettings,
      submenu: [
        {
          name: "Password Change",
          action: () => {
            navigate("/admin/account?password=reset");
          },
          icon: MdLock,
          pass: "reset",
        },
        { name: "Signout", action: handleSignOut, icon: MdExitToApp },
      ],
    },
  ];

  return (
    <>
      <section className="flex gap-6 fixed top-20 left-0 bottom-0 z-50 border-r border-gray-700">
        <div
          className={`bg-[rgb(16,23,42)] z-50 min-h-screen ${
            isSidebarCollapsed ? "w-64" : "w-20"
          } duration-300 text-gray-100 px-4`}
        >
          <div className="py-3 flex justify-end">
            <div className="bg-purple-700 rounded-full">
              <MdKeyboardArrowLeft
                size={26}
                className={`cursor-pointer transition-transform duration-300 ${
                  isSidebarCollapsed ? "" : "rotate-180"
                }`}
                onClick={toggleSidebar}
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4 relative">
            {menu?.map((menuItem, i) => (
              <React.Fragment key={i}>
                {menuItem.submenu ? (
                  <div className="relative group mt-20 z-50">
                    <div
                      className={`group z-50 flex items-center cursor-pointer text-sm gap-3.5 font-medium p-2 hover:bg-purple-800 rounded-md`}
                      onClick={toggleAccountSettings}
                    >
                      <div
                        className={`${
                          !isSidebarCollapsed
                            ? "ml-1 transition-transform duration-300"
                            : "transition-transform duration-300"
                        }`}
                      >
                        {React.createElement(menuItem.icon, { size: "24" })}
                      </div>
                      <h2
                        className={`whitespace-pre duration-500 ${
                          !isSidebarCollapsed &&
                          "opacity-0 translate-x-20 overflow-hidden"
                        }`}
                      >
                        {menuItem.name}
                      </h2>
                      <h2
                        className={`${
                          isSidebarCollapsed && "hidden"
                        } absolute z-50 left-20 bg-purple-800 font-semibold whitespace-pre text-white rounded-sm drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                      >
                        {menuItem.name}
                      </h2>
                    </div>
                    {isAccountSettingsOpen && (
                      <div
                        className={`absolute flex flex-col gap-4 top-full left-3 bg-gray-800 shadow-lg rounded-md p-2 mt-1 ${
                          isSidebarCollapsed ? "w-full" : "w-max"
                        }`}
                      >
                        {menuItem.submenu.map((subMenuItem, j) => (
                          <div
                            key={j}
                            className={`flex items-center gap-3.5 text-sm font-medium p-2 bg-gray-800 hover:bg-purple-800 rounded-md cursor-pointer hover:text-gray-200 ${
                              subMenuItem.pass === pass
                                ? "bg-purple-800"
                                : "hover:bg-purple-800"
                            }`}
                            onClick={() => {
                              subMenuItem.action && subMenuItem.action();
                              setIsAccountSettingsOpen(false);
                            }}
                          >
                            {React.createElement(subMenuItem.icon, {
                              size: "20",
                            })}
                            <span>{subMenuItem.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={menuItem.link}
                    className={`group z-50 flex items-center text-sm gap-3.5 font-medium p-2 rounded-md ${
                      location.pathname === menuItem.link
                        ? "bg-purple-800"
                        : "hover:bg-purple-800"
                    }`}
                  >
                    <div
                      className={`${
                        !isSidebarCollapsed
                          ? "ml-1 transition-transform duration-300"
                          : "transition-transform duration-300"
                      }`}
                    >
                      {React.createElement(menuItem.icon, { size: "24" })}
                    </div>
                    <h2
                      className={`whitespace-pre duration-500 ${
                        !isSidebarCollapsed &&
                        "opacity-0 translate-x-20 overflow-hidden"
                      }`}
                    >
                      {menuItem.name}
                    </h2>
                    <h2
                      className={`${
                        isSidebarCollapsed && "hidden"
                      } absolute left-20 z-50 bg-purple-800 font-semibold whitespace-pre text-white rounded-sm drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                    >
                      {menuItem.name}
                    </h2>
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HrSidebar;
