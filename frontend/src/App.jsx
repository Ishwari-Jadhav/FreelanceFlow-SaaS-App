import Projects from "./pages/Projects";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Clients from "./pages/Clients";
import Tasks from "./pages/Tasks";
import Invoices from "./pages/Invoices";
import InvoiceHistory from "./pages/InvoiceHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/projects" element={<Projects />} />

        <Route path="/clients" element={<Clients />} />

        <Route path="/tasks" element={<Tasks />} />

        <Route path="/invoices" element={<Invoices />} />

        <Route path="/invoice-history" element={<InvoiceHistory />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;