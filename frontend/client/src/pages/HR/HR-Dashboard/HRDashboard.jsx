import React, { useEffect, useState } from "react";
import MakeApiRequest from "../../../Functions/AxiosApi";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import config from "../../../Functions/config";
import HRNav from "../../../components/HR/HR-Navbar/HRNav";
import HRSidebar from "../../../components/HR/HR-Sidebar/HRSidebar";
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
  const [leaverequest, setLeaverequest] = useState([]);


  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  useEffect(() => {
    loadleavedetails();
  }, []);

  const loadleavedetails = () => {
    MakeApiRequest("get", `${config.baseUrl}hr/leaverequest_for_chart/`, {}, {}, {})
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
  };

  // const CustomTooltip = ({ active, payload, label }) => {
  //   if (active && payload && payload.length) {
  //     const data = payload[0].payload;
  //     return (
  //       <div className="p-2 bg-gray-800 text-white rounded shadow-lg max-w-[200px]">
  //         <p className="font-semibold">{label}</p>
  //         {Object.keys(data.details).map((plan) => {
  //           const uniqueCompanies =
  //             Array.from(
  //               new Set(data.details[plan].map((item) => item.company))
  //             ).join(", ") || "No companies";
  //           const uniqueProducts =
  //             Array.from(
  //               new Set(data.details[plan].map((item) => item.product))
  //             ).join(", ") || "No products";
  //           return (
  //             <div key={plan} className="mt-2">
  //               <p className="font-semibold">
  //                 {plan} ({data[plan]}):
  //               </p>
  //               <p className="text-sm">Companies: {uniqueCompanies}</p>
  //               <p className="text-sm">Products: {uniqueProducts}</p>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     );
  //   }

  //   return null;
  // };

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
              {/* <div className="w-full h-[800px]">
                {dataByMonth.length === 0 ? (
                  <div className="text-white text-center mt-40">
                    No subscription plans available for the selected company /
                    status / product.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dataByMonth}
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
                        stroke={WHITE}
                        angle={isMediumScreenOrBelow ? -90 : 0}
                        dx={isMediumScreenOrBelow ? -10 : 0}
                        dy={isMediumScreenOrBelow ? 10 : 10}
                        textAnchor={isMediumScreenOrBelow ? "end" : "middle"}
                      />
                      <YAxis tick={{ fill: "white" }} stroke={WHITE} />
                      <Tooltip
                        cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                        content={<CustomTooltip />}
                      />
                      {plans.map((plan) => (
                        <Bar
                          key={plan}
                          dataKey={plan}
                          fill={getBarColor(plan)}
                        />
                      ))}
                      <Brush
                        dataKey="month"
                        height={20}
                        y={800 - 110}
                        stroke={PURPLE_700}
                        fill={GRAY_900}
                        travellerWidth={15}
                        tickFormatter={(month) => month.substring(0, 3)}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HRDashboard;
