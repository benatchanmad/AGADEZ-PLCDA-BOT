"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSearch,
  ArrowRight,
  ShieldAlert,
  Search,
  Filter,
} from "lucide-react";
import { formatDate, STATUS_CONFIG, VERIFICATION_STEPS } from "@/lib/utils";

export default function VerificationsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stepFilter, setStepFilter] = useState("ALL");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reports");
      if (res.ok) {
        const data = await res.json();
        // Filtrer les rapports pertinents pour l'espace de vérification (Étape >= 3 ou en attente)
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (stepFilter === "PENDING_VERIF") return r.verificationStep >= 3 && r.verificationStep <= 5;
    if (stepFilter === "PENDING_APPROVAL") return r.verificationStep === 6;
    if (stepFilter === "PUBLISHED") return r.verificationStep === 7;
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Espace Enquêtes & Vérifications de Terrain
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Pilotage des investigations auprès des autorités régionales d&apos;Agadez et validation
            contradictoire des faits
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setStepFilter("ALL")}
            className={`rounded-xl px-4 py-2 font-semibold transition-colors ${
              stepFilter === "ALL"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Tous les dossiers ({reports.length})
          </button>
          <button
            onClick={() => setStepFilter("PENDING_VERIF")}
            className={`rounded-xl px-4 py-2 font-semibold transition-colors ${
              stepFilter === "PENDING_VERIF"
                ? "bg-blue-700 text-white"
                : "bg-white text-blue-800 border border-blue-200 hover:bg-blue-50"
            }`}
          >
            Enquêtes terrain en cours (Étapes 3-5)
          </button>
          <button
            onClick={() => setStepFilter("PENDING_APPROVAL")}
            className={`rounded-xl px-4 py-2 font-semibold transition-colors ${
              stepFilter === "PENDING_APPROVAL"
                ? "bg-amber-600 text-white"
                : "bg-white text-amber-800 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            En attente de validation (Étape 6)
          </button>
          <button
            onClick={() => setStepFilter("PUBLISHED")}
            className={`rounded-xl px-4 py-2 font-semibold transition-colors ${
              stepFilter === "PUBLISHED"
                ? "bg-emerald-700 text-white"
                : "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            Résultats validés & Publiés (Étape 7)
          </button>
        </div>

        {/* Verification Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 py-12 text-center text-slate-400">
              Chargement des dossiers d&apos;enquête...
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-slate-400">
              Aucun dossier ne correspond à ce filtre.
            </div>
          ) : (
            filteredReports.map((report) => {
              const statusStyle =
                STATUS_CONFIG[report.status] || STATUS_CONFIG["EN ATTENTE"];
              const currentStepInfo =
                VERIFICATION_STEPS.find((s) => s.step === report.verificationStep) ||
                VERIFICATION_STEPS[0];
              const verifier = report.assignments?.[0]?.user?.name || "Non assigné";

              return (
                <div
                  key={report.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-slate-900">
                        {report.trackingCode}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${statusStyle.badge}`}
                      >
                        {statusStyle.label}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {report.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-lg">
                      {report.description}
                    </p>

                    {/* Stepper indicator */}
                    <div className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-800">
                          Étape {report.verificationStep} sur 7 :
                        </span>
                        <p className="font-bold text-slate-900">{currentStepInfo.title}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Resp: {currentStepInfo.role}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>Vérificateur : <strong>{verifier}</strong></span>
                      <span>{formatDate(report.createdAt, false)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                    <Link
                      href={`/signalements/${report.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                    >
                      <span>Traiter le dossier</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
