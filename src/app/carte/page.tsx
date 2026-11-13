"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  MapPin,
  Shield,
  Filter,
  Eye,
  AlertTriangle,
  Layers,
  Info,
  Calendar,
} from "lucide-react";
import { formatDate, STATUS_CONFIG, PRIORITY_CONFIG } from "@/lib/utils";

interface LocalityPin {
  id: string;
  name: string;
  department: string;
  lat: number;
  lng: number;
  xPercent: number; // For clean interactive SVG map representation of Agadez
  yPercent: number;
  reportsCount: number;
  reports: any[];
}

export default function CartePage() {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedLocality, setSelectedLocality] = useState<LocalityPin | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  // Coordonnées et repères réels des principales communes et départements de la région d'Agadez
  const localities: LocalityPin[] = [
    {
      id: "agadez",
      name: "Agadez Ville",
      department: "Commune Urbaine d'Agadez",
      lat: 16.9738,
      lng: 7.9908,
      xPercent: 38,
      yPercent: 62,
      reportsCount: reports.filter((r) => r.locality?.includes("Agadez")).length,
      reports: reports.filter((r) => r.locality?.includes("Agadez")),
    },
    {
      id: "arlit",
      name: "Arlit",
      department: "Département d'Arlit",
      lat: 18.7369,
      lng: 7.3853,
      xPercent: 32,
      yPercent: 32,
      reportsCount: reports.filter((r) => r.locality?.includes("Arlit")).length,
      reports: reports.filter((r) => r.locality?.includes("Arlit")),
    },
    {
      id: "tchirozerine",
      name: "Tchirozérine",
      department: "Département de Tchirozérine",
      lat: 17.2581,
      lng: 7.7617,
      xPercent: 36,
      yPercent: 54,
      reportsCount: reports.filter((r) => r.locality?.includes("Tchirozérine") || r.locality?.includes("Anou Araren")).length,
      reports: reports.filter((r) => r.locality?.includes("Tchirozérine") || r.locality?.includes("Anou Araren")),
    },
    {
      id: "bilma",
      name: "Bilma / Djado",
      department: "Département de Bilma (Grand Ténéré)",
      lat: 18.6853,
      lng: 12.9164,
      xPercent: 78,
      yPercent: 42,
      reportsCount: reports.filter((r) => r.locality?.includes("Bilma") || r.locality?.includes("Djado")).length,
      reports: reports.filter((r) => r.locality?.includes("Bilma") || r.locality?.includes("Djado")),
    },
    {
      id: "ingall",
      name: "Ingall",
      department: "Département d'Ingall",
      lat: 16.7889,
      lng: 6.9328,
      xPercent: 25,
      yPercent: 68,
      reportsCount: reports.filter((r) => r.locality?.includes("Ingall")).length,
      reports: reports.filter((r) => r.locality?.includes("Ingall")),
    },
    {
      id: "iferouane",
      name: "Iferouane / Timia",
      department: "Département d'Iferouane (Massif de l'Aïr)",
      lat: 19.0583,
      lng: 8.4167,
      xPercent: 44,
      yPercent: 24,
      reportsCount: reports.filter((r) => r.locality?.includes("Iferouane") || r.locality?.includes("Aïr")).length,
      reports: reports.filter((r) => r.locality?.includes("Iferouane") || r.locality?.includes("Aïr")),
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Carte géographique interactive des signalements
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                Région d&apos;Agadez
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Cartographie des rumeurs agrégées par commune pour préserver l&apos;anonymat des citoyens
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Filtrer par statut :</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white p-2 font-semibold text-slate-800 focus:outline-none"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="EN ATTENTE">En attente</option>
              <option value="EN COURS DE VÉRIFICATION">En cours</option>
              <option value="CONFIRMÉE">Confirmée</option>
              <option value="FAUSSE">Fausse (Infox)</option>
            </select>
          </div>
        </div>

        {/* Map and Details layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Geographic Map View */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-xl relative overflow-hidden min-h-[500px] flex flex-col justify-between">
            {/* Top Bar with compass & legend */}
            <div className="flex items-center justify-between z-10 text-white">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                  Région d&apos;Agadez &bull; Massif de l&apos;Aïr & Ténéré
                </span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                Superficie : 667 799 km²
              </span>
            </div>

            {/* Interactive SVG Contour Map of Agadez Region */}
            <div className="relative w-full h-96 my-auto">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-[0_0_25px_rgba(16,185,129,0.15)] opacity-90"
              >
                {/* Region stylized polygon outline */}
                <polygon
                  points="20,15 50,8 85,20 95,60 75,85 45,90 20,80 15,40"
                  fill="#064e3b"
                  fillOpacity="0.4"
                  stroke="#10b981"
                  strokeWidth="0.8"
                  strokeDasharray="2,1"
                />
                {/* Aïr Mountains relief contour */}
                <circle cx="40" cy="40" r="14" fill="#047857" fillOpacity="0.3" stroke="#34d399" strokeWidth="0.4" />
                {/* Ténéré Desert boundary */}
                <path d="M 55,20 Q 75,45 80,75" fill="none" stroke="#ea580c" strokeWidth="0.5" strokeDasharray="1,1" />
              </svg>

              {/* Interactive Locality Markers */}
              {localities.map((loc) => {
                const isSelected = selectedLocality?.id === loc.id;
                const hasReports = loc.reportsCount > 0;

                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocality(loc)}
                    style={{ left: `${loc.xPercent}%`, top: `${loc.yPercent}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform duration-200 ${
                      isSelected ? "scale-125 z-30" : "hover:scale-115 z-20"
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      {hasReports && (
                        <span className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping opacity-75" />
                      )}
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${
                          isSelected
                            ? "bg-amber-400 border-white text-slate-950 font-black"
                            : hasReports
                            ? "bg-emerald-600 border-emerald-300 text-white font-bold"
                            : "bg-slate-700 border-slate-500 text-slate-300 font-normal"
                        }`}
                      >
                        <span className="text-[11px]">{loc.reportsCount}</span>
                      </div>
                    </div>

                    <span
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 rounded-md px-1.5 py-0.5 text-[10px] whitespace-nowrap font-bold shadow-md transition-all ${
                        isSelected
                          ? "bg-amber-400 text-slate-950"
                          : "bg-slate-900/90 text-slate-200 border border-slate-700 group-hover:text-white"
                      }`}
                    >
                      {loc.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Map Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 z-10 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Rumeurs traitées
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  Zone sélectionnée
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                  Zone calme
                </span>
              </div>
              <span>Cliquez sur une commune pour afficher les détails</span>
            </div>
          </div>

          {/* Right Panel: Selected Zone Details */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            {selectedLocality ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {selectedLocality.department}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      {selectedLocality.name}
                    </h3>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    {selectedLocality.reportsCount} signalement{selectedLocality.reportsCount > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto">
                  {selectedLocality.reports.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">
                      Aucun signalement actif répertorié dans cette localité.
                    </p>
                  ) : (
                    selectedLocality.reports.map((r: any) => {
                      const statusStyle =
                        STATUS_CONFIG[r.status] || STATUS_CONFIG["EN ATTENTE"];

                      return (
                        <div
                          key={r.id}
                          className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-slate-700">
                              {r.trackingCode}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.2 text-[9px] font-bold border ${statusStyle.badge}`}
                            >
                              {statusStyle.label}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-2">
                            {r.title}
                          </h4>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                            <span>{formatDate(r.createdAt, false)}</span>
                            <Link
                              href={`/signalements/${r.id}`}
                              className="font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
                            >
                              Voir <Eye className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <MapPin className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Sélectionnez une zone sur la carte
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Cliquez sur un marqueur (Agadez Ville, Arlit, Tchirozérine, Bilma, Ingall, Iferouane)
                  pour inspecter les rumeurs actives et leur statut d&apos;enquête.
                </p>
              </div>
            )}

            {/* Privacy note */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-400">
              <Shield className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>
                Conformité : Agrégation communale sans traçage GPS individuel des citoyens.
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
