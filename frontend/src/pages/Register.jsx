import { useState } from "react";
import { registerTenant } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Register() {
  const [form, setForm] = useState({
    tenantName: "",
    subdomain: "",
    adminEmail: "",
    adminFullName: "",
    adminPassword: ""
  });
  const navigate = useNavigate();

  const submit = async () => {
    if (!form.tenantName || !form.subdomain || !form.adminEmail || !form.adminFullName || !form.adminPassword) {
      alert("Please fill in all the fields before registering.");
      return; // Stop the function here
    }

    try {
      await registerTenant(form);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      // This follows the structure seen in your console logs
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Tenant Registration</h2>
        <input 
          placeholder="Organization Name" 
          onChange={e => setForm({ ...form, tenantName: e.target.value })} 
        />
        <input 
          placeholder="Subdomain" 
          onChange={e => setForm({ ...form, subdomain: e.target.value })} 
        />
        <input 
          placeholder="Admin Email" 
          onChange={e => setForm({ ...form, adminEmail: e.target.value })} 
        />
        <input 
          placeholder="Admin Full Name" 
          onChange={e => setForm({ ...form, adminFullName: e.target.value })} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={e => setForm({ ...form, adminPassword: e.target.value })} 
        />
        <button onClick={submit}>Register</button>
      </div>
    </>
  );
}