import React, { useContext,useEffect, useState } from "react";
import MakeApiRequest from "../../../Functions/AxiosApi";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import config from "../../../Functions/config";
import HRNav from "../../../components/HR/HR-Navbar/HRNav";
import HRSidebar from "../../../components/HR/HR-Sidebar/HRSidebar";
import NotificationContext from "../../../context/NotificationContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
} from "recharts";

const HRDashboard = () => {
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { notifications,updateNotification } = useContext(NotificationContext);
  const [dashboarddata,setDashboarddata]=useState([])

  const [filters, setFilters] = useState({
    leaveType: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  useEffect(() => {
    loadLeaveDetails();
    updateNotification();
    loadDashboardData()
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leaveRequests, filters]);

  const loadLeaveDetails = () => {
    MakeApiRequest(
      "get",
      `${config.baseUrl}hr/leaverequest_for_chart/`,
      {},
      {},
      {}
    )
      .then((response) => {
        console.log("leaveRequests", response);
        setLeaveRequests(response);
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

  const loadDashboardData = () => {
    MakeApiRequest(
      "get",
      `${config.baseUrl}hr/dashboard_data/`,
      {},
      {},
      {}
    )
      .then((response) => {
        console.log("Dashboarddata", response);
        setDashboarddata(response);
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

  const applyFilters = () => {
    const filtered = leaveRequests.filter((request) => {
      const matchesLeaveType = filters.leaveType
        ? request.leavetype === filters.leaveType
        : true;
      const matchesStatus = filters.status
        ? request.status === filters.status
        : true;
      const matchesStartDate = filters.startDate
        ? new Date(request.startdate) >= new Date(filters.startDate)
        : true;
      const matchesEndDate = filters.endDate
        ? new Date(request.enddate) <= new Date(filters.endDate)
        : true;
      return (
        matchesLeaveType && matchesStatus && matchesStartDate && matchesEndDate
      );
    });

    const dataByMonth = groupDataByMonth(filtered);
    setFilteredData(dataByMonth);
  };

  const groupDataByMonth = (data) => {
    const fullMonthList = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const grouped = {};
    data.forEach((request) => {
      const month = new Date(request.startdate).toLocaleString("default", {
        month: "short",
      });
      if (!grouped[month]) {
        grouped[month] = { month, leaveCount: 0 };
      }
      grouped[month].leaveCount += 1;
    });

    // Merge full month list with actual data
    const mergedData = fullMonthList.map((month) => {
      return grouped[month] || { month, leaveCount: 0 };
    });

    return mergedData;
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlereset = () => {
    setFilters({
      leaveType: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-gray-800 text-white rounded shadow-lg max-w-[200px]">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">Leave Count: {data.leaveCount}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="bg-[rgb(16,23,42)] ">
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
            <div className="w-11/12 min-h-screen sm:px-6 lg:px-8 lg:py-7 mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-[rgba(41,39,63,255)] shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
                <div className="inline-flex justify-center items-center">
                  <span className="size-2 inline-block bg-green-400 rounded-full me-2"></span>
                  <span className="text-xs font-semibold uppercase text-white dark:text-neutral-400">
                    Notifications
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white dark:text-neutral-200">
                    {notifications.notification.length}
                  </h3>
                </div>

                <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
                  <dd className="text-start ps-3">
                    <span className="block text-sm text-white dark:text-neutral-500">
                      {" "}
                      {notifications.unreadnotificationcount} Unread
                      Notification
                    </span>
                  </dd>
                </dl>
              </div>
              <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-[rgba(41,39,63,255)] shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
                <div className="inline-flex justify-center items-center">
                  <span className="size-2 inline-block bg-green-400 rounded-full me-2"></span>
                  <span className="text-xs font-semibold uppercase text-white dark:text-neutral-400">
                    Leave Requests
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white dark:text-neutral-200">
                    {dashboarddata.current_date_leave_count}
                  </h3>
                </div>

                <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
                  <dd className="text-start ps-3">
                    <span className="block text-sm text-white dark:text-neutral-500">
                      {" "}
                      {dashboarddata.pending_leave_count} for Approval
                    </span>
                  </dd>
                </dl>
              </div>
              <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-[rgba(41,39,63,255)]  shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
                <div className="inline-flex justify-center items-center">
                  <span className="size-2 inline-block bg-green-400 rounded-full me-2"></span>
                  <span className="text-xs font-semibold uppercase text-white dark:text-neutral-400">
                    Employees
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white dark:text-neutral-200">
                    {dashboarddata.employee_count}
                  </h3>
                </div>

                <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
                  <dd className="text-start ps-3">
                    <span className="block text-sm text-white dark:text-neutral-500">
                      {" "}
                      {dashboarddata.last_week_employee_count} last week
                    </span>
                  </dd>
                </dl>
              </div>
              </div>
              <p className="text-xl text-white font-semibold mb-1 ml-2">
                Leave Statistics
              </p>
              <div className="mb-4 flex flex-wrap items-center gap-4 ml-2">
                <div className="flex flex-col">
                  <label className="text-gray-500">Leave Type:</label>
                  <select
                    name="leaveType"
                    onChange={handleFilterChange}
                    className="bg-[rgb(16,23,42)] text-white p-1 rounded"
                  >
                    <option value="">All</option>
                    <option value="sick leave">Sick Leave</option>
                    <option value="casual leave">Casual Leave</option>
                    <option value="maternity leave">Maternity Leave</option>
                    {/* Add other leave types here */}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-500">Status:</label>
                  <select
                    name="status"
                    onChange={handleFilterChange}
                    className="bg-[rgb(16,23,42)] text-white p-1 rounded"
                  >
                    <option value="">All</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-500">Start Date:</label>
                  <input
                    type="date"
                    name="startDate"
                    onChange={handleFilterChange}
                    className="bg-[rgb(16,23,42)] text-white p-1 rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-500">End Date:</label>
                  <input
                    type="date"
                    name="endDate"
                    onChange={handleFilterChange}
                    className="bg-[rgb(16,23,42)] text-white p-1 rounded"
                  />
                </div>
                <div>
                  <button
                    onClick={handlereset}
                    className="px-6 py-2 text-white bg-[rgb(16,23,42)] hover:bg-blue-900 rounded-lg lg:mt-5 border border-gray-500"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="w-full h-[800px]">
                {filteredData.length === 0 ? (
                  <div className="text-white text-center mt-40">
                    No leave requests available for the selected filters.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={filteredData}
                      margin={{ top: 20, right: 75, left: 40, bottom: 140 }}
                    >
                      <Legend
                        wrapperStyle={{
                          color: "white",
                          fontSize: "18px",
                          bottom: "20px",
                        }}
                        align="center"
                        verticalAlign="bottom"
                        layout="horizontal"
                        iconSize={10}
                        iconType="circle"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "white" }}
                        stroke="#FFFFFF"
                      />
                      <YAxis tick={{ fill: "white" }} stroke="#FFFFFF" />
                      <Tooltip
                        cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                        content={<CustomTooltip />}
                      />
                      <Bar dataKey="leaveCount" fill="#3A80DA" />
                      <Brush
                        dataKey="month"
                        height={20}
                        y={800 - 110}
                        stroke="#3A80DA"
                        fill="#333"
                        travellerWidth={15}
                        tickFormatter={(month) => month.substring(0, 3)}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HRDashboard;
