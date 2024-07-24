import Cookies from "js-cookie";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FiBell, FiZap, FiUser, FiArrowRight } from "react-icons/fi";
import { useEffect, useState, useRef } from "react";
import {
  MdOutlineDashboard,
  MdOutlineCategory,
  MdOutlineAttachMoney,
  MdBusiness,
  MdSubscriptions,
  MdNotifications,
  MdSettings,
  MdLock,
  MdExitToApp,
  MdKeyboardArrowDown,
} from "react-icons/md";
// import { useAdminProfileContext } from "../../../hooks/useAdminProfileContext";
// import { useAdminNotificationContext } from "../../../hooks/useAdminNotificationContext";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import config from "../../../Functions/config";

const HrNavbar = () => {
//   const { profile } = useAdminProfileContext();
//   const { notificationCount, unreadNotifications, dispatch } =
//     useAdminNotificationContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const location = useLocation();
  const [pass, setPass] = useState();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const zapButtonRef = useRef(null);

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
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setDropdownOpen1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownOpen1(!dropdownOpen1);
    setDropdownOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        zapButtonRef.current &&
        !zapButtonRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef, zapButtonRef]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${config.baseApiUrl}admin/notifications/`
        );

        const unread = response.data.filter(
          (notification) => !notification.is_read
        );
        dispatch({ type: "UPDATE_UNREAD_NOTIFICATIONS", payload: unread });
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <>
      {/* <AdminSubscriptionUpdates /> */}
      <div className="z-50" onMouseLeave={() => setDropdownOpen(false)}>
        <header className="fixed top-0 left-0 right-0 h-20 flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-[rgb(16,23,42)] border-b border-gray-700 text-sm py-2.5 sm:py-4 dark:bg-neutral-950 dark:border-neutral-700">
          <nav
            className="flex basis-full items-center w-full mx-auto px-4 sm:px-6 lg:px-8"
            aria-label="Global"
          >
            <div className="me-5 md:me-8 flex">
              <a
                className="flex-none text-2xl font-semibold text-white"
                href="#"
                aria-label="Brand"
              >
                Admin Dash
              </a>
            </div>

            <div className="w-full flex items-center justify-end ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
              <div className="flex flex-row items-center justify-end gap-2 ml-auto">
                <div className="relative">
                  <button
                    onClick={toggleDropdown1}
                    type="button"
                    className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-white hover:bg-white/20 disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
                  >
                    <FiBell className="flex-shrink-0 size-4" />
                    {/* {notificationCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center  px-2 py-1 text-xs font-bold leading-none text-red-100 bg-purple-700 rounded-full transform translate-x-1/2 -translate-y-1/2">
                        {notificationCount}
                      </span>
                    )} */}
                  </button>
                  {dropdownOpen1 && (
                    <div
                      onMouseLeave={() => setDropdownOpen1(false)}
                      className="absolute right-0 mt-2 w-72 bg-slate-900 border border-gray-700 shadow-md rounded-lg z-10"
                    >
                      <div className="py-4 px-4 bg-gray-800 text-white font-semibold rounded-t-lg">
                        Notifications
                      </div>
                      <div className="max-h-60 overflow-y-auto divide-y divide-gray-700">
                        {unreadNotifications.length > 0 ? (
                          unreadNotifications.map((notification, index) => (
                            <div
                              key={notification.id}
                              onClick={() => navigate("/admin/notifications")}
                              className={`p-4 text-white cursor-pointer hover:bg-slate-800 ${
                                index === unreadNotifications.length - 1
                                  ? "rounded-b-lg"
                                  : ""
                              }`}
                            >
                              <p>{notification.message}</p>
                              <p className="text-xs text-gray-400">
                                {formatDistanceToNow(
                                  new Date(notification.created_at),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-gray-400">
                            No new notifications
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-white hover:bg-white/20 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600"
                  onClick={toggleSidebar}
                  ref={zapButtonRef}
                >
                  <FiZap className="flex-shrink-0 size-4" />
                </button>

                <div className="relative inline-flex">
                  <button
                    onClick={() => toggleDropdown()}
                    type="button"
                    className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-white hover:bg-white/20 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600"
                  >
                    {/* <img
                      className="inline-block size-[38px] rounded-full object-cover"
                      src={`${config.baseApiImageUrl}${profile.profile}`}
                      alt={profile.username}
                    /> */}
                  </button>

                  {dropdownOpen && (
                    <div
                      onMouseLeave={() => setDropdownOpen(false)}
                      className="absolute right-0 mt-12 w-48 bg-gray-900 border border-gray-700 shadow-lg rounded-lg p-2 z-10"
                    >
                      <div className="py-3 px-5 -m-2 bg-gray-900 rounded-t-lg border-b border-b-gray-700">
                        <p className="text-sm text-white">Signed in as</p>
                        <p className="text-sm font-medium text-white">
                          {profile.username}
                        </p>
                      </div>
                      <div className="mt-2 py-2 first:pt-0 last:pb-0">
                        <Link
                          to="/admin/account"
                          className={`flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-white hover:bg-purple-600 ${
                            location.pathname === "/admin/account"
                              ? "bg-purple-600"
                              : ""
                          }`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FiUser className="flex-shrink-0 size-4" />
                          Account
                        </Link>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-white hover:bg-purple-600 w-full"
                      >
                        <FiArrowRight className="flex-shrink-0 size-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </header>

        <aside
          ref={sidebarRef}
          className={`fixed top-20 left-0 h-full w-64 bg-[rgb(16,23,42)] md:hidden border-r border-r-gray-700 shadow-lg z-50 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <div className="p-4">
            <nav
              className="space-y-4 mt-10
          "
            >
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-x-3 py-2 px-4 text-white hover:bg-purple-800 rounded-lg ${
                  location.pathname === "/admin/dashboard"
                    ? "bg-purple-800"
                    : ""
                }`}
              >
                <MdOutlineDashboard className="text-2xl" />
                Dashboard
              </Link>
              <Link
                to="/admin/product-features"
                className={`flex items-center gap-x-3 py-2 px-4 text-white hover:bg-purple-800 rounded-lg ${
                  location.pathname === "/admin/product-features"
                    ? "bg-purple-800"
                    : ""
                }`}
              >
                <MdOutlineCategory className="text-2xl" />
                Products & Features
              </Link>
              <Link
                to="/admin/plan-pricing"
                className={`flex items-center gap-x-3 py-2 px-4 text-white hover:bg-purple-800 rounded-lg ${
                  location.pathname === "/admin/plan-pricing"
                    ? "bg-purple-800"
                    : ""
                }`}
              >
                <MdOutlineAttachMoney className="text-2xl" />
                Plan & Pricing
              </Link>
              <Link
                to="/admin/company"
                className={`flex items-center gap-x-3 py-2 px-4 text-white hover:bg-purple-800 rounded-lg ${
                  location.pathname === "/admin/company" ? "bg-purple-800" : ""
                }`}
              >
                <MdBusiness className="text-2xl" />
                Company
              </Link>
              <Link
                to="/admin/subscriptions"
                className={`flex items-center gap-x-3 py-2 px-4 text-white hover:bg-purple-800 rounded-lg ${
                  location.pathname === "/admin/subscriptions"
                    ? "bg-purple-800"
                    : ""
                }`}
              >
                <MdSubscriptions className="text-2xl" />
                Subscriptions
              </Link>
              <Link
                to="/admin/notifications"
                className={`flex items-center gap-x-3 py-2 px-4 text-white hover:bg-purple-800 rounded-lg ${
                  location.pathname === "/admin/notifications"
                    ? "bg-purple-800"
                    : ""
                }`}
              >
                <MdNotifications className="text-2xl" />
                Notifications
              </Link>
            </nav>
            <div className="mt-10">
              <button
                onClick={() => setAccountSettingsOpen(!accountSettingsOpen)}
                className="flex items-center gap-x-3 py-2 px-4 text-white hover:bg-purple-800 rounded-lg w-full"
              >
                <MdSettings className="text-2xl" />
                Account Settings
                <MdKeyboardArrowDown
                  className={`ml-auto transform transition-transform ${
                    accountSettingsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {accountSettingsOpen && (
                <div className="space-y-2 ml-8 mt-2 bg-gray-800 rounded-md">
                  <Link
                    to="/admin/account?password=reset"
                    className={`flex items-center gap-x-3 py-2 px-4 text-white hover:bg-purple-800 rounded-lg ${
                      pass === "reset" ? "bg-purple-800" : ""
                    }`}
                  >
                    <MdLock className="text-2xl" />
                    Password change
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-x-3 py-2 px-4 text-white hover:bg-purple-800 rounded-lg w-full"
                  >
                    <MdExitToApp className="text-2xl" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default HrNavbar;
