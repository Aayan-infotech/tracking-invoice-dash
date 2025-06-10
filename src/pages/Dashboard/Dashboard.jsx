import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import "./Dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchWithAuth } from "../../api/authFetch";
import { useEffect, useState } from "react";

export default function Page() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  const fetchDetails = async () => {
    try {
      const response = await fetchWithAuth(
        `${import.meta.env.VITE_REACT_APP_API_URL}users/dashboard`,
        {
          method: "GET",
        }
      );
      
      const data = response?.data?.data;
      setTotalUsers(data.totalUsers || 0);
      setTotalProjects(data.totalProjects || 0);
      setTotalTasks(data.totalTasks || 0);
    } catch (err) {
      toast.error(err.message || "Failed to fetch details");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const metrics = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: "bi-people-fill",
      color: "#4e73df",
    },
    { title: "Projects", value: totalProjects, icon: "bi-building", color: "#1cc88a" },
    {
      title: "Tasks",
      value: totalTasks,
      icon: "bi-grid-1x2-fill",
      color: "#36b9cc",
    },
  ];

  // const barData = [
  //   { name: "Jan", users: 400 },
  //   { name: "Feb", users: 600 },
  //   { name: "Mar", users: 900 },
  //   { name: "Apr", users: 700 },
  //   { name: "May", users: 1100 },
  // ];

  // const pieData = [
  //   { name: "Retail", value: 40 },
  //   { name: "Services", value: 25 },
  //   { name: "Restaurants", value: 35 },
  // ];

  // const COLORS = ["#4e73df", "#1cc88a", "#36b9cc"];

  return (
    <div className="dashboard-wrapper d-flex">
      <Sidebar />
      <div className="dashboard-main flex-grow-1">
        <Topbar />
        <div className="dashboard-content p-4">
          <h3 className="dashboard-title mb-4">Dashboard Overview</h3>

          {/* Metrics */}
          <div className="dashboard-metrics d-flex gap-3 mb-5">
            {metrics.map((item, idx) => (
              <div
                key={idx}
                className="dashboard-card"
                style={{ borderLeft: `5px solid ${item.color}` }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-muted">{item.title}</h6>
                    <h4 className="text-dark">{item.value}</h4>
                  </div>
                  <i
                    className={`bi ${item.icon} fs-2`}
                    style={{ color: item.color }}
                  ></i>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="dashboard-charts d-flex flex-wrap gap-4">
            {/* Bar Chart */}
            {/* <div className="dashboard-chart-box">
              <h6 className="mb-3">Monthly Users</h6>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#4e73df" />
                </BarChart>
              </ResponsiveContainer>
            </div> */}

            {/* Pie Chart */}
            {/* <div className="dashboard-chart-box">
              <h6 className="mb-3">Business Types</h6>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
