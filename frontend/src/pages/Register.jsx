import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://freelanceflow-backend-beav.onrender.com/api/auth/register",
        form
      );

      alert("Registration Successful ✅");
      navigate("/"); // go to login
    } catch (err) {
      console.log(err);
      alert("Registration Failed ❌");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
          FreelanceFlow 🚀
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Create your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-center mt-4 text-gray-600">
        Already have an account?{" "}
        <span
            onClick={() => navigate("/")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
        >
            Login
        </span>
        </p>

      </div>
    </div>
  );
}

export default Register;