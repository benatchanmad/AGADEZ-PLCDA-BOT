"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  Inbox,
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { formatDate, STATUS_CONFIG, PRIORITY_CONFIG } from "@/lib/utils";

interface ReportItem {
  id: string;
  trackingCode: string;
  title: string;
  description: string;
  channel: string;
  status: string;
  verificationStep: number;
  urgency: string;
  locality?: string | null;
  createdAt: string;
  category?: { id: string; name: string; color: string } | null;
  citizen?: { maskedPhone: string; locality?: string | null } | null;
  assignments?: Array<{
    user: { id: string; name: string; role: string };
  }>;
}

export default function SignalementsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedUrgency, setSelectedUrgency] = useState("ALL");
  const [selectedLocality, setSelectedLocality] = useState("ALL");

  useEffect(() => {
    fetchReports();
    fetchCategories();
  }, [selectedCategory, selectedStatus, selectedUrgency, selectedLocality]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch {
      // ignore
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCategory !== "ALL") params.set("category", selectedCategory);
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);
      if (selectedUrgency !== "ALL") params.set("urgency", selectedUrgency);
      if (selectedLocality !== "ALL") params.set("locality", selectedLocality);

      const res = await fetch(`/api/reports?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports();
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("ALL");
    setSelectedStatus("ALL");
    setSelectedUrgency("ALL");
    setSelectedLocality("ALL");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Gestion des signalements
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                {reports.length}
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Flux des rumeurs citoyennes reçues via WhatsApp ou portail et suivi du traitement
            </p>
          </div>

          <Link
            href="/signalements/nouveau"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Nouveau signalement manuel
          </Link>
        </div>

        {/* Filters Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par référence (PLCDA-2026-XXXX), mots-clés de la rumeur..."
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Rechercher
            </button>
            <button
              type="button"
              onClick={resetFilters}
              title="Réinitialiser"
              className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </form>

          {/* Filter dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-100 text-xs">
            {/* Status */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Statut
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-slate-700 focus:border-emerald-600 focus:outline-none"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="EN ATTENTE">En attente</option>
                <option value="EN COURS DE VÉRIFICATION">En cours de vérification</option>
                <option value="CONFIRMÉE">Confirmée (Vraie)</option>
                <option value="FAUSSE">Fausse (Infox)</option>
                <option value="PARTIELLEMENT VRAIE">Partiellement vraie</option>
                <option value="NON VÉRIFIABLE">Non vérifiable</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-slate-700 focus:border-emerald-600 focus:outline-none"
              >
                <option value="ALL">Toutes les catégories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Priorité
              </label>
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-slate-700 focus:border-emerald-600 focus:outline-none"
              >
                <option value="ALL">Toutes priorités</option>
                <option value="CRITIQUE">Critique</option>
                <option value="ÉLEVÉE">Élevée</option>
                <option value="MOYENNE">Moyenne</option>
                <option value="FAIBLE">Faible</option>
              </select>
            </div>

            {/* Locality */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Zone géographique
              </label>
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-slate-700 focus:border-emerald-600 focus:outline-none"
              >
                <option value="ALL">Toute la région</option>
                <option value="Agadez">Agadez Ville</option>
                <option value="Arlit">Arlit</option>
                <option value="Tchirozérine">Tchirozérine</option>
                <option value="Bilma">Bilma / Djado</option>
                <option value="Ingall">Ingall</option>
                <option value="Iferouane">Iferouane / Timia</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Table Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 pl-6 pr-3">Référence</th>
                  <th className="px-3 py-3.5">Rumeur / Sujet</th>
                  <th className="px-3 py-3.5">Catégorie</th>
                  <th className="px-3 py-3.5">Statut actuel</th>
                  <th className="px-3 py-3.5">Workflow (7 Ét.)</th>
                  <th className="px-3 py-3.5">Vérificateur assigné</th>
                  <th className="px-3 py-3.5">Date</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Chargement des signalements...
                    </td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Aucun signalement ne correspond à vos filtres.
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => {
                    const statusStyle =
                      STATUS_CONFIG[report.status] || STATUS_CONFIG["EN ATTENTE"];
                    const priorityStyle =
                      PRIORITY_CONFIG[report.urgency] || PRIORITY_CONFIG["MOYENNE"];
                    const verifierName =
                      report.assignments?.[0]?.user?.name || "Non assigné";

                    return (
                      <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Reference */}
                        <td className="py-3.5 pl-6 pr-3 font-mono font-bold text-slate-900">
                          <Link
                            href={`/signalements/${report.id}`}
                            className="hover:text-emerald-700 hover:underline"
                          >
                            {report.trackingCode}
                          </Link>
                          <div className="text-[10px] font-sans font-normal text-slate-400">
                            {report.channel}
                          </div>
                        </td>

                        {/* Title & locality */}
                        <td className="px-3 py-3.5 max-w-xs sm:max-w-md">
                          <Link
                            href={`/signalements/${report.id}`}
                            className="font-semibold text-slate-800 hover:text-emerald-700 line-clamp-1"
                          >
                            {report.title}
                          </Link>
                          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400">
                            {report.locality && (
                              <span className="flex items-center gap-0.5">
                                <MapPin className="h-3 w-3" />
                                {report.locality}
                              </span>
                            )}
                            <span
                              className={`rounded px-1.5 py-0.2 text-[9px] border font-medium ${priorityStyle.badge}`}
                            >
                              {priorityStyle.label}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          {report.category ? (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                              {report.category.name}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${statusStyle.badge}`}
                          >
                            {statusStyle.label}
                          </span>
                        </td>

                        {/* Verification step (1 to 7) */}
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
                              {report.verificationStep}
                            </div>
                            <span className="text-[11px] text-slate-600 font-medium">
                              Étape {report.verificationStep}/7
                            </span>
                          </div>
                        </td>

                        {/* Verifier */}
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <span
                            className={`text-xs ${
                              verifierName === "Non assigné"
                                ? "text-amber-600 font-medium italic"
                                : "text-slate-700 font-semibold"
                            }`}
                          >
                            {verifierName}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-3 py-3.5 whitespace-nowrap text-[11px] text-slate-500">
                          {formatDate(report.createdAt, false)}
                        </td>

                        {/* Action */}
                        <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                          <Link
                            href={`/signalements/${report.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:border-emerald-600 hover:text-emerald-700 transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Traiter</span>
                          </Link>
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
