import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { FaTasks } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import React from "react";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import "./HRSidebar.css";

const HRSidebar = ({ sidebarToggle }) => {
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

  const menu = [
    {
      name: "Dashboard",
      link: "/company/dashboard",
      icon: MdDashboard,
    },
    {
      name: "Leaves",
      link: "/company/hrleaves",
      icon: SlCalender,
    },
    {
      name: "Employees",
      link: "/company/employees",
      icon: IoIosPeople,
    },
    {
      name: "Task",
      link: "/company/task",
      icon: FaTasks,
    },
  ];

  return (
    <>
      <section className="flex gap-6 fixed top-16 left-0 bottom-0 z-50 border-r border-gray-700">
        <div
          className={`bg-[rgba(41,39,63,255)] z-50 min-h-screen ${
            isSidebarCollapsed ? "w-64" : "w-20"
          } duration-300 text-gray-100 px-4`}
        >
            <div
          className="absolute top-1/2 transform -translate-y-1/2 bg-[rgba(177,178,179,255)] hover:bg-blue-700 rounded-md"
          style={{ right: isSidebarCollapsed ? '-1rem' : '-0.5rem' }}
        >
          <MdKeyboardArrowLeft
            size={26}
            className={`cursor-pointer transition-transform duration-300  text-[rgba(41,39,63,255)] hover:text-white ${
              isSidebarCollapsed ? "" : "rotate-180"
            }`}
            onClick={toggleSidebar}
          />
        </div>
          <div className="mt-6 flex flex-col gap-4 relative">
            {menu?.map((menuItem, i) => (
              <React.Fragment key={i}>
                {menuItem.submenu ? (
                  <div className="relative group mt-20 z-50">
                    <div
                      className={`group z-50 flex items-center cursor-pointer text-sm gap-3.5 font-medium p-2 hover:bg-blue-800 rounded-md`}
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
                        } absolute z-50 left-20 bg-blue-800 font-semibold whitespace-pre text-white rounded-sm drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
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
                            className={`flex items-center gap-3.5 text-sm font-medium p-2 bg-gray-800 hover:bg-blue-800 rounded-md cursor-pointer hover:text-gray-200 ${
                              subMenuItem.pass === pass
                                ? "bg-blue-800"
                                : "hover:bg-blue-800"
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
                        ? "bg-blue-800"
                        : "hover:bg-blue-800"
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
                      } absolute left-20 z-50 bg-blue-800 font-semibold whitespace-pre text-white rounded-sm drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
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

export default HRSidebar;
