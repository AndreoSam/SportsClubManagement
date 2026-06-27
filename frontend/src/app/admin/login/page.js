"use client";

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import "./LoginPage.css";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/admin/login", form);
      const token = res.data?.token;

      if (!token) {
        setError("Invalid server response");
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      router.push("/admin/dashboard");
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.message || "Login failed. Check credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-brand">
          <div className="brand-icon">🏃</div>
          <h1 className="brand-title">Athlete Management</h1>
          <p className="brand-subtitle">Admin Dashboard</p>
        </div>

        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to manage your athletes</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">
                Username or Email <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  name="username"
                  type="text"
                  className="form-input"
                  placeholder="Enter your username or email"
                  onChange={handleChange}
                  value={form.username}
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Password <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={form.password}
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="footer-text">Secure admin access only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
