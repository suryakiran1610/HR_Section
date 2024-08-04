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
                  {profile.name}
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
                    <span className="text-white">{profile.status}</span>
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
