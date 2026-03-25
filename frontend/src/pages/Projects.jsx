import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProjects();

    // Fetch Clients
    axios.get("http://localhost:5000/api/clients", {
    headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setClients(res.data))
    .catch(err => console.log(err));

  }, []);

  // Add project
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/projects",
        {
          name,
          description,
          client_id: clientId,
          status: "Active",
          budget: 1000,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setName("");
      setDescription("");
      setClientId("");

      fetchProjects(); // refresh list
    } catch (err) {
      console.log(err);
      alert("Error adding project");
    }
  };

  const handleDelete = async (id) => {
    try {
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        });

        fetchProjects(); // refresh list
    } catch (err) {
        console.log(err);
        alert("Error deleting project");
    }
    };

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Projects 🚀</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
            required
          />

            <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="border p-2 w-full"
            required
            >
            <option value="">Select Client</option>

            {clients.map((c) => (
                <option key={c.id} value={c.id}>
                {c.name}
                </option>
            ))}
            </select>


          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Project
          </button>
        </form>

        {/* List */}
        <div className="space-y-3">
          {projects.map((p) => (
            <div
                key={p.id}
                className="border p-4 rounded flex justify-between items-center"
            >
                <div>
                <h2 className="font-bold">{p.name}</h2>
                <p>{p.description}</p>
                </div>

                <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
                >
                Delete
                </button>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;