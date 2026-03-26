import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const token = localStorage.getItem("token");

  const fetchInvoices = async () => {
    try {
      const res = await axios.get("https://freelanceflow-backend-xjnm.onrender.com/api/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(res.data);
    } catch (err) {
      console.log(err);
      alert("Error fetching invoices");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Invoice History 📄</h1>

        {invoices.length === 0 ? (
          <p>No invoices yet</p>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="border p-4 rounded">
                <p><strong>Invoice ID:</strong> {inv.id}</p>
                <p><strong>Client:</strong> {inv.client_name}</p>
                <p><strong>Total:</strong> Rs {inv.total_amount}</p>
                <p><strong>Date:</strong> {new Date(inv.created_at).toLocaleDateString()}</p>

                <a
                  href={`https://freelanceflow-backend-xjnm.onrender.com/api/invoices/pdf/${inv.id}`}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Download PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InvoiceHistory;