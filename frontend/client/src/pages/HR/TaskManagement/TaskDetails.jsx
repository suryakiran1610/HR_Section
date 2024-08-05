import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MakeApiRequest from "../../../Functions/AxiosApi";
import config from "../../../Functions/config";
import HRNav from "../../../components/HR/HR-Navbar/HRNav";
import HRSidebar from "../../../components/HR/HR-Sidebar/HRSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";

function TaskDetails() {
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();
  const [task, setTask] = useState(null);
  const { id } = useParams();

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  useEffect(() => {
    const params = { taskid: id };
    MakeApiRequest("get", `${config.baseUrl}hr/assigntask/`, {}, params, {})
      .then((response) => {
        console.log("tasksdetails", response);
        setTask(response);
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized access. Token might be expired or invalid.");
        } else {
          console.error("Unexpected error occurred:", error);
        }
      });
  }, [id]);

  if (!task) return <div>Loading...</div>;

  return (
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
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Task Details
              </h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700">
                  {task.task_name}
                </h3>
                <p className="text-gray-600">{task.task_description}</p>
                <p className="text-gray-500">
                  Priority: {task.task_priority}
                </p>
                <p className="text-gray-500">
                  Status: {task.task_status}
                </p>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Assigned Employees
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {task.map((assignedTask) => (
                  <div
                    key={assignedTask.id}
                    className="flex items-center bg-gray-100 p-4 rounded-lg shadow-md"
                  >
                    <img
                      src={assignedTask.employee.profileimage}
                      alt={assignedTask.employee.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {assignedTask.employee.name}
                      </h4>
                      <p className="text-gray-600">
                        Employee ID: {assignedTask.employee.employeeid}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
