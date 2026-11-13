"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Megaphone,
  Printer,
  Shield,
  Filter,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ReportsPage() {
  const [period, setPeriod] = useState("MONTH"); // DAY | WEEK | MONTH | YEAR
  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
      const resReports = await fetch("/api/reports");
      if (resReports.ok) {
        const dataReports = await resReports.json();
        setReports(dataReports.reports || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    window.open("/api/reports/export?format=csv", "_blank");
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const periodLabel = {
    DAY: "Rapport Journalier de Veille (24h)",
    WEEK: "Rapport Hebdomadaire d'Analyse (7 jours)",
    MONTH: "Rapport Mensuel Institutionnel PLCDA",
    YEAR: "Bilan Annuel Régional de la Vérité Factuelle",
  }[period];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header & Export CTAs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Rapports & Statistiques Régionales
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Génération des bilans périodiques d&apos;impact et exportations certifiées en PDF et Excel
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
              <span>Exporter Excel (CSV)</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimer / Exporter PDF</span>
            </button>
          </div>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-3 text-xs">
          {[
            { id: "DAY", label: "Journalier" },
            { id: "WEEK", label: "Hebdomadaire" },
            { id: "MONTH", label: "Mensuel" },
            { id: "YEAR", label: "Annuel" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id)}
              className={`rounded-xl px-4 py-2 font-semibold transition-colors ${
                period === tab.id
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Formal Printable Report Document Canvas */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Official Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-emerald-700 pb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-800 text-white shadow-md">
                <Shield className="h-8 w-8 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  RÉPUBLIQUE DU NIGER &bull; RÉGION D&apos;AGADEZ
                </h2>
                <p className="text-xs font-bold text-emerald-800">
                  Plateforme Locale de Concertation, de Dialogue et d&apos;Action (PLCDA)
                </p>
                <p className="text-[11px] text-slate-500">
                  Cellule Régionale de Veille, d&apos;Alerte Précoce et de Vérité Factuelle
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500">
              <span className="font-bold text-slate-900 block">{periodLabel}</span>
              <span>Généré le : {formatDate(new Date())}</span>
              <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                Réf : PLCDA-RAPPORT-{period}-{Date.now().toString().slice(-4)}
              </p>
            </div>
          </div>

          {/* Key Executive KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-center">
              <span className="text-[11px] font-bold uppercase text-slate-500">
                Rumeurs Reçues
              </span>
              <p className="text-3xl font-black text-slate-900 mt-1">
                {stats?.stats.totalReports || 0}
              </p>
              <span className="text-[10px] text-slate-400 font-medium">100% traitées</span>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200 text-center">
              <span className="text-[11px] font-bold uppercase text-emerald-800">
                Informations Vérifiées
              </span>
              <p className="text-3xl font-black text-emerald-900 mt-1">
                {(stats?.stats.confirmedReports || 0) + (stats?.stats.falseReports || 0)}
              </p>
              <span className="text-[10px] text-emerald-700 font-medium">Enquêtes certifiées</span>
            </div>

            <div className="rounded-2xl bg-rose-50 p-4 border border-rose-200 text-center">
              <span className="text-[11px] font-bold uppercase text-rose-800">
                Infox Démantelées
              </span>
              <p className="text-3xl font-black text-rose-900 mt-1">
                {stats?.stats.falseReports || 0}
              </p>
              <span className="text-[10px] text-rose-700 font-medium">Démentis officiels</span>
            </div>

            <div className="rounded-2xl bg-orange-50 p-4 border border-orange-200 text-center">
              <span className="text-[11px] font-bold uppercase text-orange-800">
                Alertes Diffusées
              </span>
              <p className="text-3xl font-black text-orange-900 mt-1">
                {stats?.stats.publishedAlerts || 0}
              </p>
              <span className="text-[10px] text-orange-700 font-medium">Via WhatsApp</span>
            </div>
          </div>

          {/* Category Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Répartition sectorielle des signalements enregistrés
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[10px] text-slate-500">
                  <tr>
                    <th className="p-3 pl-4">Thématique</th>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Proportion</th>
                    <th className="p-3 pr-4">Niveau d&apos;impact régional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {!stats?.categoryDistribution || stats.categoryDistribution.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-400">
                        Aucune donnée catégorielle enregistrée.
                      </td>
                    </tr>
                  ) : (
                    stats.categoryDistribution.map((cat: any, idx: number) => {
                      const total = stats.stats.totalReports || 1;
                      const pct = stats.stats.totalReports ? Math.round((cat.count / total) * 100) : 0;

                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 pl-4 font-semibold text-slate-800">{cat.name}</td>
                          <td className="p-3 font-bold text-slate-900">{cat.count}</td>
                          <td className="p-3">{pct}%</td>
                          <td className="p-3 pr-4">
                            <span className="rounded px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600">
                              —
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary table of key rumors treated */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Synthèse des dossiers d&apos;enquête traités
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[10px] text-slate-500">
                  <tr>
                    <th className="p-3 pl-4">Réf.</th>
                    <th className="p-3">Sujet de la rumeur</th>
                    <th className="p-3">Localité</th>
                    <th className="p-3">Verdict Factuel</th>
                    <th className="p-3 pr-4">Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">
                        Aucun dossier d&apos;enquête enregistré pour le moment.
                      </td>
                    </tr>
                  ) : (
                    reports.slice(0, 5).map((r: any) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="p-3 pl-4 font-mono font-bold text-slate-700">
                          {r.trackingCode}
                        </td>
                        <td className="p-3 max-w-xs truncate text-slate-800">{r.title}</td>
                        <td className="p-3 text-slate-600">{r.locality || "Agadez"}</td>
                        <td className="p-3 font-bold text-emerald-800">{r.status}</td>
                        <td className="p-3 pr-4 text-slate-500">
                          Étape {r.verificationStep}/7 &bull; Conforme
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formal Certification stamp and signatures */}
          <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-900">Le Responsable de la Cellule Veille :</p>
              <p className="mt-8 font-semibold text-slate-400">Signature & Cachet</p>
              <p className="text-[10px] text-slate-400">Vérificateur Terrain Habilité</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">Pour la Coordination Régionale PLCDA :</p>
              <p className="mt-8 font-semibold text-slate-400">Signature & Cachet</p>
              <p className="text-[10px] text-slate-400">Superviseur Général PLCDA Agadez</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
