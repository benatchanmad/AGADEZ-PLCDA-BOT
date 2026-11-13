"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  Megaphone,
  PlusCircle,
  Send,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Calendar,
  Share2,
  Users,
  ShieldAlert,
} from "lucide-react";
import { formatDate, STATUS_CONFIG, PRIORITY_CONFIG } from "@/lib/utils";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [confirmModalAlert, setConfirmModalAlert] = useState<any | null>(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/alerts");
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (alertId: string) => {
    setPublishingId(alertId);
    try {
      const res = await fetch(`/api/alerts/${alertId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ broadcastWhatsApp: true }),
      });
      if (res.ok) {
        await fetchAlerts();
        setConfirmModalAlert(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Gestion des alertes publiques officielles
              </h1>
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-800">
                {alerts.length}
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Publication institutionnelle, démentis officiels et diffusion citoyenne multicanale
            </p>
          </div>

          <Link
            href="/alertes/creer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Créer une alerte
          </Link>
        </div>

        {/* Alerts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {loading ? (
            <div className="col-span-2 py-12 text-center text-slate-400">
              Chargement des alertes officielles...
            </div>
          ) : alerts.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-slate-400">
              Aucune alerte enregistrée.
            </div>
          ) : (
            alerts.map((alert) => {
              const statusStyle =
                STATUS_CONFIG[alert.verdict] || STATUS_CONFIG["FAUSSE"];
              const priorityStyle =
                PRIORITY_CONFIG[alert.priority] || PRIORITY_CONFIG["MOYENNE"];

              return (
                <div
                  key={alert.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${statusStyle.badge}`}
                      >
                        {statusStyle.label}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-semibold border ${priorityStyle.badge}`}
                      >
                        Priorité {priorityStyle.label}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {alert.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {alert.description}
                    </p>

                    <div className="rounded-xl bg-emerald-50/60 p-3 border border-emerald-200 text-xs">
                      <span className="font-bold text-emerald-900 block text-[10px] uppercase">
                        Clarification factuelle vérifiée :
                      </span>
                      <p className="mt-1 text-slate-800 line-clamp-2">
                        {alert.factCheckContent}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span>Sources : {alert.sourcesUsed || "PLCDA Agadez"}</span>
                      <span>
                        {alert.publishedAt ? formatDate(alert.publishedAt, false) : "Brouillon"}
                      </span>
                    </div>

                    {alert.broadcastWhatsApp && (
                      <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium">
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Diffusé à {alert.broadcastCount} citoyens via WhatsApp</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase rounded-md px-2 py-0.5 ${
                        alert.status === "PUBLISHED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {alert.status === "PUBLISHED" ? "✓ Publié en ligne" : "Brouillon"}
                    </span>

                    {alert.status !== "PUBLISHED" ? (
                      <button
                        onClick={() => setConfirmModalAlert(alert)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Publier & Diffuser
                      </button>
                    ) : (
                      <Link
                        href={`/publications`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Voir sur le portail citoyen
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Confirmation Modal before Public Alert Broadcast */}
        {confirmModalAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center gap-2 text-orange-700 font-bold text-sm mb-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Confirmation de publication officielle</span>
              </div>

              <h4 className="text-base font-bold text-slate-900 mt-2">
                {confirmModalAlert.title}
              </h4>

              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Êtes-vous sûr(e) de vouloir publier cette alerte ? Cette action est immédiate,
                rend l&apos;information visible sur le portail public citoyen et lance la diffusion
                automatique par WhatsApp aux citoyens d&apos;Agadez.
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs text-slate-700 space-y-1">
                <p>
                  <strong>Verdict :</strong> {confirmModalAlert.verdict}
                </p>
                <p>
                  <strong>Diffusion WhatsApp :</strong> Oui (Message automatisé)
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setConfirmModalAlert(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handlePublish(confirmModalAlert.id)}
                  disabled={publishingId === confirmModalAlert.id}
                  className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-800 disabled:opacity-70 cursor-pointer"
                >
                  {publishingId === confirmModalAlert.id ? "Diffusion en cours..." : "Confirmer et Diffuser"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
