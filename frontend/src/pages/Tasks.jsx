import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [logs, setLogs] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://freelanceflow-backend-xjnm.onrender.com/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await axios.get("https://freelanceflow-backend-xjnm.onrender.com/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch logs
  const fetchLogs = async () => {
    try {
      const res = await axios.get("https://freelanceflow-backend-xjnm.onrender.com/api/time", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchLogs();
  }, []);

  // Add task
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://freelanceflow-backend-xjnm.onrender.com/api/tasks",
        {
          title,
          description: "Task description",
          project_id: projectId,
          status: "Pending",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle("");
      setProjectId("");
      fetchTasks();
    } catch (err) {
      console.log(err);
      alert("Error adding task");
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://freelanceflow-backend-xjnm.onrender.com/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTasks();
    } catch (err) {
      console.log(err);
      alert("Error deleting task");
    }
  };

  // Start timer
  const handleStart = async (taskId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/time/start",
        { task_id: taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Timer started");
      fetchLogs();
    } catch (err) {
      console.log(err);
      alert("Error starting timer");
    }
  };

  // Stop timer (FIXED)
  const handleStop = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/time", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const logs = res.data;

      // get latest running log
      const runningLog = logs
        .filter((log) => !log.end_time)
        .sort((a, b) => b.id - a.id)[0];

      if (!runningLog) {
        alert("No running timer found");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/time/stop/${runningLog.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Timer stopped");
      fetchLogs();
    } catch (err) {
      console.log(err);
      alert("Error stopping timer");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tasks 📝</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full"
            required
          />

          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Project</option>

            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Task
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="font-bold">{t.title}</h2>
                <p>Status: {t.status}</p>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => handleStart(t.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Start
                </button>

                <button
                  onClick={handleStop}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Stop
                </button>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Logs */}
        <h2 className="text-xl font-bold mt-8 mb-4">Time Logs ⏱️</h2>

        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="border p-4 rounded">
              <p>Task ID: {log.task_id}</p>
              <p>Start: {new Date(log.start_time).toLocaleString()}</p>
              <p>
                End:{" "}
                {log.end_time
                  ? new Date(log.end_time).toLocaleString()
                  : "Running..."}
              </p>
              <p>Duration: {log.duration || "Calculating..."}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tasks;