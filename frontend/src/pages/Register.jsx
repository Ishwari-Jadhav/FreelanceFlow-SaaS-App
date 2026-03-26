import { useState } from "react";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://freelanceflow-backend-xjnm.onrender.com/api/auth/register",
        form
      );

      alert("Registered successfully!");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="p-6">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Password" type="password" onChange={e => setForm({...form, password: e.target.value})} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;