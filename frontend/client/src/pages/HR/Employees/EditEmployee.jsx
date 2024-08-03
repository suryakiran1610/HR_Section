import React, { useContext, useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import MakeApiRequest from "../../../Functions/AxiosApi";
import config from "../../../Functions/config";
import HRNav from "../../../components/HR/HR-Navbar/HRNav";
import HRSidebar from "../../../components/HR/HR-Sidebar/HRSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import { useParams } from "react-router-dom";

function EditEmployee() {
  const [profile, setProfile] = useState("");
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [initialprofiledetails, setInitialprofiledetails] = useState({});
  const [editedprofile, setEditedprofile] = useState({
    profileimage: "",
    name: "",
    email: "",
    address: "",
    phone: "",
    position: "",
    department: "",
    employeeid: "",
    status: "",
  });

  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

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
      user_id: id,
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

  const validateEmployeeid = (employeeid) => {
    let error = "";
    if (!employeeid) {
      error = "ID is required";
    } else if (users.some((user) => user.employeeid === employeeid)) {
      error = "ID already exists";
    }
    setErrors((prev) => ({ ...prev, employeeid: error }));
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

  const validateName = (name) => {
    let error = "";
    if (!name) {
      error = "Name is required";
    }
    setErrors((prev) => ({ ...prev, name: error }));
    return !error;
  };

  const validateProfileimage = (profileimage) => {
    let error = "";
    if (!profileimage) {
      error = "Profileimage is required";
    }
    setErrors((prev) => ({ ...prev, profileimage: error }));
    return !error;
  };

  const validateDepartment = (department) => {
    let error = "";
    if (!department) {
      error = "Department is required";
    }
    setErrors((prev) => ({ ...prev, department: error }));
    return !error;
  };

  const validateAddress = (address) => {
    let error = "";
    if (!address) {
      error = "Address is required";
    }
    setErrors((prev) => ({ ...prev, address: error }));
    return !error;
  };

  const validatePosition = (position) => {
    let error = "";
    if (!position) {
      error = "Position is required";
    }
    setErrors((prev) => ({ ...prev, position: error }));
    return !error;
  };

  const validateStatus = (status) => {
    let error = "";
    if (!status) {
      error = "Status is required";
    }
    setErrors((prev) => ({ ...prev, status: error }));
    return !error;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

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

    // Live validation based on field name
    if (name === "email") {
      validateEmail(value);
    }
    if (name === "phone") {
      validatePhone(value);
    }
    if (name === "employeeid") {
      validateEmployeeid(value);
    }
    if (name === "name") {
      validateName(value);
    }
    if (name === "profileimage") {
      validateProfileimage(value);
    }
    if (name === "department") {
      validateDepartment(value);
    }
    if (name === "address") {
      validateAddress(value);
    }
    if (name === "position") {
      validatePosition(value);
    }
    if (name === "status") {
      validateStatus(value);
    }
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

    let emailValid = true;
    let phoneValid = true;
    let IDValid = true;
    let ProfileimageValid = true;
    let PositionValid = true;
    let DepartmentValid = true;
    let StatusValid = true;
    let AddressValid = true;
    let Namevalid = true;

    // Validate only changed fields
    if (
      editedprofile.email &&
      editedprofile.email !== initialprofiledetails.email
    ) {
      console.log("Validating email:", editedprofile.email);
      emailValid = validateEmail(editedprofile.email);
    }

    if (
      editedprofile.phone &&
      editedprofile.phone !== initialprofiledetails.phone
    ) {
      console.log("Validating phone:", editedprofile.phone);
      phoneValid = validatePhone(editedprofile.phone);
    }

    if (
      editedprofile.employeeid &&
      editedprofile.employeeid !== initialprofiledetails.employeeid
    ) {
      console.log("Validating ID:", editedprofile.employeeid);
      IDValid = validateEmployeeid(editedprofile.employeeid);
    }
    if (
      editedprofile.name &&
      editedprofile.name !== initialprofiledetails.name
    ) {
      console.log("Validating Name:", editedprofile.name);
      Namevalid = validateName(editedprofile.name);
    }
    if (
      editedprofile.address &&
      editedprofile.address !== initialprofiledetails.address
    ) {
      console.log("Validating Address:", editedprofile.address);
      AddressValid = validateAddress(editedprofile.address);
    }
    if (
      editedprofile.status &&
      editedprofile.status !== initialprofiledetails.status
    ) {
      console.log("Validating Status:", editedprofile.status);
      StatusValid = validateStatus(editedprofile.status);
    }
    if (
      editedprofile.department &&
      editedprofile.department !== initialprofiledetails.department
    ) {
      console.log("Validating Department:", editedprofile.department);
      DepartmentValid = validateDepartment(editedprofile.department);
    }
    if (
      editedprofile.position &&
      editedprofile.position !== initialprofiledetails.position
    ) {
      console.log("Validating Position:", editedprofile.position);
      PositionValid = validatePosition(editedprofile.position);
    }

    if (
      editedprofile.profileimage &&
      editedprofile.profileimage !== initialprofiledetails.profileimage
    ) {
      console.log("Validating Profile Image:", editedprofile.profileimage);
      ProfileimageValid = validateProfileimage(editedprofile.profileimage);
    }

    if (
      !emailValid ||
      !phoneValid ||
      !IDValid ||
      !Namevalid ||
      !PositionValid ||
      !DepartmentValid ||
      !StatusValid ||
      !AddressValid ||
      !ProfileimageValid
    ) {
      console.log("Validation failed:", errors);
      setMessage("Validation failed. Please correct the errors and try again.");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }

    // Check for any errors in the errors state
    if (Object.keys(errors).some((key) => errors[key])) {
      setMessage("Validation failed. Please correct the errors and try again.");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }

    const params = {
      user_id: id,
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
            fileInputRef.current.value = "";
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
            <div className="w-full min-h-screen sm:px-2 lg:px-8 lg:py-7 mx-auto">
              <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
                <div className="bg-[rgb(16,23,42)] rounded-xl shadow p-4 sm:p-7 dark:bg-neutral-800 border border-white">
                  <div className="mb-8">
                    <div className="flex justify-between">
                      <h2 className="text-xl font-bold text-white dark:text-neutral-200">
                        {profile.name}'s Profile
                      </h2>
                    </div>
                    <p className="text-sm text-white mt-2 dark:text-neutral-400">
                      Manage your name, email and account settings.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
                      <div className="sm:col-span-3">
                        <label className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200">
                          Profile photo
                        </label>
                      </div>

                      <div className="sm:col-span-7">
                        <div className="flex items-center  text-xs text-white">
                          <img
                            className="inline-block size-16 rounded-full  dark:ring-neutral-900"
                            src={`${config.imagebaseurl}${profile.profileimage}`}
                            alt={profile.name}
                          />
                          <input
                            onChange={handleChange}
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
                          ID
                        </label>
                        <div className="hs-tooltip inline-block"></div>
                      </div>

                      <div className="sm:col-span-9">
                        <div className="sm:flex">
                          <input
                            onChange={handleChange}
                            name="employeeid"
                            defaultValue={profile.employeeid}
                            type="text"
                            className="py-2 px-3 pe-11 block w-full  text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                          />
                        </div>
                        {errors.employeeid && (
                          <span className="text-red-500 text-xs">
                            {errors.employeeid}
                          </span>
                        )}
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
                            onChange={handleChange}
                            name="name"
                            defaultValue={profile.name}
                            type="text"
                            className="py-2 px-3 pe-11 block w-full  text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                          />
                        </div>
                        {errors.name && (
                          <span className="text-red-500 text-xs">
                            {errors.name}
                          </span>
                        )}
                      </div>

                      <div className="sm:col-span-3">
                        <label className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200">
                          Email
                        </label>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={handleChange}
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
                            Department
                          </label>
                        </div>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={handleChange}
                          name="department"
                          defaultValue={profile.department}
                          type="text"
                          className="py-2 px-3 pe-11 block w-full  text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                        {errors.department && (
                          <span className="text-red-500 text-xs">
                            {errors.department}
                          </span>
                        )}
                      </div>

                      <div className="sm:col-span-3">
                        <div className="inline-block">
                          <label
                            htmlFor="af-account-phone"
                            className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                          >
                            Status
                          </label>
                        </div>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={handleChange}
                          name="status"
                          defaultValue={profile.status}
                          type="text"
                          className="py-2 px-3 pe-11 block w-full  text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                        {errors.status && (
                          <span className="text-red-500 text-xs">
                            {errors.status}
                          </span>
                        )}
                      </div>
                      <div className="sm:col-span-3">
                        <div className="inline-block">
                          <label
                            htmlFor="af-account-phone"
                            className="inline-block text-sm text-white mt-2.5 dark:text-neutral-200"
                          >
                            position
                          </label>
                        </div>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          onChange={handleChange}
                          name="position"
                          defaultValue={profile.position}
                          type="text"
                          className="py-2 px-3 pe-11 block w-full  text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                        {errors.position && (
                          <span className="text-red-500 text-xs">
                            {errors.position}
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
                          onChange={handleChange}
                          name="address"
                          defaultValue={profile.address}
                          type="text"
                          className="py-2 px-3 pe-11 block w-full  text-white bg-[rgb(16,23,42)] border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                        {errors.address && (
                          <span className="text-red-500 text-xs">
                            {errors.address}
                          </span>
                        )}
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
                          onChange={handleChange}
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
                    ) : message ===
                      "Validation failed. Please correct the errors and try again." ? (
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
                        <span className="font-bold">Success:</span> Profile
                        updated successfully.
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

export default EditEmployee;
