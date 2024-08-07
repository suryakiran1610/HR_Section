import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MakeApiRequest from "../../../Functions/AxiosApi";
import config from "../../../Functions/config";
import HRNav from "../../../components/HR/HR-Navbar/HRNav";
import HRSidebar from "../../../components/HR/HR-Sidebar/HRSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

function TaskDetails() {
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();
  const [task, setTask] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isTaskModel, setIsTaskModel] = useState(false);


  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const handleViewEmployee = (EmployeeId) => {
    navigate(`/company/viewemployeeprofile/${EmployeeId}`);
  };

  useEffect(() => {
    const params = { taskid: id };
    MakeApiRequest("get", `${config.baseUrl}hr/assigntask/`, {}, params, {})
      .then((response) => {
        console.log("tasksdetails", response);
        setTask(response);
        if (response.length > 0) {
          if (response[0].task_created_on) {
            setIsTaskModel(true);
          } else {
            setIsTaskModel(false);
          }
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
  }, [id]);

  return (
    <div className="bg-[rgb(16,23,42)]">
      <HRNav />
      <div className="flex min-h-screen pt-16">
        <div className="w-fit md:fixed top-20 left-0 min-h-screen bottom-0 md:block hidden z-40">
          <HRSidebar sidebarToggle={sidebarToggle} />
        </div>
        {!task ? (
          <div>Loading...</div>
        ) : (
          <div
            className={`flex-1 min-h-screen overflow-auto transition-all duration-300 ${
              isSidebarCollapsed ? "md:ml-64 ml-0" : "md:ml-20 ml-0 md:px-16"
            }`}
          >
            <div className="w-full min-h-screen sm:px-6 lg:px-8 lg:py-1 mx-auto p-4">
              <div className="bg-[rgba(41,39,63,255)] shadow overflow-hidden sm:rounded-lg p-6 mt-9">
                <h2 className="text-2xl font-bold mb-4 text-white text-center">
                  Task Details
                </h2>
                <div className="flex flex-wrap justify-between mb-6">
                  <div className="bg-[rgb(16,23,42)] p-5 flex-1 ml-2 mb-4 rounded-lg">
                  {isTaskModel ? (
                    <>
                      <h3 className="text-xl font-semibold text-white">
                      Task Name:{" "}
                      <span className="text-base ml-2">
                        {task[0]?.task_name}
                      </span>
                    </h3>
                    <p className="text-white mt-1 text-xl font-semibold">
                      Task ID:{" "}
                      <span className="text-base ml-2">
                        {task[0]?.task_id}
                      </span>
                    </p>
                    <p className="text-white mt-1 text-xl font-semibold">
                      Description:{" "}
                      <span className="text-base ml-2">
                        {task[0]?.task_description}
                      </span>
                    </p>
                    </>
                  ):(
                    <>
                    <h3 className="text-xl font-semibold text-white">
                      Task Name:{" "}
                      <span className="text-base ml-2">
                        {task[0]?.task?.task_name}
                      </span>
                    </h3>
                    <p className="text-white mt-1 text-xl font-semibold">
                      Task ID:{" "}
                      <span className="text-base ml-2">
                        {task[0]?.task?.task_id}
                      </span>
                    </p>
                    <p className="text-white mt-1 text-xl font-semibold">
                      Description:{" "}
                      <span className="text-base ml-2">
                        {task[0]?.task?.task_description}
                      </span>
                    </p>
                    <p className="text-white mt-1 text-xl font-semibold">
                      Priority:{" "}
                      <span className="text-base ml-2">
                        {task[0]?.task_priority}
                      </span>
                    </p>
                    </>
                  )}
                  </div>
                  {isTaskModel ? (
                    <div
                    className="bg-[rgb(16,23,42)] p-3 flex-1 ml-3 mb-4 rounded-lg cursor-pointer transition-transform transform hover:scale-105"
                    onClick={() =>
                      handleViewEmployee(task[0]?.task?.employee?.id)
                    }
                  >
                    <div className="flex items-center mb-4 mt-5 cursor-pointer">
                      <img
                        src={`${config.imagebaseurl}${task[0]?.employee?.profileimage}`}
                        alt={task[0]?.employee?.name}
                        className="w-16 h-16 rounded-full object-cover ml-4 mt-1"
                        onClick={() =>
                          handleViewEmployee(task[0]?.task?.employee?.id)
                        }
                      />
                      <div className="ml-7">
                        <h3 className="text-xl font-semibold text-white mt-1">
                          Created By: {task[0]?.employee?.name}
                        </h3>
                        <p className="text-white mt-1">
                          Employee ID: {task[0]?.employee?.employeeid}
                        </p>
                        <p className="text-white mt-1">
                          Created On: {task[0]?.task_created_on}
                        </p>
                      </div>
                    </div>
                  </div>
                  ):(
                  <div
                    className="bg-[rgb(16,23,42)] p-3 flex-1 ml-3 mb-4 rounded-lg cursor-pointer transition-transform transform hover:scale-105"
                    onClick={() =>
                      handleViewEmployee(task[0]?.task?.employee?.id)
                    }
                  >
                    <div className="flex items-center mb-4 mt-5 cursor-pointer">
                      <img
                        src={`${config.imagebaseurl}${task[0]?.task?.employee?.profileimage}`}
                        alt={task[0]?.employee?.name}
                        className="w-16 h-16 rounded-full object-cover ml-4 mt-1"
                        onClick={() =>
                          handleViewEmployee(task[0]?.task?.employee?.id)
                        }
                      />
                      <div className="ml-7">
                        <h3 className="text-xl font-semibold text-white mt-1">
                          Created By: {task[0]?.task?.employee?.name}
                        </h3>
                        <p className="text-white mt-1">
                          Employee ID: {task[0]?.task?.employee?.employeeid}
                        </p>
                        <p className="text-white mt-1">
                          Created On: {task[0]?.task?.task_created_on}
                        </p>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">
                  Assigned Employees
                </h3>
                {!isTaskModel &&(
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {task.map((assignedTask) => (
                    <div
                      key={assignedTask.id}
                      className="flex items-center bg-[rgb(16,23,42)] p-4 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105"
                      onClick={() => handleViewEmployee(assignedTask.employeeid)}
                    >
                      <img
                        src={`${config.imagebaseurl}${assignedTask.employee.profileimage}`}
                        alt={assignedTask.employee.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-white mt-1">
                          {assignedTask.employee.name}
                        </h4>
                        <p className="text-white mt-1">
                          Employee ID: {assignedTask.employee.employeeid}
                        </p>
                        <p className="text-white mt-1 ">
                          Status:
                          {assignedTask.task_status === "completed" ? (
                            <span class="bg-green-100 ml-2 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                              completed
                            </span>
                          ) : assignedTask.task_status === "in progress" ? (
                            <span class="bg-blue-100 ml-2 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                              in progress
                            </span>
                          ) : assignedTask.task_status === "not started" ? (
                            <span class="bg-yellow-100 ml-2 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                              not started
                            </span>
                          ) : (
                            null()
                          )}
                        </p>
                        <p className="text-white mt-1">
                          Assigned:{" "}
                          {new Date(
                            assignedTask.task_assign_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDetails;
