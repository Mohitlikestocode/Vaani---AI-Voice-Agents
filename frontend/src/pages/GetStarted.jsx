// Agent creation wizard (4 steps): business info → instructions → capacity → greeting.
// On submit: POST /api/agents → shows embed code for one-line website integration.
// Requires login (redirects to /login if not authenticated).

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Copy, Check, ExternalLink } from "lucide-react";
import { Logo } from "@/components/Swara/Logo";

const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
const WIDGET_HOST = window.location.origin;

const BUSINESS_TYPES = [
  "Restaurant",
  "Salon & Spa",
  "Clinic",
  "Hotel",
  "Retail Store",
  "Tech Support",
  "Other",
];

export default function GetStarted() {
  const navigate = useNavigate();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!localStorage.getItem("swara_logged_in")) {
      navigate("/login");
    }
  }, [navigate]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdAgent, setCreatedAgent] = useState(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    business_type: "",
    greeting: "Hi! Thanks for calling. How can I help you today?",
    instructions: "",
    total_seats: 20,
    avg_eating_minutes: 60,
    max_party_size: 20,
    reservations_enabled: true,
  });
  const [showCapacity, setShowCapacity] = useState(false);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/agents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const agent = await res.json();
      setCreatedAgent(agent);
    } catch (err) {
      alert("Could not connect to the server. Make sure the backend is running on port 8001.");
      setLoading(false);
    }
  };

  const embedCode = createdAgent
    ? `<script src="${WIDGET_HOST}/swara-widget.js" data-agent="${createdAgent.id}" data-host="${WIDGET_HOST}"></script>`
    : "";

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-swara-cream px-4 py-12 font-sans">
      <a href="/" className="mb-10">
        <Logo className="h-8" />
      </a>

      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        {!createdAgent && (
          <div className="mb-8 flex items-center justify-center gap-3">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full transition-colors ${
                  s <= step ? "bg-swara-gold" : "bg-zinc-200"
                }`}
              />
            ))}
          </div>
        )}

        {/* Step 1: Business name & type */}
        {!createdAgent && step === 1 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h1 className="font-display text-2xl font-semibold text-swara-ink">
              What's your business?
            </h1>
            <p className="mt-2 text-swara-muted">
              Tell us the basics so Swara can start answering your calls.
            </p>

            <label className="mt-6 block text-sm font-medium text-swara-ink">
              Business name
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm focus:border-swara-gold focus:outline-none focus:ring-2 focus:ring-swara-gold/20"
              placeholder="e.g. Spice Garden Restaurant"
              value={form.business_name}
              onChange={(e) => update("business_name", e.target.value)}
            />

            <label className="mt-5 block text-sm font-medium text-swara-ink">
              Business type
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {BUSINESS_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => update("business_type", t)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    form.business_type === t
                      ? "border-swara-gold bg-swara-gold text-white"
                      : "border-zinc-200 text-swara-muted hover:border-swara-gold/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              disabled={!form.business_name || !form.business_type}
              onClick={() => setStep(2)}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-swara-ink py-3 text-sm font-medium text-white transition-opacity disabled:opacity-40"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: Instructions */}
        {!createdAgent && step === 2 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h1 className="font-display text-2xl font-semibold text-swara-ink">
              Teach your agent
            </h1>
            <p className="mt-2 text-swara-muted">
              Tell Swara everything a caller might ask — hours, menu, prices,
              location. Just write it like you're talking to a new employee.
            </p>

            <button
              type="button"
              onClick={() => update("instructions", "We're open Monday to Saturday, 12pm to 11pm. Sunday brunch is 10am to 3pm, dinner 6pm to 10pm. Closed on public holidays.\n\nOur specialties: Truffle Mushroom Risotto (Rs 550), Lamb Shank (Rs 750), Odyssey Thali (Rs 450 - changes weekly), Wood-fired pizzas from Rs 400.\n\nFull bar available. Cocktails Rs 350-500. Happy hour Monday to Thursday 5pm-7pm, buy one get one on house cocktails.\n\nLocation: 14 Brigade Road, above Crossword bookstore, Bangalore 560001. Valet parking Rs 50.\n\nWalk-in for up to 4 guests, no reservation needed. For 5 or more people, book at least one day in advance. Private dining room available for up to 20 guests (3 days notice, Rs 5000 deposit).\n\nWe have a separate vegetarian menu. Most dishes can be made gluten-free, just ask. Cannot accommodate nut allergies for desserts.\n\nIf someone asks about catering or events, take their name and number and say the events team will call back within 24 hours.\n\nDo not offer any discounts or freebies. Only the manager can authorize those.")}
              className="mt-4 rounded-full border border-swara-gold/30 px-4 py-1.5 text-xs text-swara-gold hover:bg-swara-gold/5"
            >
              Fill with sample (My Odyssey restaurant)
            </button>

            <textarea
              className="mt-4 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm leading-relaxed focus:border-swara-gold focus:outline-none focus:ring-2 focus:ring-swara-gold/20"
              rows={8}
              placeholder={`Example:\nWe're open Monday to Saturday, 11am to 10pm. Closed on Sundays.\nOur specialties are butter chicken and biryani.\nReservations for 6+ people need to be made a day in advance.\nWe're located at 42 MG Road, near City Mall.`}
              value={form.instructions}
              onChange={(e) => update("instructions", e.target.value)}
            />

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="rounded-full border border-zinc-200 px-6 py-3 text-sm text-swara-muted hover:bg-zinc-50"
              >
                Back
              </button>
              <button
                disabled={!form.instructions}
                onClick={() => setStep(3)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-swara-ink py-3 text-sm font-medium text-white transition-opacity disabled:opacity-40"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Capacity & reservations (optional) */}
        {!createdAgent && step === 3 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h1 className="font-display text-2xl font-semibold text-swara-ink">
              Reservations & capacity
            </h1>
            <p className="mt-2 text-swara-muted">
              Optional — helps Swara manage bookings smartly.
            </p>

            <div className="mt-6 flex items-center justify-between">
              <label className="text-sm font-medium text-swara-ink">
                Enable reservations?
              </label>
              <button
                onClick={() => update("reservations_enabled", !form.reservations_enabled)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  form.reservations_enabled ? "bg-swara-gold" : "bg-zinc-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    form.reservations_enabled ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            {form.reservations_enabled && (
              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm text-swara-muted">Total seats</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm focus:border-swara-gold focus:outline-none"
                    value={form.total_seats}
                    onChange={(e) => update("total_seats", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-swara-muted">Average eating time (minutes)</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm focus:border-swara-gold focus:outline-none"
                    value={form.avg_eating_minutes}
                    onChange={(e) => update("avg_eating_minutes", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-swara-muted">Max party size</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm focus:border-swara-gold focus:outline-none"
                    value={form.max_party_size}
                    onChange={(e) => update("max_party_size", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="rounded-full border border-zinc-200 px-6 py-3 text-sm text-swara-muted hover:bg-zinc-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-swara-ink py-3 text-sm font-medium text-white"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Greeting & launch */}
        {!createdAgent && step === 4 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h1 className="font-display text-2xl font-semibold text-swara-ink">
              Set a greeting
            </h1>
            <p className="mt-2 text-swara-muted">
              This is the first thing callers hear when your agent picks up.
            </p>

            <textarea
              className="mt-6 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm leading-relaxed focus:border-swara-gold focus:outline-none focus:ring-2 focus:ring-swara-gold/20"
              rows={3}
              value={form.greeting}
              onChange={(e) => update("greeting", e.target.value)}
            />

            <div className="mt-4 rounded-xl bg-swara-sand p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-swara-muted">
                Preview
              </p>
              <p className="mt-2 text-sm text-swara-ink">
                ðŸŽ™️ "{form.greeting}"
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="rounded-full border border-zinc-200 px-6 py-3 text-sm text-swara-muted hover:bg-zinc-50"
              >
                Back
              </button>
              <button
                disabled={loading}
                onClick={handleCreate}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-swara-gold py-3 text-sm font-medium text-white transition-opacity disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? "Creating..." : "Launch Agent"}
              </button>
            </div>
          </div>
        )}

        {/* Success: show embed code */}
        {createdAgent && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <Check className="h-7 w-7 text-green-600" />
            </div>
            <h1 className="mt-4 text-center font-display text-2xl font-semibold text-swara-ink">
              Your agent is live!
            </h1>
            <p className="mt-2 text-center text-swara-muted">
              Add this one line to any website to embed your AI agent:
            </p>

            <div className="mt-6 rounded-xl bg-swara-sand p-4">
              <div className="flex items-start justify-between gap-2">
                <code className="block break-all text-xs leading-relaxed text-swara-ink">
                  {embedCode}
                </code>
                <button
                  onClick={copyEmbed}
                  className="shrink-0 rounded-lg border border-zinc-200 bg-white p-2 hover:bg-zinc-50"
                  title="Copy"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-swara-muted" />}
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`/chat/${createdAgent.id}?admin=true`}
                className="flex items-center justify-center gap-2 rounded-full bg-swara-ink py-3 text-sm font-medium text-white"
              >
                Test your agent <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href={`/admin/${createdAgent.id}`}
                className="flex items-center justify-center gap-2 rounded-full border border-zinc-200 py-3 text-sm text-swara-muted hover:bg-zinc-50"
              >
                View admin dashboard
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
