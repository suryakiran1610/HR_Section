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
        console.log("profile", response.data);
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

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
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
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row">
              {/* Left Section - Profile Image and Basic Info */}
              <div className="flex flex-col items-center md:items-start md:w-1/3 p-4">
                <img
                  src={profile.profileimage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mb-4"
                />
                <h2 className="text-2xl font-semibold">{profile.name}</h2>
                <p className="text-gray-600">{profile.position}</p>
                <p className="text-gray-600">{profile.department}</p>
                <div className="mt-4 flex space-x-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Follow
                  </button>
                  <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded">
                    Message
                  </button>
                </div>
              </div>

              {/* Right Section - Profile Details */}
              <div className="flex flex-col md:w-2/3 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">Full Name</h3>
                    <p>{profile.name}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Email</h3>
                    <p>{profile.email}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Phone</h3>
                    <p>{profile.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Mobile</h3>
                    <p>{profile.mobile}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Address</h3>
                    <p>{profile.address}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-blue-500">Project Status</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Project Status - Left Column */}
                    <div>
                      <div className="flex justify-between">
                        <span>Web Design</span>
                        <span>80%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: "80%" }}
                        ></div>
                      </div>
                      <div className="flex justify-between">
                        <span>Website Markup</span>
                        <span>60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                      <div className="flex justify-between">
                        <span>One Page</span>
                        <span>90%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: "90%" }}
                        ></div>
                      </div>
                    </div>

                    {/* Project Status - Right Column */}
                    <div>
                      <div className="flex justify-between">
                        <span>Mobile Template</span>
                        <span>50%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: "50%" }}
                        ></div>
                      </div>
                      <div className="flex justify-between">
                        <span>Backend API</span>
                        <span>70%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: "70%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Contact Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">Website</h4>
                      <p>{profile.website}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Github</h4>
                      <p>{profile.github}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Twitter</h4>
                      <p>{profile.twitter}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Instagram</h4>
                      <p>{profile.instagram}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Facebook</h4>
                      <p>{profile.facebook}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewEmployee;
