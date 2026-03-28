import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    earnings: 0,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch dashboard data
  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          Welcome to FreelanceFlow 🚀
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Projects */}
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-lg font-semibold">Projects</h2>
            <div
              onClick={() => navigate("/projects")}
              className="cursor-pointer"
            >
              <p className="text-3xl font-bold mt-2 text-blue-600">
                {stats.projects}
              </p>
              <p className="text-sm text-gray-500">Click to view</p>
            </div>
          </div>

          {/* Earnings (REAL DATA ✅) */}
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-lg font-semibold">Earnings</h2>
            <p className="text-3xl font-bold mt-2 text-green-600">
              ₹{stats.earnings}
            </p>
          </div>

          {/* Tasks */}
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <p className="text-3xl font-bold mt-2 text-purple-600">
              {stats.tasks}
            </p>
          </div>

          {/* Buttons */}
          <button
            onClick={() => navigate("/clients")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Manage Clients
          </button>

          <button
            onClick={() => navigate("/tasks")}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
          >
            Manage Tasks
          </button>

          <button
            onClick={() => navigate("/invoices")}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Generate Invoice
          </button>

          <button
            onClick={() => navigate("/invoice-history")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            View Invoices
          </button>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;