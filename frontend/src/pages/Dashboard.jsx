// Dashboard page — shows all agents the user has created.
// Fetches GET /api/agents on load. Shows Chat + Admin links for each agent.
// Requires login (redirects to /login if not authenticated).

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, MessageSquare, Settings, LogOut } from "lucide-react";
import { Logo } from "@/components/Swara/Logo";

const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

export default function Dashboard() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("swara_email");
  const loggedIn = localStorage.getItem("swara_logged_in");

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    fetch(`${API}/api/agents`)
      .then((r) => r.json())
      .then((data) => { setAgents(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [loggedIn, navigate]);

  const logout = () => {
    localStorage.removeItem("swara_logged_in");
    localStorage.removeItem("swara_email");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-swara-cream font-sans">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Logo className="h-7" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-swara-muted">{email}</span>
            <button onClick={logout} className="text-swara-muted hover:text-swara-ink">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-swara-ink">Your Agents</h1>
          <Link
            to="/get-started"
            className="flex items-center gap-2 rounded-full bg-swara-gold px-5 py-2.5 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" /> New Agent
          </Link>
        </div>

        {loading ? (
          <p className="mt-10 text-center text-swara-muted">Loading...</p>
        ) : agents.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-lg text-swara-muted">No agents yet</p>
            <p className="mt-2 text-sm text-swara-muted">Create your first AI agent to get started.</p>
            <Link
              to="/get-started"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-swara-ink px-6 py-3 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" /> Create Agent
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-6 py-4"
              >
                <div>
                  <p className="font-medium text-swara-ink">{agent.business_name}</p>
                  <p className="text-sm text-swara-muted">{agent.business_type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/chat/${agent.id}?admin=true`}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-swara-muted hover:bg-zinc-50"
                  >
                    <MessageSquare className="h-4 w-4" /> Chat
                  </Link>
                  <Link
                    to={`/admin/${agent.id}`}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-swara-muted hover:bg-zinc-50"
                  >
                    <Settings className="h-4 w-4" /> Admin
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
