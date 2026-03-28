import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Clients() {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [rate, setRate] = useState("");

  const token = localStorage.getItem("token");

  // Fetch clients
  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Add client
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/clients",
        {
          name,
          email,
          phone,
          company,
          hourly_rate: rate ? Number(rate) : 0, // ✅ FIXED
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setRate("");

      fetchClients();
    } catch (err) {
      console.log(err);
      alert("Error adding client");
    }
  };

  // Delete client
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchClients();
    } catch (err) {
      console.log(err);
      alert("Error deleting client");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Clients 👥</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />

          <input
            type="email"
            placeholder="Client Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
            required
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-full"
          />

          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="border p-2 w-full"
          />

          {/* ✅ NEW FIELD */}
          <input
            type="number"
            placeholder="Hourly Rate (₹)"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="border p-2 w-full"
            required
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Client
          </button>
        </form>

        {/* List */}
        <div className="space-y-3">
          {clients.map((c) => (
            <div
              key={c.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="font-bold">{c.name}</h2>
                <p>{c.email}</p>
                <p>{c.company}</p>
                <p>Rate: ₹{c.hourly_rate}</p>
              </div>

              <button
                onClick={() => handleDelete(c.id)}
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

export default Clients;