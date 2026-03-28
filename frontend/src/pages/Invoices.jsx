import axios from "axios";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

function Invoices() {
  const [clientId, setClientId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [clients, setClients] = useState([]);

  const token = localStorage.getItem("token");

  const handleGenerate = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://freelanceflow-backend-beav.onrender.com/api/invoices",
        {
          client_id: clientId,
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setInvoice(res.data);
    } catch (err) {
      console.log(err);
      alert("Error generating invoice");
    }
  };

  const fetchClients = async () => {
    try {
        const res = await axios.get("https://freelanceflow-backend-beav.onrender.com/api/clients", {
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

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Invoices 💰</h1>

        {/* Form */}
        <form onSubmit={handleGenerate} className="space-y-3 mb-6">

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

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 w-full"
            required
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 w-full"
            required
          />

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Generate Invoice
          </button>
        </form>

        {/* Result */}
        {invoice && (
          <div className="border p-4 rounded">
            <p><strong>Total:</strong> ₹{invoice.total}</p>
            <p><strong>Logs Used:</strong> {invoice.logs}</p>

            <button
            onClick={async () => {
                try {
                const res = await axios.get(
                    `https://freelanceflow-backend-beav.onrender.com/api/invoices/pdf/${invoice.invoice.id}`,
                    {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "blob",
                    }
                );

                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "invoice.pdf");
                document.body.appendChild(link);
                link.click();
                } catch (err) {
                console.log(err);
                alert("Error downloading PDF");
                }
            }}
            className="text-blue-600 underline"
            >
            Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Invoices;