// Login page — simple email/password form.
// Calls POST /api/auth/login. On success, saves to localStorage and redirects to /dashboard.
// Credentials are checked against backend/.env (ADMIN_EMAIL, ADMIN_PASSWORD).

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Swara/Logo";

const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Wrong email or password");
        setLoading(false);
        return;
      }
      localStorage.setItem("swara_logged_in", "true");
      localStorage.setItem("swara_email", email);
      navigate("/dashboard");
    } catch {
      setError("Could not reach server");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-swara-cream px-4 font-sans">
      <div className="w-full max-w-sm">
        <a href="/" className="mb-8 flex justify-center">
          <Logo className="h-8" />
        </a>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-center font-display text-2xl font-semibold text-swara-ink">
            Log in
          </h1>
          <p className="mt-2 text-center text-sm text-swara-muted">
            Access your Swara dashboard
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-swara-ink">Email</label>
              <input
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm focus:border-swara-gold focus:outline-none focus:ring-2 focus:ring-swara-gold/20"
                placeholder="admin@swara.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-swara-ink">Password</label>
              <input
                type="password"
                required
                className="mt-1 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm focus:border-swara-gold focus:outline-none focus:ring-2 focus:ring-swara-gold/20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-swara-ink py-3 text-sm font-medium text-white transition-opacity disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
