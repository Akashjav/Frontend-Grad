import { useEffect, useRef, useState } from "react";
import { API_URL, getToken } from "../../../lib/api";
import { perform } from "../../../lib/platformApi";
import { useAuth } from "../../AuthContext";
import { control, primary } from "./Fields";

export default function LiveConversation({ conversationId }: { conversationId: number }) {
  const { user } = useAuth(); const [messages, setMessages] = useState<any[]>([]); const [body, setBody] = useState("");
  const [error, setError] = useState(""); const [status, setStatus] = useState("Connecting…"); const [busy, setBusy] = useState(false);
  const socket = useRef<WebSocket | null>(null); const active = useRef(false);
  const [olderBusy, setOlderBusy] = useState(false); const [hasOlder, setHasOlder] = useState(true);
  useEffect(() => {
    active.current = true; const controller = new AbortController(); let polling: ReturnType<typeof setInterval> | undefined;
    setMessages([]); setError(""); setStatus("Connecting…");
    const merge = (incoming: any[]) => setMessages(current => [...new Map([...current, ...incoming].map(m => [m.id, m])).values()].sort((a, b) => a.id - b.id));
    const reload = () => perform("GET /api/v1/conversations/{conversation_id}/messages", { conversation_id: conversationId }, undefined, controller.signal).then(data => { if (!controller.signal.aborted) merge(data); }).catch(e => { if (!controller.signal.aborted) setError(e.message); });
    void reload();
    void perform("POST /api/v1/conversations/{conversation_id}/read", { conversation_id: conversationId }, undefined, controller.signal).catch(() => {});
    const url = new URL(API_URL); url.protocol = url.protocol === "https:" ? "wss:" : "ws:"; url.pathname = `${url.pathname.replace(/\/$/, "")}/api/v1/ws/conversations/${conversationId}`;
    const ws = new WebSocket(url); socket.current = ws;
    ws.onopen = () => { if (!controller.signal.aborted) { ws.send(JSON.stringify({ token: getToken() })); setStatus("Connected"); } };
    ws.onmessage = event => { if (controller.signal.aborted) return; try { const message = JSON.parse(event.data); if (message.type === "message") merge([message]); if (message.type === "error") setError(message.detail); } catch { setError("A message could not be read. Refresh the conversation."); } };
    ws.onclose = () => { if (!controller.signal.aborted) { setStatus("Live connection unavailable; checking for updates every 5 seconds."); polling = setInterval(reload, 5000); } };
    return () => { active.current = false; controller.abort(); if (polling) clearInterval(polling); ws.close(); socket.current = null; };
  }, [conversationId, user?.id]);
  async function send() {
    if (!body.trim()) return; setBusy(true); setError("");
    try {
      // REST acknowledges persistence; the socket delivers new messages to peers.
      await perform("POST /api/v1/conversations/{conversation_id}/messages", { conversation_id: conversationId }, { body: body.trim() });
      const latest = await perform("GET /api/v1/conversations/{conversation_id}/messages", { conversation_id: conversationId });
      if (active.current) { setMessages(current => [...new Map([...current, ...latest].map(m => [m.id, m])).values()].sort((a, b) => a.id - b.id)); setBody(""); }
    } catch (e) { if (active.current) setError(e instanceof Error ? e.message : "Message was not sent."); }
    finally { if (active.current) setBusy(false); }
  }
  async function loadOlder() {
    if (!messages.length) return;
    setOlderBusy(true);
    try {
      const older = await perform("GET /api/v1/conversations/{conversation_id}/messages", { conversation_id: conversationId, before_id: messages[0].id, limit: 100 });
      if (active.current) { setMessages(current => [...new Map([...older, ...current].map(m => [m.id, m])).values()].sort((a, b) => a.id - b.id)); setHasOlder(older.length === 100); }
    } catch (e) { if (active.current) setError(e instanceof Error ? e.message : "Could not load older messages."); }
    finally { if (active.current) setOlderBusy(false); }
  }
  return <section className="bg-white border rounded-2xl p-6 space-y-4"><h2 className="font-semibold text-lg">Conversation</h2><p role="status" className="text-xs text-slate-500">{status}</p>{error && <p role="alert" className="text-red-700">{error}</p>}
    {hasOlder && messages.length > 0 && <button className={primary} disabled={olderBusy} onClick={() => void loadOlder()}>{olderBusy ? "Loading…" : "Load older messages"}</button>}
    <div role="log" aria-live="polite" aria-label="Conversation messages" className="max-h-96 overflow-y-auto space-y-3">{!messages.length && <p className="text-slate-500">No messages yet.</p>}{messages.map(message => <article key={message.id} className={`rounded-xl p-3 ${message.author_id === user?.id ? "bg-blue-50 ml-8" : "bg-slate-100 mr-8"}`}><p className="text-xs text-slate-500">{message.author_id === user?.id ? "You" : "Participant"}</p><p className="whitespace-pre-wrap break-words">{message.body}</p><time className="text-xs text-slate-500">{message.created_at}</time></article>)}</div>
    <form onSubmit={e => { e.preventDefault(); void send(); }} className="space-y-3"><label className="block text-sm">Message<textarea className={control} required maxLength={4000} value={body} onChange={e => setBody(e.target.value)} /></label><button className={primary} disabled={busy || !body.trim()}>{busy ? "Sending…" : "Send message"}</button></form>
  </section>;
}
