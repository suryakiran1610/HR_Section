import React, { useContext, useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MakeApiRequest from "../../../Functions/AxiosApi";
import config from "../../../Functions/config";
import HRNav from "../../../components/HR/HR-Navbar/HRNav";
import HRSidebar from "../../../components/HR/HR-Sidebar/HRSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import jsPDF from "jspdf";
import { FaCirclePlus } from "react-icons/fa6";
import "jspdf-autotable";
import { FaSearch } from "react-icons/fa";

function ListEmployees() {
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();
  const [toggleleavestatus, setToggleleavestatus] = useState(false);
  const [buttonstatus, setButtonstatus] = useState(true);
  const navigate = useNavigate();
  const [togglemodal, setTogglemodal] = useState(false);
  const [employeeid, setEmployeeid] = useState("");
  const [toggleleavedetails, setToggleleavedetails] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [allemployees, setAllemployees] = useState([]);
  const [leavedetails, setLeavedetails] = useState("");
  const [showButtons, setShowButtons] = useState(true);
  const [leaveId, setLeaveId] = useState("");
  const [message, setMessage] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [limit, setLimit] = useState(5);
  const [employee, setEmployee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const handleAddEmployee = () => {
      navigate("/company/addemployee");
  };

  const handleEditEmployee = (EmployeeId) => {
    navigate(`/company/employeeprofile/${EmployeeId}`);
  };

  const handleViewEmployee = (EmployeeId) => {
    navigate(`/company/viewemployeeprofile/${EmployeeId}`);
  };


  useEffect(() => {
    loademployees();
  }, [limit, startIndex]);

  const loademployees = () => {
    const params = {
      limit: limit,
      startIndex: startIndex,
      employeeinfo: employee,
      start: startDate,
      end: endDate,
    };
    MakeApiRequest("get", `${config.baseUrl}hr/createemployee/`, {}, params, {})
      .then((response) => {
        console.log("allemployees", response);
        setAllemployees(response);
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
  };

  const handleLoadMore = () => {
    setStartIndex(startIndex + limit);
  };

  const handleLoadPrevious = () => {
    setStartIndex(Math.max(0, startIndex - limit));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (employee || startDate || endDate) {
      setStartIndex(0);
      loademployees();
    }
  };

  useEffect(() => {
    if (startDate === "" && endDate === "" && employee === "") {
      loademployees();
    }
  }, [startDate, endDate, employee]);

  const handlereset = (e) => {
    e.preventDefault();
    setEndDate("");
    setStartDate("");
    setEmployee("");
    setStartIndex(0);
    setLimit(5);
  };

  const handledeletemodal = (EmployeeId) => {
    setEmployeeid(EmployeeId);
    setTogglemodal(true);
  };

  const deleteemployee = () => {
    const params = {
      employeeid: employeeid,
    };

    MakeApiRequest(
      "delete",
      `${config.baseUrl}hr/employeeprofile/`,
      {},
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        setMessage("Employee Deleted Successfully");
        setTimeout(() => {
          setAllemployees(allemployees.filter((emp) => emp.id !== employeeid));
          setMessage("");
          setTogglemodal(false);
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

  return (
    <>
      <div className="bg-[rgb(16,23,42)]">
        <HRNav />
        <div className="flex min-h-screen pt-16">
          <div className="w-fit md:fixed top-20 left-0 min-h-screen bottom-0 md:block hidden z-40">
            <HRSidebar sidebarToggle={sidebarToggle} />
          </div>

          <div
            className={`flex-1 min-h-screen overflow-auto transition-all duration-300 ${
              isSidebarCollapsed ? "md:ml-64 ml-0" : "md:ml-20 ml-0 md:px-16"
            }`}
          >
            <div className="w-full min-h-screen sm:px-6 lg:px-8 lg:py-1 mx-auto">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center p-4">
                  <form className="bg-[rgb(16,23,42)] shadow-xl flex flex-col lg:flex-row md:flex-col w-full max-w-4xl border mt-5 rounded-xl overflow-hidden items-center space-y-2 md:space-y-0">
                    <div className="relative flex w-full md:flex-1 p-2">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaSearch className="text-white" />
                      </span>
                      <input
                        value={employee}
                        onChange={(e) => setEmployee(e.target.value)}
                        type="text"
                        placeholder="Search by Id,Name"
                        className="w-full h-full placeholder:text-white bg-[rgb(16,23,42)] px-4 py-2 pl-12 text-sm text-white border-none rounded-t-lg md:rounded-l-lg md:rounded-t-none focus:outline-none focus:ring-0 focus:border-transparent "
                      />
                    </div>

                    <div className="flex flex-col md:flex-row w-full md:flex-1 p-2 space-y-2 md:space-y-0 md:space-x-2">
                      <div className="flex items-center w-full md:flex-1">
                        <label className="text-sm text-white mb-1 mr-1">
                          Start
                        </label>
                        <input
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          type="date"
                          className="w-full bg-[rgb(16,23,42)] px-4 py-2 text-sm text-white border rounded-lg focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center w-full md:flex-1">
                        <label className="text-sm text-white mb-1 mr-2">
                          End
                        </label>
                        <input
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          type="date"
                          className="w-full bg-[rgb(16,23,42)] px-4 py-2 text-sm text-white border rounded-lg focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="w-full md:flex-1 p-2">
                      <button
                        onClick={handleSearch}
                        className="w-full px-4 py-2 text-white bg-blue-800 hover:bg-blue-900 rounded-b-lg md:rounded-lg"
                      >
                        Search
                      </button>
                    </div>
                    <div className="w-full md:flex-1 p-2">
                      <button
                        onClick={handlereset}
                        className="w-full px-4 py-2 text-white bg-blue-800 hover:bg-blue-900 rounded-b-lg md:rounded-lg"
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                </div>
                {errorMessage && (
                  <p className="text-xs text-red-600 text-center">
                    {errorMessage}
                  </p>
                )}
              </div>
              <div className="max-w-[85rem] px-4 py-11 sm:px-6 lg:px-8 lg:py-5 mx-auto">
                <div className="flex flex-col">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="bg-[rgb(16,23,42)] border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                        <div className="px-6 py-4 flex gap-3  md:flex  md:items-center border-b border-gray-200 dark:border-neutral-700">
                          <div>
                            <h2 className="text-xl font-semibold text-white dark:text-neutral-200">
                              Employees
                            </h2>
                          </div>
                          <div className="mt-1"
                          onClick={handleAddEmployee}
                          >
                            <FaCirclePlus className="text-2xl text-white cursor-pointer hover:text-blue-500" />
                          </div>
                        </div>

                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                          <thead className="bg-[rgb(16,23,42)] dark:bg-neutral-800">
                            <tr>
                              <th
                                scope="col"
                                className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                              >
                                <div className="flex items-center gap-x-2 ml-11">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                    Name
                                  </span>
                                </div>
                              </th>

                              <th scope="col" className="px-6 py-3 text-start">
                                <div className="flex items-center gap-x-2 ml-24">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                    Department
                                  </span>
                                </div>
                              </th>

                              <th scope="col" className="px-11 py-3 text-start">
                                <div className="flex items-center gap-x-2 mr-9">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                    Position
                                  </span>
                                </div>
                              </th>

                              <th scope="col" className="px-11 py-3 text-start">
                                <div className="flex items-center gap-x-2 ml-1">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                    View
                                  </span>
                                </div>
                              </th>

                              <th scope="col" className="px-6 py-3 text-start">
                                <div className="flex items-center gap-x-2 ml-1">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                    Edit
                                  </span>
                                </div>
                              </th>

                              <th
                                scope="col"
                                className="px-6 py-3 text-start mr-2"
                              >
                                <div className="flex items-center gap-x-2">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white dark:text-neutral-200">
                                    Delete
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
                            {allemployees.map((employee, index) => (
                              <tr key={employee.id}>
                                <td className="size-px whitespace-nowrap">
                                  <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 ml-9">
                                    <div className="flex items-center gap-x-3">
                                      <img
                                        className="inline-block size-[38px] rounded-full"
                                        src={`${config.imagebaseurl}${employee.profileimage}`}
                                        alt={employee.name}
                                      />
                                      <div className="grow">
                                        <span className="block text-sm font-semibold text-white dark:text-neutral-200">
                                          {employee.name}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="h-px whitespace-nowrap">
                                  <div className="px-6 py-3 ml-24">
                                    <span className="block text-sm font-semibold text-white dark:text-neutral-200">
                                      {employee.department}
                                    </span>
                                  </div>
                                </td>

                                <td className="size-px whitespace-nowrap">
                                  <div className="px-6 py-3 ml-6">
                                    <span className="block text-sm font-semibold text-white dark:text-neutral-200">
                                      {employee.position}
                                    </span>
                                  </div>
                                </td>

                                <td className="size-px whitespace-nowrap">
                                  <div className="px-6 py-3 ml-7">
                                    <div className="flex items-center gap-x-3">
                                      <a
                                        onClick={() =>
                                          handleViewEmployee(employee.id)
                                        }
                                        className="text-sm text-blue-600 dark:text-neutral-500 cursor-pointer hover:text-blue-800"
                                      >
                                        View
                                      </a>
                                    </div>
                                  </div>
                                </td>

                                <td className="size-px whitespace-nowrap">
                                  <div className="px-6 py-3 ml-1">
                                    <div className="flex items-center gap-x-3">
                                      <a
                                        onClick={() =>
                                          handleEditEmployee(employee.id)
                                        }
                                        className="text-sm text-amber-500 dark:text-neutral-500 cursor-pointer hover:text-amber-800"
                                      >
                                        Edit
                                      </a>
                                    </div>
                                  </div>
                                </td>
                                <td className="size-px whitespace-nowrap">
                                  <div className="px-3 py-3 ml-2">
                                    <span
                                      onClick={() =>
                                        handledeletemodal(employee.id)
                                      }
                                      className="text-sm text-red-600 dark:text-neutral-500 cursor-pointer  hover:text-red-800"
                                    >
                                      Delete
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
                                {allemployees.length}
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
          </div>
        </div>
      </div>

      {togglemodal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"
              aria-hidden="true"
            ></div>
            <div className="inline-block w-full max-w-2xl p-8 my-8 overflow-hidden text-left transition-all transform bg-[rgba(41,39,63,255)] rounded-lg shadow-xl dark:bg-neutral-800 dark:border dark:border-neutral-700">
              <h3 className="text-lg font-medium text-white dark:text-neutral-200">
                Delete Employee
              </h3>
              <div className="mt-4">
                <p className="text-sm text-white dark:text-neutral-400">
                  Are you sure you want to Delete this Employee ?. This action
                  cannot be undone.
                </p>
              </div>

              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="justify-center inline-flex items-center rounded-full py-3 px-4 text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={deleteemployee}
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTogglemodal(false);
                  }}
                  className="mt-3 sm:mt-0 sm:mr-3 justify-center inline-flex items-center rounded-full py-3 px-4 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>
              {message && (
                <div
                  className="mt-2 bg-teal-100 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500"
                  role="alert"
                >
                  <span className="font-bold">Success:</span> Employee Deleted
                  successfully.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ListEmployees;
