import { useState, FormEvent, useRef } from 'react';

export default function App() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamMode, setStreamMode] = useState(true);
  const eventSourceRef = useRef<EventSource | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Nettoyage d'un éventuel stream précédent
    eventSourceRef.current?.close();

    setLoading(true);
    setReply('');

    if (streamMode) {
      const url = `http://localhost:3000/ask/stream?message=${encodeURIComponent(message)}`;
      const evt = new EventSource(url);
      eventSourceRef.current = evt;

      evt.onmessage = (e) => {
        setReply((prev) => prev + e.data);
      };

      evt.onerror = () => {
        evt.close();
        setLoading(false);
      };
    } else {
      // --- Mode POST classique ---
      try {
        const res = await fetch('http://localhost:3000/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });
        const data = await res.json();
        setReply(data.reply);
      } catch (err) {
        setReply(`Erreur : ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-2">Claude Pocket — Phase 0</h1>
      <label className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
        <input
          type="checkbox"
          checked={streamMode}
          onChange={(e) => setStreamMode(e.target.checked)}
        />
        Mode streaming (SSE)
      </label>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Pose ta question à Claude…"
          rows={3}
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-zinc-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed transition"
        >
          {loading ? '…' : 'Envoyer'}
        </button>
      </form>

      {reply && (
        <div className="w-full max-w-2xl mt-6 p-4 rounded-lg bg-zinc-800 whitespace-pre-wrap">
          {reply}
        </div>
      )}
    </div>
  );
}
