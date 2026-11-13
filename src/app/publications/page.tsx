"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MessageCircle,
  Share2,
  Calendar,
  ExternalLink,
  MapPin,
  Lock,
} from "lucide-react";
import { formatDate, STATUS_CONFIG, PRIORITY_CONFIG } from "@/lib/utils";

export default function PublicationsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    fetchCategories();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/alerts?status=PUBLISHED");
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

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

  const filtered = alerts.filter((a) => {
    const matchCat = selectedCat === "ALL" || a.categoryId === selectedCat;
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.factCheckContent.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Public Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white p-0.5 shadow-md ring-2 ring-emerald-500/20 overflow-hidden">
              <img
                src="/logo-plcda.jpg"
                alt="Logo Officiel PLCDA Agadez"
                className="h-11 w-11 object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                  AGADEZ <span className="text-emerald-700">PLCDA</span>
                </span>
                <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-800 border border-orange-200">
                  BOT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Plateforme de Lutte Contre la Désinformation &bull; Agadez 🇳🇪
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/simulateur-whatsapp"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-900 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 transition-all shadow-sm"
            >
              <img
                src="/whatsapp-icon.png"
                alt="WhatsApp"
                className="h-5 w-5 object-contain"
              />
              <span>Signaler sur WhatsApp</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl relative z-10 flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-600/40 mb-3">
              <span>Plateforme Officielle de Vérification des Faits & Sécurité</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              <span className="text-amber-400">Ensemble,</span> luttons contre les rumeurs et la désinformation
            </h1>
            <p className="mt-2 text-xs sm:text-sm font-semibold text-emerald-300">
              Publications authentifiées &bull; Alertes officielles &bull; Démentis formels
            </p>
            <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Consultez les informations officiellement authentifiées et les démentis formels validés
              par la coordination du PLCDA et les autorités de la région d&apos;Agadez.
            </p>

            {/* Quick search */}
            <div className="mt-6 flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une rumeur, un démenti, une ville (Arlit, Agadez...)..."
                  className="w-full rounded-2xl bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Official PLCDA Logo Emblem */}
          <div className="relative z-10 hidden md:flex shrink-0 items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-white p-1.5 shadow-2xl ring-4 ring-emerald-500/40">
              <img
                src="/logo-plcda.jpg"
                alt="Logo Officiel PLCDA Agadez"
                className="h-full w-full object-contain rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          <button
            onClick={() => setSelectedCat("ALL")}
            className={`rounded-xl px-4 py-2 font-semibold whitespace-nowrap transition-colors ${
              selectedCat === "ALL"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Toutes les alertes ({alerts.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`rounded-xl px-4 py-2 font-semibold whitespace-nowrap transition-colors ${
                selectedCat === c.id
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 py-16 text-center text-slate-400">
              Chargement des alertes citoyennes...
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-2 py-16 text-center text-slate-400">
              Aucune publication officielle ne correspond à votre recherche.
            </div>
          ) : (
            filtered.map((alert) => {
              const statusStyle =
                STATUS_CONFIG[alert.verdict] || STATUS_CONFIG["FAUSSE"];
              const priorityStyle =
                PRIORITY_CONFIG[alert.priority] || PRIORITY_CONFIG["MOYENNE"];

              return (
                <article
                  key={alert.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-black border ${statusStyle.badge}`}
                      >
                        Verdict officiel : {statusStyle.label}
                      </span>
                      {alert.category && (
                        <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                          {alert.category.name}
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 leading-snug">
                      {alert.title}
                    </h2>

                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                      <strong className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Ce qui circulait (Rumeur) :
                      </strong>
                      {alert.description}
                    </div>

                    <div className="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-200 text-xs text-slate-900 leading-relaxed">
                      <strong className="block text-[10px] uppercase font-bold text-emerald-800 mb-1">
                        Les faits réels vérifiés par le PLCDA :
                      </strong>
                      <p className="font-medium text-emerald-950">{alert.factCheckContent}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                      <span>Sources : {alert.sourcesUsed || "Autorités locales & PLCDA"}</span>
                      <span>{formatDate(alert.publishedAt, false)}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      ✓ Validé par la Coordination Régionale
                    </span>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: alert.title,
                            text: alert.factCheckContent,
                            url: window.location.href,
                          });
                        }
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      Partager
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-800">
            AGADEZ PLCDA BOT &bull; Plateforme Locale de Concertation, de Dialogue et d&apos;Action
          </p>
          <p>
            Ensemble pour la paix, la vérité factuelle et la cohésion sociale dans la région
            d&apos;Agadez (Niger).
          </p>
          <p className="text-[10px] text-slate-400">
            Numéro vert d&apos;urgence : +227 20 44 00 00 &bull; WhatsApp Officiel PLCDA
          </p>
        </div>
      </footer>
    </div>
  );
}
