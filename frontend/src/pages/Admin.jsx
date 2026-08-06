// Admin reservations panel — shows all bookings for a specific agent.
// Fetches GET /api/agents/{id}/reservations. Supports date filtering.
// Cancel button calls DELETE /api/agents/{id}/reservations/{rid}.

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Users, Clock, Trash2, RefreshCw } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

export default function Admin() {
  const { agentId } = useParams();
  const [agent, setAgent] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAgent = () =>
    fetch(`${API}/api/agents/${agentId}`)
      .then((r) => r.json())
      .then(setAgent);

  const fetchReservations = () => {
    const url = filterDate
      ? `${API}/api/agents/${agentId}/reservations?date=${filterDate}`
      : `${API}/api/agents/${agentId}/reservations`;
    return fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setReservations(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAgent();
  }, [agentId]);

  useEffect(() => {
    fetchReservations();
  }, [agentId, filterDate]);

  const cancelReservation = async (resId) => {
    if (!window.confirm("Cancel this reservation?")) return;
    await fetch(`${API}/api/agents/${agentId}/reservations/${resId}`, {
      method: "DELETE",
    });
    fetchReservations();
  };

  const totalSeatsBooked = reservations.reduce((sum, r) => sum + r.party_size, 0);

  if (!agent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-swara-cream font-sans">
        <p className="text-swara-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-swara-cream font-sans">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/chat/${agentId}`} className="text-swara-muted hover:text-swara-ink">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-swara-ink">{agent.business_name}</h1>
              <p className="text-xs text-swara-muted">Admin · Reservations</p>
            </div>
          </div>
          <button
            onClick={() => { setLoading(true); fetchReservations(); }}
            className="flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm text-swara-muted hover:bg-zinc-50"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-swara-muted">Total seats</p>
            <p className="mt-1 text-2xl font-semibold text-swara-ink">{agent.total_seats}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-swara-muted">Seats booked</p>
            <p className="mt-1 text-2xl font-semibold text-swara-gold">{totalSeatsBooked}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-swara-muted">Reservations</p>
            <p className="mt-1 text-2xl font-semibold text-swara-ink">{reservations.length}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mt-6 flex items-center gap-3">
          <CalendarDays className="h-4 w-4 text-swara-muted" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-swara-gold focus:outline-none"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="text-sm text-swara-gold hover:underline"
            >
              Show all
            </button>
          )}
        </div>

        {/* Reservations table */}
        <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          {loading ? (
            <p className="p-8 text-center text-sm text-swara-muted">Loading...</p>
          ) : reservations.length === 0 ? (
            <p className="p-8 text-center text-sm text-swara-muted">
              No reservations {filterDate ? `on ${filterDate}` : "yet"}. Chat with the agent to create some!
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-swara-sand">
                  <th className="px-5 py-3 font-medium text-swara-muted">Guest</th>
                  <th className="px-5 py-3 font-medium text-swara-muted">Date</th>
                  <th className="px-5 py-3 font-medium text-swara-muted">Time</th>
                  <th className="px-5 py-3 font-medium text-swara-muted">Party</th>
                  <th className="px-5 py-3 font-medium text-swara-muted">Notes</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-b border-zinc-50 hover:bg-swara-sand/50">
                    <td className="px-5 py-4 font-medium text-swara-ink">{r.guest_name}</td>
                    <td className="px-5 py-4 text-swara-muted">{r.date}</td>
                    <td className="flex items-center gap-1 px-5 py-4 text-swara-muted">
                      <Clock className="h-3.5 w-3.5" /> {r.time}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-swara-muted">
                        <Users className="h-3.5 w-3.5" /> {r.party_size}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-swara-muted">{r.notes || "—"}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => cancelReservation(r.id)}
                        className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600"
                        title="Cancel reservation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
