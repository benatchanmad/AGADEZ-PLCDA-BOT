"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  MessageCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Filter,
  MessageSquareCode,
  Radio,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { formatDate, maskPhoneNumber } from "@/lib/utils";

export default function WhatsAppLogsPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [totalInbound, setTotalInbound] = useState(0);
  const [totalOutbound, setTotalOutbound] = useState(0);
  const [loading, setLoading] = useState(true);
  const [directionFilter, setDirectionFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/whatsapp/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setTotalInbound(data.totalInbound || 0);
        setTotalOutbound(data.totalOutbound || 0);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const filtered = messages.filter((m) => {
    const matchDir = directionFilter === "ALL" || m.direction === directionFilter;
    const matchSearch =
      !search ||
      (m.body && m.body.toLowerCase().includes(search.toLowerCase())) ||
      m.phoneNumber.includes(search);
    return matchDir && matchSearch;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Journal des échanges WhatsApp Business
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                {messages.length} messages
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Traçabilité complète des interactions automatisées et signalements entrants via Meta Cloud API
            </p>
          </div>

          <Link
            href="/simulateur-whatsapp"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-colors"
          >
            <MessageSquareCode className="h-4 w-4" />
            Ouvrir le simulateur interactif
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold">Total messages échangés</span>
              <p className="text-2xl font-black text-slate-900">{totalInbound + totalOutbound}</p>
            </div>
            <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
              <MessageCircle className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-800 font-semibold">Messages entrants (Citoyens)</span>
              <p className="text-2xl font-black text-blue-900">{totalInbound}</p>
            </div>
            <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-800 font-semibold">Réponses & Alertes (Bot PLCDA)</span>
              <p className="text-2xl font-black text-emerald-900">{totalOutbound}</p>
            </div>
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher dans le texte des messages..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
            <button
              onClick={() => setDirectionFilter("ALL")}
              className={`rounded-xl px-3 py-1.5 font-semibold transition-colors ${
                directionFilter === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setDirectionFilter("INBOUND")}
              className={`rounded-xl px-3 py-1.5 font-semibold transition-colors ${
                directionFilter === "INBOUND"
                  ? "bg-blue-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Entrants (Citoyens)
            </button>
            <button
              onClick={() => setDirectionFilter("OUTBOUND")}
              className={`rounded-xl px-3 py-1.5 font-semibold transition-colors ${
                directionFilter === "OUTBOUND"
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Sortants (Bot)
            </button>
          </div>
        </div>

        {/* Messages List Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 pl-6 pr-3">Sens</th>
                  <th className="px-3 py-3.5">Expéditeur / Destinataire</th>
                  <th className="px-3 py-3.5">Contenu du message</th>
                  <th className="px-3 py-3.5">Statut</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Date & Heure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Chargement de l&apos;historique WhatsApp...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Aucun message trouvé.
                    </td>
                  </tr>
                ) : (
                  filtered.map((msg) => {
                    const isInbound = msg.direction === "INBOUND";

                    return (
                      <tr key={msg.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 pl-6 pr-3 whitespace-nowrap">
                          {isInbound ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                              <ArrowDownLeft className="h-3 w-3" /> Entrant
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                              <ArrowUpRight className="h-3 w-3" /> Réponse Bot
                            </span>
                          )}
                        </td>

                        <td className="px-3 py-3.5 whitespace-nowrap font-mono text-slate-700">
                          {maskPhoneNumber(msg.phoneNumber)}
                        </td>

                        <td className="px-3 py-3.5 max-w-md sm:max-w-xl text-slate-800 font-medium">
                          <p className="line-clamp-2 leading-relaxed whitespace-pre-wrap">
                            {msg.body}
                          </p>
                          {msg.mediaUrl && (
                            <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.2 text-[9px] text-slate-500 font-semibold">
                              [Média joint]
                            </span>
                          )}
                        </td>

                        <td className="px-3 py-3.5 whitespace-nowrap text-[11px] text-slate-500">
                          <span className="rounded bg-slate-100 px-2 py-0.5 uppercase font-semibold text-[9px]">
                            {msg.status}
                          </span>
                        </td>

                        <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap text-slate-400 text-[11px]">
                          {formatDate(msg.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
