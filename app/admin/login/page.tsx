"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import "./admin-login.css";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Admin login failed.");
        return;
      }

      // Store only basic admin information.
      // Authentication itself is handled by the HTTP-only cookie.
      localStorage.setItem(
        "connectaAdminUser",
        JSON.stringify(data.user)
      );

      router.replace("/admin");
    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-glow glow-one"></div>
      <div className="admin-login-glow glow-two"></div>

      <button
        type="button"
        className="admin-back-button"
        onClick={() => router.push("/")}
      >
        <ArrowLeft size={18} />
        Back to CONNECTA
      </button>

      <div className="admin-login-card">
        <div className="admin-login-icon">
          <ShieldCheck size={38} />
        </div>

        <div className="admin-login-heading">
          <span>CONNECTA</span>
          <h1>Admin Login</h1>
          <p>Secure access to the CONNECTA administration panel.</p>
        </div>

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-input-group">
            <label htmlFor="admin-email">Admin Email</label>

            <div className="admin-input-wrapper">
              <Mail size={19} />

              <input
                id="admin-email"
                type="email"
                placeholder="admin@connecta.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label htmlFor="admin-password">Password</label>

            <div className="admin-input-wrapper">
              <Lock size={19} />

              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="admin-login-spinner" />
                Signing in...
              </>
            ) : (
              <>
                <ShieldCheck size={20} />
                Sign in as Admin
              </>
            )}
          </button>
        </form>

        <div className="admin-security-note">
          <ShieldCheck size={17} />

          <span>
            This area is restricted to authorized CONNECTA administrators.
          </span>
        </div>
      </div>
    </main>
  );
}