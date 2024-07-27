import React, { useContext, useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import MakeApiRequest from "../../../Functions/AxiosApi";
import config from "../../../Functions/config";
import HRNav from "../../../components/HR/HR-Navbar/HRNav";
import HRSidebar from "../../../components/HR/HR-Sidebar/HRSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import { Link } from "react-router-dom";

function HRLeaves() {
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();
  const [toggleleavestatus, setToggleleavestatus] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [leaverequest, setLeaverequest] = useState([]);
  const [showButtons, setShowButtons] = useState(true);
  const [leaveId, setLeaveId] = useState("");

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const handleleavestatusmodal = (leaveId) => {
    setToggleleavestatus(true);
    setLeaveId(leaveId);
  };

  const handleclosemodal = () => {
    setToggleleavestatus(false);
    setShowRejectReason(false);
    setShowButtons(true);
    setRejectionReason("");
  };

  const handleApprove = () => {
    const params = {
      leave_id: leaveId,
    };
    const formData = new FormData();
    formData.append("status", "approved");

    MakeApiRequest(
      "put",
      `${config.baseUrl}hr/approveleave/`,
      {},
      params,
      formData
    )
      .then((response) => {
        console.log(response);
        //   setMessage1("Password Updated successfully");
        setTimeout(() => {
          handleclosemodal();
          // setMessage1("");
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
  };

  const handleReject = () => {
    setShowButtons(false);
    setShowRejectReason(true);
  };

  const handleSubmitRejection = () => {
    const params = {
        leave_id: leaveId,
    };
      const formData = new FormData();
      formData.append("status", "rejected");
      formData.append("rejectionreason", rejectionReason);

      
      MakeApiRequest(
        "put",
        `${config.baseUrl}hr/rejectleave/`,
        {},
        params,
        formData
      )
        .then((response) => {
          console.log(response);
          //   setMessage1("Password Updated successfully");
          setTimeout(() => {
            handleclosemodal();
            // setMessage1("");
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
  };

  useEffect(() => {
    MakeApiRequest("get", `${config.baseUrl}hr/leaverequest/`, {}, {}, {})
      .then((response) => {
        console.log("leaverequests", response);
        setLeaverequest(response);
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
              <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                <div className="flex flex-col">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="bg-[rgb(16,23,42)] border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                          <h2 className="text-xl font-semibold text-white dark:text-neutral-200">
                            Employees
                          </h2>
                        </div>

                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                          <thead className="bg-[rgb(16,23,42)] dark:bg-neutral-800">
                            <tr>
                              <th
                                scope="col"
                                className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                              >
                                <div className="flex items-center gap-x-2 ml-7">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                    Name
                                  </span>
                                </div>
                              </th>

                              <th scope="col" className="px-6 py-3 text-start">
                                <div className="flex items-center gap-x-2 ml-14">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                    Start
                                  </span>
                                </div>
                              </th>

                              <th scope="col" className="px-11 py-3 text-start">
                                <div className="flex items-center gap-x-2">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                    End
                                  </span>
                                </div>
                              </th>

                              <th scope="col" className="px-11 py-3 text-start">
                                <div className="flex items-center gap-x-2 ml-1">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                    Status
                                  </span>
                                </div>
                              </th>

                              <th scope="col" className="px-6 py-3 text-start">
                                <div className="flex items-center gap-x-2 ml-3">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                    Details
                                  </span>
                                </div>
                              </th>

                              <th
                                scope="col"
                                className="px-6 py-3 text-start ml-1"
                              >
                                <div className="flex items-center gap-x-2">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                    Report
                                  </span>
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3 text-end"
                              ></th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                            {leaverequest.map((leave, index) => (
                              <tr key={leave.id}>
                                <td className="size-px whitespace-nowrap">
                                  <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 ml-4">
                                    <div className="flex items-center gap-x-3">
                                      <img
                                        className="inline-block size-[38px] rounded-full"
                                        src={`${config.imagebaseurl}${leave.employee.profileimage}`}
                                        alt={leave.name}
                                      />
                                      <div className="grow">
                                        <span className="block text-sm font-semibold text-white dark:text-neutral-200">
                                          {leave.employee.name}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="h-px whitespace-nowrap">
                                  <div className="px-6 py-3 ml-12">
                                    <span className="block text-sm font-semibold text-white dark:text-neutral-200">
                                      {leave.startdate}
                                    </span>
                                  </div>
                                </td>

                                <td className="size-px whitespace-nowrap">
                                  <div className="px-6 py-3 ml-3">
                                    <span className="block text-sm font-semibold text-white dark:text-neutral-200">
                                      {leave.enddate}
                                    </span>
                                  </div>
                                </td>

                                <td className="size-px whitespace-nowrap">
                                  <div className="px-6 py-3 ml-1">
                                    {leave.status === "approved" ? (
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
                                        Approved
                                      </span>
                                    ) : leave.status === "rejected" ? (
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
                                        Rejected
                                      </span>
                                    ) : (
                                      <span
                                        onClick={() => {
                                          handleleavestatusmodal(leave.id);
                                        }}
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
                                        Pending
                                      </span>
                                    )}
                                  </div>
                                </td>

                                <td className="size-px whitespace-nowrap">
                                  <div className="px-6 py-3 ml-3">
                                    <div className="flex items-center gap-x-3">
                                      <a
                                        //   onClick={() =>
                                        //     handleViewCompany(
                                        //       company.company_user_id
                                        //     )
                                        //   }
                                        className="text-sm text-blue-600 dark:text-neutral-500 cursor-pointer hover:text-blue-800"
                                      >
                                        View
                                      </a>
                                    </div>
                                  </div>
                                </td>
                                <td className="size-px whitespace-nowrap">
                                  <div className="px-3 py-3 ml-1">
                                    <span
                                      // onClick={() =>
                                      //   handledeletemodal(
                                      //     company.company_user_id
                                      //   )
                                      // }
                                      className="text-sm text-red-600 dark:text-neutral-500 cursor-pointer  hover:text-red-800"
                                    >
                                      Download
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                          <div>
                            <p className="text-sm text-white dark:text-neutral-400">
                              <span className="font-semibold text-white dark:text-neutral-200">
                                {leaverequest.length}
                              </span>{" "}
                              results
                            </p>
                          </div>

                          <div>
                            <div className="inline-flex gap-x-2">
                              <button
                                type="button"
                                //   disabled={startIndex === 0}
                                //   onClick={handleLoadPrevious}
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
                                //   disabled={!buttonstatus}
                                //   onClick={handleLoadMore}
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
          </div>

          {toggleleavestatus && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="bg-[rgba(38,40,61,255)] w-11/12 max-w-md p-8 rounded shadow-lg relative">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Leave Status
                </h2>
                <div className="flex justify-end">
                  <button
                    onClick={handleclosemodal}
                    className="text-gray-500 hover:text-gray-700 absolute top-4 right-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-around transition-all duration-300 ease-in-out">
                  {showButtons && (
                    <>
                      <button
                        onClick={handleApprove}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={handleReject}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
                {showRejectReason && (
                  <div className="mt-4 transition-opacity duration-300 ease-in-out opacity-100">
                    <textarea
                      className="w-full h-24 p-2 border border-gray-300 rounded bg-[rgba(38,40,61,255)] text-white placeholder:text-white"
                      placeholder="Enter rejection reason..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleSubmitRejection}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HRLeaves;
