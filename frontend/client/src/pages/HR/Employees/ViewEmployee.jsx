import React, { useContext, useEffect, useState } from "react";
import MakeApiRequest from "../../../Functions/AxiosApi";
import HRNav from "../../../components/HR/HR-Navbar/HRNav";
import HRSidebar from "../../../components/HR/HR-Sidebar/HRSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import { useParams } from "react-router-dom";
import config from "../../../Functions/config";

function ViewEmployee() {
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  useEffect(() => {
    const params = { user_id: id };
    MakeApiRequest(
      "get",
      `${config.baseUrl}hr/employeeprofile/`,
      {},
      params,
      {}
    )
      .then((response) => {
        console.log("profile", response);
        setProfile(response); // Make sure response data is set correctly
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
  }, [id]);

  return (
    <div className="bg-[rgb(16,23,42)]">
      <HRNav />
      <div className="flex min-h-screen pt-20">
        <div className="w-fit md:fixed top-20 left-0 min-h-screen bottom-0 md:block hidden z-40">
          <HRSidebar sidebarToggle={sidebarToggle} />
        </div>
        {!profile ? (
          <div>Loading...</div>
        ) : (
          <div
            className={`flex-1 min-h-screen overflow-auto transition-all duration-300 ${
              isSidebarCollapsed ? "md:ml-64 ml-0" : "md:ml-20 ml-0 md:px-16"
            }`}
          >
            <div className="w-full  px-4 py-7 mx-auto flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 md:space-x-6">
              <div className="bg-[rgba(41,39,63,255)] shadow-md rounded-lg p-6 w-full h-3/4 items-center md:w-1/3 flex flex-col">
                <div className="relative block h-40 w-40 rounded-full overflow-hidden shadow-md">
                  <img
                    src={`http://127.0.0.1:8000${profile.profileimage}`}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-4 font-bold text-xl text-white">
                  {profile.name} (ID:{profile.employeeid})
                </div>
                <div className="text-white mt-2 text-center">
                  {profile.position}
                </div>
              </div>

              {/* Right Section */}
              <div className="bg-[rgba(41,39,63,255)] shadow-md rounded-lg p-6 w-full md:w-2/3 flex flex-col">
                <h2 className="text-xl font-semibold text-white mb-4 text-center">
                  Profile Details
                </h2>
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Full Name:</span>
                    <span className="text-white">{profile.name}</span>
                  </div>
                  <hr></hr>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Department:</span>
                    <span className="text-white">{profile.department}</span>
                  </div>
                  <hr></hr>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Email:</span>
                    <span className="text-white">{profile.email}</span>
                  </div>
                  <hr></hr>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Phone:</span>
                    <span className="text-white">{profile.phone}</span>
                  </div>
                  <hr></hr>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Address:</span>
                    <span className="text-white">{profile.address}</span>
                  </div>
                  <hr></hr>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Status:</span>
                    {profile.status === "active" ? (
                      <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                        <svg
                          className="size-2.5"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                        </svg>
                        Active
                      </span>
                    ) : profile.status === "inactive" ? (
                      <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-500/10 dark:text-red-500">
                        <svg
                          className="size-2.5"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                        </svg>
                        Inactive
                      </span>
                    ) : (
                      <span
                        className="cursor-pointer py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-500/10 dark:text-yellow-500"
                      >
                        <svg
                          className="size-2.5"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                        </svg>
                        Longleave
                      </span>
                    )}
                  </div>
                  <hr></hr>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">
                      Register Date:
                    </span>
                    <span className="text-white">
                      {new Date(profile.register_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewEmployee;
