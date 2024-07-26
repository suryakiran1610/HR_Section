import React, { useContext, useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import MakeApiRequest from "../../../Functions/AxiosApi";
import config from "../../../Functions/config";
import HRNav from "../../../components/HR/HR-Navbar/HRNav";
import HRSidebar from "../../../components/HR/HR-Sidebar/HRSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import { Link } from "react-router-dom";
import ProfileContext from "../../../context/ProfileContext";

function HRProfile() {
  const { profile, setProfile } = useContext(ProfileContext);
  const [togglepasswordmodal, setTogglepasswordmodal] = useState(false);
  const token = Cookies.get("token");
  const [isloading, setIsloading] = useState(false);
  const [message, setMessage] = useState("");
  const [message1, setMessage1] = useState("");
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [errors1, setErrors1] = useState({});
  const fileInputRef = useRef(null);
  const [initialprofiledetails, setInitialprofiledetails] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const [editedprofile, setEditedprofile] = useState({
    profileimage: "",
    name: "",
    email: "",
    username: "",
    address: "",
    phone: "",
  });

  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const [changepassword, setChangepassword] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  });

  useEffect(() => {
    MakeApiRequest("get", `${config.baseUrl}hr/createemployee/`, {}, {}, {})
      .then((response) => {
        console.log("allemployee", response);
        setUsers(response);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
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
        setInitialprofiledetails(response);
        setEditedprofile(profile);
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

  function Handleprofiledetails(e) {
    const { name, value, type, files } = e.target;

    // Update editedprofile state based on input type
    if (type === "file") {
      setEditedprofile((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setEditedprofile((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

       // Reset specific error for the field being updated
       setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  
    const validateEmail = (email) => {
        let error = "";
        if (!email) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
          error = "Invalid email address";
        } else if (users.some((user) => user.email === email)) {
          error = "Email already exists";
        }
        setErrors((prev) => ({ ...prev, email: error }));
        return !error;
      };
    
      const validateUsername = (username) => {
        let error = "";
        if (!username) {
          error = "Username is required";
        } else if (users.some((user) => user.username === username)) {
          error = "Username already exists";
        }
        setErrors((prev) => ({ ...prev, username: error }));
        return !error;
      };
    
      const validatePhone = (phone) => {
        let error = "";
        if (!phone) {
          error = "Phone is required";
        } else if (!/^\d{10}$/.test(phone)) {
          error = "Phone number must be 10 digits";
        }
        setErrors((prev) => ({ ...prev, phone: error }));
        return !error;
      };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isProfileChanged = Object.keys(editedprofile).some((key) => {
      if (key === "profileimage") {
        return editedprofile[key] instanceof File;
      }
      return editedprofile[key] !== initialprofiledetails[key];
    });

    if (!isProfileChanged) {
      setMessage("No changes detected");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }

    const emailValid = validateEmail(editedprofile.email);
    const usernameValid = validateUsername(editedprofile.username);
    const phoneValid = validatePhone(editedprofile.phone);

    if (!emailValid || !usernameValid || !phoneValid) {
      setMessage("Please fix the errors before submitting");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }

    const params = {
      user_id: "8",
    };

    const formData = new FormData();
    for (let key in editedprofile) {
      if (editedprofile[key]) {
        if (key === "profileimage") {
          if (editedprofile[key] instanceof File) {
            formData.append(key, editedprofile[key]);
          }
        } else {
          formData.append(key, editedprofile[key]);
        }
      }
    }
    if (isProfileChanged) {
      MakeApiRequest(
        "put",
        `${config.baseUrl}hr/employeeprofile/`,
        {},
        params,
        formData
      )
        .then((response) => {
          console.log("updaated", response);
          setMessage("Profile Updated successfully");
          setProfile(response);
          setInitialprofiledetails(response);
          setEditedprofile(response);
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the file input
          }
          setTimeout(() => {
            setMessage("");
          }, 2000);
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
    }
  };

  const handlepasswordeditmodal = () => {
    setTogglepasswordmodal(true);
    setMessage1("");
    setErrors("");
  };

  const handleclosemodal = () => {
    setTogglepasswordmodal(false);
    setMessage1("");
    setErrors("");
  };

  function Handlepassword(e) {
    const { name, value } = e.target;
    setChangepassword((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  useEffect(() => {
    if (changepassword.newpassword !== changepassword.confirmpassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }

  }, [changepassword]);

  const isPasswordFormValid =
    changepassword.oldpassword &&
    changepassword.newpassword &&
    changepassword.confirmpassword &&
    passwordError === "";

  const handleSubmitpassword = (e) => {
    e.preventDefault();

    console.log(token);
    const params = {
      userid: "8",
    };

    const formData = new FormData();
    for (let key in changepassword) {
      formData.append(key, changepassword[key]);
    }

    MakeApiRequest(
      "put",
      `${config.baseUrl}hr/passwordchange/`,
      {},
      params,
      formData
    )
      .then((response) => {
        console.log(response);
        setMessage1("Password Updated successfully");
        setChangepassword({
          oldpassword: "",
          newpassword: "",
          confirmpassword: "",
        });
        setTimeout(() => {
          setTogglepasswordmodal(false);
          setMessage1("");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.status === 400) {
          if (error.response.data.error === "Old password is incorrect") {
            setMessage1("Old password is incorrect");
          }
        } else if (error.response && error.response.status === 401) {
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
              <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
                <div className="bg-[rgb(16,23,42)] rounded-xl shadow p-4 sm:p-7 dark:bg-neutral-800 border border-white">
                  <div className="mb-8">
                    <div className="flex justify-between">
                      <h2 className="text-xl font-bold text-white dark:text-neutral-200">
                        HR Profile
                      </h2>
                      <button
                        onClick={handlepasswordeditmodal}
                        className="px-2 py-2  bg-[rgb(16,23,42)] text-white hover:bg-gray-800 rounded-md border border-gray-700"
                      >
                        Update Password
                      </button>
                    </div>
                    <p className="text-sm text-white mt-2 dark:text-neutral-400">
                      Manage your name, password and account settings.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
                      <div className="sm:col-span-3">
                        <label className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200">
                          Profile photo
                        </label>
                      </div>

                      <div className="sm:col-span-9">
                        <div className="flex items-center gap-5 text-xs text-white">
                          <img
                            className="inline-block size-16 rounded-full  dark:ring-neutral-900"
                            src={`${config.imagebaseurl}${profile.profileimage}`}
                            alt={profile.companyname}
                          />
                          <input
                            onChange={Handleprofiledetails}
                            name="profileimage"
                            type="file"
                            ref={fileInputRef}
                            className="rounded-lg ml-4  bg-[rgb(16,23,42)]  border border-gray-700"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="af-account-full-name"
                          className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                        >
                          Name
                        </label>
                        <div className="hs-tooltip inline-block"></div>
                      </div>

                      <div className="sm:col-span-9">
                        <div className="sm:flex">
                          <input
                            onChange={Handleprofiledetails}
                            name="name"
                            defaultValue={profile.name}
                            type="text"
                            className="py-2 px-3 pe-11 block w-full  text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200">
                          Email
                        </label>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={Handleprofiledetails}
                          name="email"
                          defaultValue={profile.email}
                          type="text"
                          className="py-2 px-3 pe-11 block w-full  text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                        {errors.email && (
                          <span className="text-red-500 text-xs">
                            {errors.email}
                          </span>
                        )}
                      </div>
                      <div className="sm:col-span-3">
                        <div className="inline-block">
                          <label
                            htmlFor="af-account-phone"
                            className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                          >
                            UserName
                          </label>
                        </div>
                      </div>

                      <div className="sm:col-span-9">
                        <input
                          onChange={Handleprofiledetails}
                          name="username"
                          defaultValue={profile.username}
                          type="text"
                          className="py-2 px-3 pe-11 block w-full  text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                        {errors.username && (
                          <span className="text-red-500 text-xs">
                            {errors.username}
                          </span>
                        )}
                      </div>
                      <div className="sm:col-span-3">
                        <label className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200">
                          Address
                        </label>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={Handleprofiledetails}
                          name="address"
                          defaultValue={profile.address}
                          type="text"
                          className="py-2 px-3 pe-11 block w-full  text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <div className="inline-block">
                          <label
                            htmlFor="af-account-phone"
                            className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                          >
                            Phone
                          </label>
                        </div>
                      </div>

                      <div className="sm:col-span-9">
                        <input
                          onChange={Handleprofiledetails}
                          name="phone"
                          defaultValue={profile.phone}
                          type="text"
                          className="py-2 px-3 pe-11 block w-full text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                        {errors.phone && (
                          <span className="text-red-500 text-xs">
                            {errors.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-5 mb-2 flex justify-end gap-x-2">
                      <button
                        type="submit"
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Save changes
                      </button>
                    </div>
                  </form>
                  {message &&
                    (message === "No changes detected" ? (
                      <div
                        className="mt-2 bg-yellow-100 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500"
                        role="alert"
                      >
                        <span className="font-bold">Warning:</span> No changes
                        detected. You should check in on some of those fields.
                      </div>
                    ) : (
                      <div
                        className="mt-2 bg-teal-100 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500"
                        role="alert"
                      >
                        <span className="font-bold">Success:</span> Profile
                        updated successfully.
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {togglepasswordmodal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4 ">
                <div
                  className="bg-black bg-opacity-70 absolute inset-0"
                  onClick={handleclosemodal}
                ></div>
                <div className="relative  bg-[rgba(38,40,61,255)]  rounded-lg shadow-lg w-full max-w-md mx-auto p-6 z-60 lg:left-20">
                  <div className="flex justify-between items-center pb-3 ">
                    <h3 className="font-bold text-white">Edit Password</h3>
                    <button
                      onClick={handleclosemodal}
                      type="button"
                      className="text-white hover:bg-gray-100 hover:text-gray-800 rounded-full p-1"
                    >
                      <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <form
                    onSubmit={handleSubmitpassword}
                    className="space-y-4 mt-4"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Old Password
                      </label>
                      <input
                        onChange={Handlepassword}
                        name="oldpassword"
                        type="password"
                        className="py-2 px-3 block w-full  bg-[rgba(38,40,61,255)] border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        New Password
                      </label>
                      <input
                        onChange={Handlepassword}
                        name="newpassword"
                        type="password"
                        className="py-2 px-3 block w-full  bg-[rgba(38,40,61,255)]  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors1 && (
                        <span className="text-red-500 text-xs">{errors1}</span>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Confirm Password
                      </label>
                      <input
                        onChange={Handlepassword}
                        name="confirmpassword"
                        type="password"
                        className="py-2 px-3 block w-full  bg-[rgba(38,40,61,255)] border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    {passwordError && (
                      <div className="text-red-500 text-sm">
                        {passwordError}
                      </div>
                    )}
                    <div className="flex justify-end gap-x-2 pt-4">
                      <button
                        onClick={handleclosemodal}
                        type="button"
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg  bg-white text-gray-800 shadow-sm hover:bg-red-600"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className={`py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent ${
                          isPasswordFormValid
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-600 text-white"
                        }`}
                        disabled={!isPasswordFormValid}
                      >
                        Save changes
                      </button>
                    </div>
                    {message1 &&
                      (message1 === "Password Updated successfully" ? (
                        <div
                          className="mt-2 bg-teal-100 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500"
                          role="alert"
                        >
                          <span className="font-bold">Success:</span> Password
                          updated successfully.
                        </div>
                      ) : message1 === "Old password is incorrect" ? (
                        <div
                          className="mt-2 bg-yellow-100 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500"
                          role="alert"
                        >
                          <span className="font-bold">Warning:</span> Old
                          Password is Incorrect.
                        </div>
                      ) : null)}
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HRProfile;
