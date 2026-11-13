"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Users,
  Megaphone,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  Shield,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatDate, STATUS_CONFIG, PRIORITY_CONFIG } from "@/lib/utils";

interface StatsData {
  stats: {
    totalReports: number;
    pendingReports: number;
    underVerificationReports: number;
    confirmedReports: number;
    falseReports: number;
    partiallyTrueReports: number;
    unverifiableReports: number;
    totalCitizens: number;
    publishedAlerts: number;
    avgVerificationHours: number;
  };
  categoryDistribution: Array<{ name: string; count: number; color: string }>;
  localityDistribution: Array<{ name: string; count: number }>;
  statusDistribution: Array<{ name: string; count: number; color: string }>;
  dailyEvolution: Array<{ day: string; recues: number; verifiees: number; fausses: number }>;
  recentReports: Array<{
    id: string;
    trackingCode: string;
    title: string;
    status: string;
    urgency: string;
    locality?: string | null;
    createdAt: string;
    category?: { name: string; color: string } | null;
    citizen?: { maskedPhone: string } | null;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 p-6 sm:p-8 text-white shadow-lg">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-200 border border-emerald-500/30 mb-3">
              <Shield className="h-3.5 w-3.5 text-amber-400" />
              <span>Plateforme Locale de Concertation, de Dialogue et d&apos;Action</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tableau de bord de veille régionale d&apos;Agadez
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Supervision en temps réel des signalements de rumeurs citoyennes, pilotage des enquêtes
              de terrain par nos équipes locales et diffusion des alertes factuelles vérifiées.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
            <Shield className="h-80 w-80 text-white" />
          </div>
        </div>

        {/* 8 Statistic Cards */}
        {loading || !data ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. Total signalements */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total signalements</span>
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                  <Inbox className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900">{data.stats.totalReports}</p>
              <span className="mt-1 flex items-center text-[11px] font-medium text-emerald-600">
                <TrendingUp className="mr-1 h-3 w-3" /> WhatsApp & Web
              </span>
            </div>

            {/* 2. En attente */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-800">En attente (Étape 1-2)</span>
                <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black text-amber-900">{data.stats.pendingReports}</p>
              <span className="mt-1 text-[11px] font-medium text-amber-700">
                À affecter aux vérificateurs
              </span>
            </div>

            {/* 3. En cours de vérification */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-800">En cours (Étape 3-5)</span>
                <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black text-blue-900">
                {data.stats.underVerificationReports}
              </p>
              <span className="mt-1 text-[11px] font-medium text-blue-700">
                Enquête terrain en cours
              </span>
            </div>

            {/* 4. Confirmées (Vraies) */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800">Confirmées (Vraies)</span>
                <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black text-emerald-900">
                {data.stats.confirmedReports}
              </p>
              <span className="mt-1 text-[11px] font-medium text-emerald-700">Faits vérifiés</span>
            </div>

            {/* 5. Infox / Fausses */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-800">Infox réfutées</span>
                <div className="rounded-lg bg-rose-100 p-2 text-rose-700">
                  <XCircle className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black text-rose-900">{data.stats.falseReports}</p>
              <span className="mt-1 text-[11px] font-medium text-rose-700">
                Démentis & fact-checking
              </span>
            </div>

            {/* 6. Non vérifiables & Partiellement vraies */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Partielles / Non vérif.</span>
                <div className="rounded-lg bg-purple-50 p-2 text-purple-700">
                  <HelpCircle className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {data.stats.partiallyTrueReports + data.stats.unverifiableReports}
              </p>
              <span className="mt-1 text-[11px] font-medium text-purple-700">
                {data.stats.partiallyTrueReports} partiel. &bull; {data.stats.unverifiableReports} non vérif.
              </span>
            </div>

            {/* 7. Citoyens ayant contacté le bot */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Citoyens enregistrés</span>
                <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900">{data.stats.totalCitizens}</p>
              <span className="mt-1 text-[11px] font-medium text-slate-500">
                Numéros protégés & anonymisés
              </span>
            </div>

            {/* 8. Alertes publiées */}
            <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-4 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-orange-800">Alertes diffusées</span>
                <div className="rounded-lg bg-orange-100 p-2 text-orange-700">
                  <Megaphone className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black text-orange-900">
                {data.stats.publishedAlerts}
              </p>
              <span className="mt-1 text-[11px] font-medium text-orange-700">
                Diffusées via WhatsApp
              </span>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1 : Daily Evolution */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Évolution quotidienne des signalements reçus et vérifiés
                  </h3>
                  <p className="text-xs text-slate-500">Flux d&apos;activité des 7 derniers jours</p>
                </div>
                <span className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                  Temps moyen : {data.stats.avgVerificationHours}h
                </span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.dailyEvolution}>
                    <defs>
                      <linearGradient id="recuesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0c7a3d" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0c7a3d" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="faussesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Area
                      type="monotone"
                      dataKey="recues"
                      name="Rumeurs reçues"
                      stroke="#0c7a3d"
                      fillOpacity={1}
                      fill="url(#recuesGrad)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="fausses"
                      name="Infox confirmées réfutées"
                      stroke="#dc2626"
                      fillOpacity={1}
                      fill="url(#faussesGrad)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2 : Status Distribution */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-900">Répartition par statut</h3>
                <p className="text-xs text-slate-500">Qualification des rumeurs traitées</p>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.statusDistribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {data.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "11px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                {data.statusDistribution.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="truncate text-slate-600 font-medium">
                      {s.name} ({s.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 3 : Breakdown by Category */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
              <div className="pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Répartition par thématique dans la région d&apos;Agadez
                </h3>
                <p className="text-xs text-slate-500">Catégorisation des signalements</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.categoryDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={10}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="count" name="Nombre de rumeurs" fill="#0c7a3d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4 : Geographic locality breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="pb-4 border-b border-slate-100 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Répartition géographique</h3>
                  <p className="text-xs text-slate-500">Départements & Communes</p>
                </div>
                <Link
                  href="/carte"
                  className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  Carte <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {data.localityDistribution.map((loc, idx) => {
                  const maxCount = Math.max(...data.localityDistribution.map((l) => l.count), 1);
                  const pct = Math.round((loc.count / maxCount) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                          {loc.name}
                        </span>
                        <span className="font-bold text-slate-900">{loc.count} rumeurs</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Section: Recent incoming reports */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Derniers signalements reçus</h3>
              <p className="text-xs text-slate-500">
                Flux d&apos;alerte temps réel à traiter selon le workflow en 7 étapes
              </p>
            </div>
            <Link
              href="/signalements"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              Voir tous les signalements ({data?.stats.totalReports || 0})
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {!data || data.recentReports.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">Aucun signalement récent.</p>
            ) : (
              data.recentReports.map((report) => {
                const statusStyle = STATUS_CONFIG[report.status] || STATUS_CONFIG["EN ATTENTE"];
                const priorityStyle =
                  PRIORITY_CONFIG[report.urgency] || PRIORITY_CONFIG["MOYENNE"];

                return (
                  <div
                    key={report.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 hover:bg-slate-50/80 px-2 rounded-lg transition-colors"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {report.trackingCode}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${statusStyle.badge}`}
                        >
                          {statusStyle.label}
                        </span>
                        {report.category && (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                            {report.category.name}
                          </span>
                        )}
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium border ${priorityStyle.badge}`}
                        >
                          {priorityStyle.label}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                        {report.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        {report.locality && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {report.locality}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {formatDate(report.createdAt)}
                        </span>
                        {report.citizen?.maskedPhone && (
                          <span className="text-slate-500">
                            Source citoyenne : {report.citizen.maskedPhone}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/signalements/${report.id}`}
                      className="shrink-0 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Détails & Vérification
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
