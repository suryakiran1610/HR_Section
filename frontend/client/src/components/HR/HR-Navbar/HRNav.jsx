import Cookies from "js-cookie";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FiBell, FiZap, FiUser, FiArrowRight } from "react-icons/fi";
import { useContext, useEffect, useState, useRef } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import MakeApiRequest from "../../../Functions/AxiosApi";
import config from "../../../Functions/config";
import { SlCalender } from "react-icons/sl";
import { FaTasks } from "react-icons/fa";
import { BiMenuAltLeft } from "react-icons/bi";
import { FaBell } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import ProfileContext from "../../../context/ProfileContext";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

const HRNav = () => {
  const { profile, setProfile } = useContext(ProfileContext);
  const [notifications, setNotifications] = useState({
    notification: [],
    unreadnotificationcount: 0,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [pass, setPass] = useState("");
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

  const updateNotification = () => {
    MakeApiRequest("get", `${config.baseUrl}hr/getallnotification/`, {}, {}, {})
      .then((response) => {
        console.log("notification", response);
        setNotifications({
          notification: response.notification,
          unreadnotificationcount: response.unreadnotificationcount,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.status === 401) {
          console.log(
            "Unauthorized access. Token might be expired or invalid."
          );
        } else {
          console.error("Unexpected error occurred:", error);
        }
      });
  };

  useEffect(() => {
    updateNotification();
  }, []);

  useEffect(() => {
    const params = {
      user_id: "8",
    };
    MakeApiRequest(
      "get",
      `${config.baseUrl}hr/employeeprofile/`,
      {},
      params,
      {}
    )
      .then((response) => {
        console.log("hrprofile", response);
        setProfile(response);
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.status === 401) {
          console.log(
            "Unauthorized access. Token might be expired or invalid."
          );
        } else {
          console.error("Unexpected error occurred:", error);
        }
      });
  }, []);

  const deletenotification = (notificationId) => {
    const params = {
      notificationid: notificationId,
    };

    MakeApiRequest(
      "delete",
      `${config.baseUrl}hr/deletenotification/`,
      {},
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        updateNotification();
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.status === 401) {
          console.log(
            "Unauthorized access. Token might be expired or invalid."
          );
        } else {
          console.error("Unexpected error occurred:", error);
        }
      });
  };

  const readed = (notificationId) => {
    const params = {
      notificationid: notificationId,
    };

    MakeApiRequest(
      "put",
      `${config.baseUrl}hr/notificationn_readed/`,
      {},
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        updateNotification();
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.status === 401) {
          console.log(
            "Unauthorized access. Token might be expired or invalid."
          );
        } else {
          console.error("Unexpected error occurred:", error);
        }
      });
  };

  return (
    <>
      <div className="z-50">
        <header className="fixed top-0 left-0 right-0 h-16 flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-[rgba(41,39,63,255)] border-b border-gray-700 text-sm py-2.5 sm:py-4 dark:bg-neutral-950 dark:border-neutral-700">
          <nav
            className="flex basis-full items-center w-full mx-auto px-4 sm:px-6 lg:px-8"
            aria-label="Global"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Link
                  to="/company/dashboard"
                  className="flex-none text-2xl font-semibold text-white"
                  aria-label="Brand"
                >
                  HR Dashboard
                </Link>
                <button
                  type="button"
                  className="w-[2.375rem] ml-6 h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-white hover:bg-white/20 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600 sm:hidden"
                  ref={zapButtonRef}
                  onClick={toggleSidebar}
                >
                  <BiMenuAltLeft className="flex-shrink-0 size-8 ml-1" />
                </button>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <button
                    onClick={toggleDropdown1}
                    type="button"
                    className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-white hover:bg-white/20 disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
                  >
                    <FaBell className="flex-shrink-0 size-5" />
                    {notifications.unreadnotificationcount > 0 && (
                      <span className="absolute top-1 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
                        {notifications.unreadnotificationcount}
                      </span>
                    )}
                  </button>
                  {dropdownOpen1 && (
                    <div
                      onMouseLeave={() => setDropdownOpen1(false)}
                      className="absolute right-0 mt-2 w-72 bg-[rgba(31,28,47,255)] border border-gray-700 shadow-md rounded-lg z-10"
                    >
                      <div className="py-4 px-4 bg-gray-800 text-white font-semibold rounded-t-lg">
                        Notifications
                      </div>
                      <div className="max-h-60 overflow-y-auto divide-y divide-gray-700">
                        {notifications.notification.length > 0 ? (
                          notifications.notification.map(
                            (notification, index) =>
                              notification.notificationtype ===
                              "leave request" ? (
                                <div
                                  key={notification.id}
                                  onClick={() => {
                                    readed(notification.id);
                                  }}
                                  className={`w-full p-3 mt-2 mb-2  rounded shadow hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-shrink-0 ${
                                    notification.is_read
                                      ? " bg-[rgba(31,30,47,255)] text-white"
                                      : "bg-blue-200"
                                  }`}
                                >
                                  <div
                                    tabIndex="0"
                                    aria-label="group icon"
                                    role="img"
                                    className="focus:outline-none mr-2 w-8 h-8 border rounded-full border-gray-200 flex flex-shrink-0 items-center justify-center"
                                  >
                                    <img
                                      className="inline-block size-[38px] rounded-full object-cover"
                                      src={`${config.imagebaseurl}${notification.employeeid.profileimage}`}
                                      alt="profile"
                                    />
                                  </div>
                                  <div>
                                    <p>
                                      {notification.message} by{" "}
                                      {notification.employeeid.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {notification.date}
                                    </p>
                                  </div>
                                  <div
                                    className="focus:outline-none cursor-pointer flex w-3/5 justify-end"
                                  >
                                    <svg
                                      onClick={() => {
                                        deletenotification(notification.id);
                                      }}
                                      width="14"
                                      height="14"
                                      viewBox="0 0 14 14"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M10.5 3.5L3.5 10.5"
                                        stroke="#4B5563"
                                        strokeWidth="1.25"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M3.5 3.5L10.5 10.5"
                                        stroke="#4B5563"
                                        strokeWidth="1.25"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              ) : null
                          )
                        ) : (
                          <div className="p-4 text-gray-400">
                            No new notifications
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative inline-flex justify-center items-center">
                  <button
                    onClick={toggleDropdown}
                    type="button"
                    className="w-[2.375rem] h-[2.375rem] mr-2 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-white hover:bg-white/20 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600"
                  >
                    <img
                      className="inline-block size-[38px] rounded-full object-cover"
                      src={`${config.imagebaseurl}${profile.profileimage}`}
                      alt="profile"
                    />
                  </button>
                  <p className="text-white ml-2 mr-2 hidden sm:inline">
                    {profile.name}
                  </p>
                  <FaAngleDown
                    className="text-white mt-1 cursor-pointer"
                    onClick={toggleDropdown}
                  />

                  {dropdownOpen && (
                    <div
                      onMouseLeave={() => setDropdownOpen(false)}
                      className="absolute right-0 mt-48 w-48 bg-[rgba(31,28,47,255)] border border-gray-700 shadow-lg rounded-lg p-2 z-10"
                    >
                      <div className="py-3 px-5 -m-2 bg-[rgba(31,28,47,255)] rounded-t-lg border-b border-b-gray-700">
                        <p className="text-sm text-white">Signed in as</p>
                        <p className="text-sm font-medium text-white">
                          {profile.email}
                        </p>
                      </div>
                      <div className="mt-2 py-2 first:pt-0 last:pb-0">
                        <Link
                          to="/company/hrprofile"
                          className={`flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-white hover:bg-blue-600 ${
                            location.pathname === "/company/hrprofile"
                              ? "bg-blue-600"
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
                        className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-white hover:bg-blue-600 w-full"
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
          className={`fixed top-16 left-0 h-full w-64 bg-[rgba(41,39,63,255)] md:hidden border-r border-r-gray-700 shadow-lg z-50 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <div className="p-4">
            <nav className="space-y-4 mt-10">
              <Link
                to="/company/dashboard"
                className={`flex items-center gap-x-3 py-2 px-4 text-white hover:bg-blue-800 rounded-lg ${
                  location.pathname === "/company/dashboard"
                    ? "bg-blue-800"
                    : ""
                }`}
              >
                <MdDashboard className="text-2xl" />
                Dashboard
              </Link>
              <Link
                to="/company/hrleaves"
                className={`flex items-center gap-x-3 py-2 px-4 text-white hover:bg-blue-800 rounded-lg ${
                  location.pathname === "/company/hrleaves" ? "bg-blue-800" : ""
                }`}
              >
                <SlCalender className="text-2xl" />
                Leaves
              </Link>
              <Link
                to="/admin/plan-pricing"
                className={`flex items-center gap-x-3 py-2 px-4 text-white hover:bg-blue-800 rounded-lg ${
                  location.pathname === "/admin/plan-pricing"
                    ? "bg-blue-800"
                    : ""
                }`}
              >
                <FaTasks className="text-2xl" />
                Task
              </Link>
            </nav>
          </div>
        </aside>
      </div>
    </>
  );
};

export default HRNav;
