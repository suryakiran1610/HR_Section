import React, { useContext, useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import MakeApiRequest from "../../../Functions/AxiosApi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import config from "../../../Functions/config";
import HRNav from "../../../components/HR/HR-Navbar/HRNav";
import HRSidebar from "../../../components/HR/HR-Sidebar/HRSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";

function AddEmployee() {
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [newprofile, setNewprofile] = useState({
    profileimage: "",
    name: "",
    email: "",
    username: "",
    address: "",
    phone: "",
    position: "",
    department: "",
    employeeid: "",
    status: "",
    password: "",
  });

  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  useEffect(() => {
    MakeApiRequest("get", `${config.baseUrl}hr/allemployees/`, {}, {}, {})
      .then((response) => {
        console.log("allusers",response)
        setUsers(response);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let newErrors = { ...errors };

    if (name === "profileimage") {
      if (files.length > 0) {
        const file = files[0];
        if (!file.type.startsWith("image/")) {
          newErrors.profileimage = "File must be an image.";
        } else {
          setNewprofile({ ...newprofile, profileimage: file });
          setProfileImagePreview(URL.createObjectURL(file));
          delete newErrors.profileimage;
        }
      } else {
        newErrors.profileimage = "Profile image is required.";
      }
    } else {
      setNewprofile({ ...newprofile, [name]: value });
    }

    switch (name) {
      case "email":
        if (!validateEmail(value)) {
          newErrors.email = "Invalid email format";
        }else if (!value) {
            newErrors.email = "Email is required";
        }else if (users.some((user) => user.email === value)) {
          newErrors.email = "Email already exists";
        } else {
          delete newErrors.email;
        }
        break;
      case "phone":
        if (value.length !== 10 || isNaN(value)) {
          newErrors.phone = "Phone number must be 10 digits";
        } else if (!value) {
            newErrors.phone = "phone is required";
        }else {
          delete newErrors.phone;
        }
        break;
      case "username":
        if (users.some((user) => user.username === value)) {
          newErrors.username = "Username already exists";
        } else if (!value) {
            newErrors.username = "Username is required";
        }else {
          delete newErrors.username;
        }
        break;
      case "employeeid":
        if (users.some((user) => user.employeeid === value)) {
          newErrors.employeeid = "Employee ID already exists";
        } else if (!value) {
            newErrors.employeeid = "Employeeid is required";
        }else {
          delete newErrors.employeeid;
        }
        break;
      case "password":
        if (!value) {
            newErrors.password = "Password is required";
        }else {
            delete newErrors.password;
          } 
        if (value.length < 8) {
          newErrors.Length = "Password must be at least 8 characters.";
        } else {
          delete newErrors.Length;
        }

        if (!/[0-9]/.test(value)) {
          newErrors.number = "Password must include at least one number.";
        } else {
          delete newErrors.number;
        }

        if (!/[!@#$%^&*]/.test(value)) {
          newErrors.symbol = "Password must include at least one special character.";
        } else {
          delete newErrors.symbol;
        }

        if (value !== newprofile.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case "confirmPassword":
        if (value !== newprofile.password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case "profileimage":
        if (e.target.files.length > 0) {
          const file = e.target.files[0];
          setNewprofile({ ...newprofile, profileimage: file });
          setProfileImagePreview(URL.createObjectURL(file));
        }
        break;
      default:
        if (!value.trim()) {
          newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        } else {
          delete newErrors[name];
        }
        break;
    }
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let finalErrors = { ...errors };
    Object.keys(newprofile).forEach((key) => {
      if (!newprofile[key] && key !== "profileimage") {
        finalErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });

    if (!newprofile.profileimage) {
        finalErrors.profileimage = "Profile image is required.";
      }

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      setMessage("Validation failed");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }

    const formData = new FormData();
    for (let key in newprofile) {
      if (newprofile[key]) {
        formData.append(key, newprofile[key]);
      }
    }

    MakeApiRequest("post", `${config.baseUrl}hr/createemployee/`, {}, {}, formData)
      .then((response) => {
        setMessage("Employee Added successfully");
        setNewprofile({
          profileimage: "",
          name: "",
          email: "",
          username: "",
          address: "",
          phone: "",
          position: "",
          department: "",
          employeeid: "",
          status: "",
          password: "",
          confirmPassword: "",
        });
        setProfileImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setTimeout(() => {
          setMessage("");
          navigate("/company/employees");
        }, 2500);
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized access. Token might be expired or invalid.");
        } else {
          console.error("Unexpected error occurred:", error);
        }
      });
  };

  return (
    <>
      <div className="bg-[rgb(16,23,42)]">
        <HRNav />
        <div className="flex min-h-screen pt-20">
          <div className="w-fit md:fixed top-20 left-0 min-h-screen bottom-0 md:block hidden z-40">
            <HRSidebar sidebarToggle={sidebarToggle} />
          </div>

          <div className={`flex-1 min-h-screen overflow-auto transition-all duration-300 ${isSidebarCollapsed ? "md:ml-64 ml-0" : "md:ml-20 ml-0 md:px-16"}`}>
          <div className="w-full min-h-screen sm:px-2 lg:px-8 lg:py-7 mx-auto">
              <div className="max-w-4xl px-3 py-10 sm:px-6 lg:px-8 mx-auto">
                <div className="bg-[rgb(16,23,42)] rounded-xl shadow p-4 sm:p-7 dark:bg-neutral-800 border border-white">
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className=" rounded-xl shadow dark:bg-neutral-900 mb-5">
                      <div className="h-44 w-44 rounded-xl bg-[rgba(41,39,63,255)] bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${profileImagePreview})` }}></div>
                    </div>

                    <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="employeeid"
                          className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                        >
                          Profile Image
                        </label>
                      </div>
                      <div className="sm:col-span-9 flex flex-col">
                        <input
                          onChange={handleChange}
                          name="profileimage"
                          type="file"
                          ref={fileInputRef}
                          className="rounded-lg  bg-[rgb(16,23,42)] border"
                        />
                        {errors.profileimage && (
                          <span className="text-red-500 text-xs">
                            {errors.profileimage}
                          </span>
                        )}
                      </div>
                      {/* Employee ID */}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="employeeid"
                          className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                        >
                          ID
                        </label>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={handleChange}
                          name="employeeid"
                          value={newprofile.employeeid}
                          type="text"
                          className="py-2 px-3 block w-full text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                        />
                        {errors.employeeid && (
                          <span className="text-red-500 text-xs">
                            {errors.employeeid}
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="name"
                          className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                        >
                          Name
                        </label>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={handleChange}
                          name="name"
                          value={newprofile.name}
                          type="text"
                          className="py-2 px-3 block w-full text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                        />
                        {errors.name && (
                          <span className="text-red-500 text-xs">
                            {errors.name}
                          </span>
                        )}
                      </div>

                      {/* Email */}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="email"
                          className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                        >
                          Email
                        </label>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={handleChange}
                          name="email"
                          value={newprofile.email}
                          type="email"
                          className="py-2 px-3 block w-full text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                        />
                        {errors.email && (
                          <span className="text-red-500 text-xs">
                            {errors.email}
                          </span>
                        )}
                      </div>

                      {/* Username */}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="username"
                          className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                        >
                          Username
                        </label>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={handleChange}
                          name="username"
                          value={newprofile.username}
                          type="text"
                          className="py-2 px-3 block w-full text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                        />
                        {errors.username && (
                          <span className="text-red-500 text-xs">
                            {errors.username}
                          </span>
                        )}
                      </div>

                      {/* Address */}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="address"
                          className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                        >
                          Address
                        </label>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={handleChange}
                          name="address"
                          value={newprofile.address}
                          type="text"
                          className="py-2 px-3 block w-full text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                        />
                        {errors.address && (
                          <span className="text-red-500 text-xs">
                            {errors.address}
                          </span>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="phone"
                          className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                        >
                          Phone
                        </label>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={handleChange}
                          name="phone"
                          value={newprofile.phone}
                          type="text"
                          className="py-2 px-3 block w-full text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                        />
                        {errors.phone && (
                          <span className="text-red-500 text-xs">
                            {errors.phone}
                          </span>
                        )}
                      </div>

                      {/* Position */}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="position"
                          className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                        >
                          Position
                        </label>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={handleChange}
                          name="position"
                          value={newprofile.position}
                          type="text"
                          className="py-2 px-3 block w-full text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                        />
                        {errors.position && (
                          <span className="text-red-500 text-xs">
                            {errors.position}
                          </span>
                        )}
                      </div>

                      {/* Department */}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="department"
                          className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                        >
                          Department
                        </label>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={handleChange}
                          name="department"
                          value={newprofile.department}
                          type="text"
                          className="py-2 px-3 block w-full text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                        />
                        {errors.department && (
                          <span className="text-red-500 text-xs">
                            {errors.department}
                          </span>
                        )}
                      </div>

                      {/* Status */}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="status"
                          className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                        >
                          Status
                        </label>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={handleChange}
                          name="status"
                          value={newprofile.status}
                          type="text"
                          className="py-2 px-3 block w-full text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                        />
                        {errors.status && (
                          <span className="text-red-500 text-xs">
                            {errors.status}
                          </span>
                        )}
                      </div>

                      {/* Password */}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="password"
                          className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                        >
                          Password
                        </label>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={handleChange}
                          name="password"
                          value={newprofile.password}
                          type="password"
                          className="py-2 px-3 block w-full text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                        />
                        {errors.password && (
                          <span className="text-red-500 text-xs">
                            {errors.password}
                          </span>
                        )}
                        <div className="flex flex-col flex-wrap">
                        {errors.Length && (
                          <span className="text-red-500 text-xs">
                            {errors.Length}
                          </span>
                        )}
                        {errors.number && (
                          <span className="text-red-500 text-xs">
                            {errors.number}
                          </span>
                        )}
                        {errors.symbol && (
                          <span className="text-red-500 text-xs">
                            {errors.symbol}
                          </span>
                        )}
                      </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="confirmPassword"
                          className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                        >
                          Confirm Password
                        </label>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={handleChange}
                          name="confirmPassword"
                          value={newprofile.confirmPassword}
                          type="password"
                          className="py-2 px-3 block w-full text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                        />
                        {errors.confirmPassword && (
                          <span className="text-red-500 text-xs">
                            {errors.confirmPassword}
                          </span>
                        )}
                      </div>

                      <div className="sm:col-span-12 flex justify-end mt-4">
                        <button
                          type="submit"
                          className="py-3 px-4 ml-auto inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
                        >
                          Add Employee
                        </button>
                      </div>
                    </div>
                  </form>
                  {message &&
                    ( message ===
                      "Validation failed" ? (
                      <div
                        className="mt-2 bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-4 dark:bg-red-800/10 dark:border-red-900 dark:text-red-500"
                        role="alert"
                      >
                        <span className="font-bold">Error:</span> Validation
                        failed. Please correct the errors and try again.
                      </div>
                    ) : (
                      <div
                        className="mt-2 bg-teal-100 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500"
                        role="alert"
                      >
                        <span className="font-bold">Success:</span> Employee
                        Added successfully.
                      </div>
                    ))}
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddEmployee;
