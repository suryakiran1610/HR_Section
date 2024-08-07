import React, { useContext, useEffect, useState } from "react";
import MakeApiRequest from "../../../Functions/AxiosApi";
import HRNav from "../../../components/HR/HR-Navbar/HRNav";
import HRSidebar from "../../../components/HR/HR-Sidebar/HRSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import { useParams } from "react-router-dom";
import config from "../../../Functions/config";
import { Link, useLocation, useNavigate } from "react-router-dom";


function ViewEmployee() {
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [task, setTask] = useState([]);
  const [isTaskModel, setIsTaskModel] = useState(false);
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);
  const [limit, setLimit] = useState(5);
  const [buttonstatus, setButtonstatus] = useState(true);



  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const handleViewTaskDetails = (TaskId) => {
    navigate(`/company/viewtaskdetails/${TaskId}`);
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
  }, [id]);

  useEffect(() => {
    const params = { 
      user_id: id,
      limit: limit,
      startIndex: startIndex
    };
    MakeApiRequest(
      "get",
      `${config.baseUrl}hr/employeeassignedtask/`,
      {},
      params,
      {}
    )
      .then((response) => {
        console.log("employee_assigned_task", response);
        
        if (response.length > 0) {
          if (response[0].task_created_on) {
            setIsTaskModel(true);
          } else {
            setIsTaskModel(false);
          }
          setTask(response);
        }
        if (response.length < 5) {
          setButtonstatus(false);
        } else {
          setButtonstatus(true);
        }
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
  }, [limit, startIndex]);

  const handleLoadMore = () => {
    setStartIndex(startIndex + limit);
  };

  const handleLoadPrevious = () => {
    setStartIndex(Math.max(0, startIndex - limit));
  };

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
                      <span className="cursor-pointer py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-500/10 dark:text-yellow-500">
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

            <div className="max-w-[85rem] px-4 py-11 sm:px-6 lg:px-8 lg:py-5 mx-auto">
              <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                  <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="bg-[rgb(16,23,42)] border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                        {isTaskModel ? (
                          <h2 className="text-xl font-semibold text-white dark:text-neutral-200">
                            Created Task
                          </h2>
                        ) : (
                          <h2 className="text-xl font-semibold text-white dark:text-neutral-200">
                            Assigned Task
                          </h2>
                        )}
                      </div>

                      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                        <thead className="bg-[rgb(16,23,42)] dark:bg-neutral-800">
                          <tr>
                            {isTaskModel ? (
                              <>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2 ml-1">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                      Task ID
                                    </span>
                                  </div>
                                </th>

                                <th
                                  scope="col"
                                  className="px-6 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2 ml-24">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                      Task Name
                                    </span>
                                  </div>
                                </th>

                                <th
                                  scope="col"
                                  className="px-7 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2 ml-4">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                      Createdon
                                    </span>
                                  </div>
                                </th>

                                <th
                                  scope="col"
                                  className="px-6 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2 ml-1">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                      Details
                                    </span>
                                  </div>
                                </th>
                              </>
                            ) : (
                              <>
                                <th
                                  scope="col"
                                  className="px-7 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2 ml-1">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                      Task ID
                                    </span>
                                  </div>
                                </th>

                                <th
                                  scope="col"
                                  className="px-6 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2 ml-1">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                      Task Name
                                    </span>
                                  </div>
                                </th>

                                <th
                                  scope="col"
                                  className="px-7 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2 ml-1">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                      CreatedBy
                                    </span>
                                  </div>
                                </th>

                                <th
                                  scope="col"
                                  className="px-7 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2 ml-1">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                      Createdon
                                    </span>
                                  </div>
                                </th>

                                <th
                                  scope="col"
                                  className="px-4 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2 ml-1">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                      AssignedOn
                                    </span>
                                  </div>
                                </th>

                                <th
                                  scope="col"
                                  className="px-4 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2 ml-7">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                      Status
                                    </span>
                                  </div>
                                </th>

                                <th
                                  scope="col"
                                  className="px-6 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2 ml-1">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                      Details
                                    </span>
                                  </div>
                                </th>
                              </>
                            )}
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                          {task.map((task, index) => (
                            <tr key={index}>
                              {isTaskModel ? (
                                <>
                                  <td className="size-px whitespace-nowrap">
                                    <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 ml-9">
                                      <div className="flex items-center gap-x-3">
                                        <div className="grow">
                                          <span className="block text-sm font-semibold text-white dark:text-neutral-200">
                                            {task.task_id}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="size-px whitespace-nowrap">
                                    <div className="px-7 py-3 ml-16">
                                      <span className="block text-sm font-semibold text-white dark:text-neutral-200">
                                        {task.task_name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="size-px whitespace-nowrap">
                                    <div className="px-7 py-3 ml-3">
                                      <span className="block text-sm font-semibold text-white dark:text-neutral-200">
                                        {task.task_created_on}
                                      </span>
                                    </div>
                                  </td>

                                  <td className="size-px whitespace-nowrap">
                                    <div className="px-4 py-3 ml-6">
                                      <a
                                        onClick={() =>
                                            handleViewTaskDetails(task.id)
                                        }
                                        className="text-sm text-blue-600 dark:text-neutral-500 cursor-pointer hover:text-blue-800"
                                      >
                                        View
                                      </a>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="size-px whitespace-nowrap">
                                    <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 ml-9">
                                      <div className="flex items-center gap-x-3">
                                        <div className="grow">
                                          <span className="block text-sm font-semibold text-white dark:text-neutral-200">
                                            {task.task?.task_id}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="size-px whitespace-nowrap">
                                    <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 ml-5">
                                      <div className="flex items-center gap-x-3">
                                        <div className="grow">
                                          <span className="block text-sm font-semibold text-white dark:text-neutral-200">
                                            {task.task?.task_name}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="size-px whitespace-nowrap">
                                    <div className="px-7 py-3 ml-3">
                                      <span className="block text-sm font-semibold text-white dark:text-neutral-200">
                                        {task.task?.employee?.name}
                                      </span>
                                    </div>
                                  </td>

                                  <td className="size-px whitespace-nowrap">
                                    <div className="px-4 py-3 ml-1">
                                      <span className="block text-sm font-semibold text-white dark:text-neutral-200">
                                        {task.task?.task_created_on}
                                      </span>
                                    </div>
                                  </td>

                                  <td className="size-px whitespace-nowrap">
                                    <div className="px-4 py-3 ml-1">
                                      <span className="block text-sm font-semibold text-white dark:text-neutral-200">
                                        {task.task_assign_date}
                                      </span>
                                    </div>
                                  </td>

                                  <td className="size-px whitespace-nowrap">
                                    <div className="px-4 py-3 ml-1">
                                      <span className="block text-sm font-semibold text-white dark:text-neutral-200">
                                        {task.task_status === "completed" ? (
                                          <span class="bg-green-100 ml-2 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                            completed
                                          </span>
                                        ) : task.task_status ===
                                          "in progress" ? (
                                          <span class="bg-blue-100 ml-2 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                            in progress
                                          </span>
                                        ) : task.task_status ===
                                          "not started" ? (
                                          <span class="bg-yellow-100 ml-2 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                                            not started
                                          </span>
                                        ) : (
                                          null()
                                        )}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="size-px whitespace-nowrap">
                                    <div className="px-4 py-3 ml-4">
                                      <a
                                        onClick={() =>
                                            handleViewTaskDetails(task.task_id)
                                        }
                                        className="text-sm text-blue-600 dark:text-neutral-500 cursor-pointer hover:text-blue-800"
                                      >
                                        View
                                      </a>
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                        <div>
                          <p className="text-sm text-white dark:text-neutral-400">
                            <span className="font-semibold text-white dark:text-neutral-200">
                              {task.length}
                            </span>{" "}
                            results
                          </p>
                        </div>

                        <div>
                          <div className="inline-flex gap-x-2">
                            <button
                              type="button"
                              disabled={startIndex === 0}
                              onClick={handleLoadPrevious}
                              className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-[rgb(16,23,42)] text-white shadow-sm hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                            >
                              <svg
                                className="flex-shrink-0 size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m15 18-6-6 6-6" />
                              </svg>
                              Prev
                            </button>

                            <button
                              type="button"
                              disabled={!buttonstatus}
                              onClick={handleLoadMore}
                              className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-[rgb(16,23,42)] hover:bg-gray-800 text-white shadow-sm  disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                            >
                              Next
                              <svg
                                className="flex-shrink-0 size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m9 18 6-6-6-6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
