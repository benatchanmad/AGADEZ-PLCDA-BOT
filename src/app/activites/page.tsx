"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { ShieldCheck, Lock, Search, Filter, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ActivitiesPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = logs.filter(
    (l) =>
      !search ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      (l.details && l.details.toLowerCase().includes(search.toLowerCase())) ||
      (l.user?.name && l.user.name.toLowerCase().includes(search.toLowerCase())) ||
      (l.report?.trackingCode && l.report.trackingCode.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Journal d&apos;audit & Traçabilité des actions
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Inaltérable
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Enregistrement sécurisé de l&apos;ensemble des connexions, affectations, vérifications et publications
          </p>
        </div>

        {/* Search */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrer le journal par action, utilisateur, référence de rumeur..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 pl-6 pr-3">Action Système</th>
                  <th className="px-3 py-3.5">Auteur</th>
                  <th className="px-3 py-3.5">Détails de l&apos;opération</th>
                  <th className="px-3 py-3.5">Signalement</th>
                  <th className="px-3 py-3.5">Adresse IP</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Date & Heure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Chargement du journal d&apos;audit...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Aucune activité enregistrée.
                    </td>
                  </tr>
                ) : (
                  filtered.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 pl-6 pr-3 whitespace-nowrap font-bold text-slate-800">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px]">
                          {log.action}
                        </span>
                      </td>

                      <td className="px-3 py-3.5 whitespace-nowrap font-medium text-slate-900">
                        {log.user?.name || "Système automatique"}
                        {log.user?.role && (
                          <span className="block text-[10px] text-slate-400">{log.user.role}</span>
                        )}
                      </td>

                      <td className="px-3 py-3.5 max-w-sm sm:max-w-md text-slate-600 leading-snug">
                        {log.details || "-"}
                      </td>

                      <td className="px-3 py-3.5 whitespace-nowrap font-mono text-[11px] font-semibold text-emerald-800">
                        {log.report?.trackingCode || "-"}
                      </td>

                      <td className="px-3 py-3.5 whitespace-nowrap font-mono text-[10px] text-slate-400">
                        {log.ipAddress || "127.0.0.1"}
                      </td>

                      <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap text-slate-400 text-[11px]">
                        {formatDate(log.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
