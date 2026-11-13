"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  MessageCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Search,
  Sparkles,
  MapPin,
  Megaphone,
  Radio,
  Globe,
  HelpCircle,
  FileText,
  Users,
  Eye,
  Check,
} from "lucide-react";
import { VERIFICATION_STEPS } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const [trackingSearch, setTrackingSearch] = useState("");

  const handleTrackingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingSearch.trim()) return;
    router.push(`/publications?search=${encodeURIComponent(trackingSearch.trim())}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Platform Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-white p-0.5 shadow-md ring-2 ring-emerald-600/30 group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src="/logo-plcda.jpg"
                alt="Logo Officiel PLCDA Agadez"
                className="h-12 w-12 object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
                  AGADEZ <span className="text-emerald-700">PLCDA</span>
                </span>
                <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-800 border border-orange-200">
                  BOT
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold hidden sm:block">
                Plateforme de Lutte Contre la Désinformation &bull; Agadez 🇳🇪
              </p>
            </div>
          </Link>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bouton Consulter le portail public citoyen */}
            <Link
              href="/publications"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 transition-all shadow-sm"
            >
              <Globe className="h-4 w-4 text-emerald-700" />
              <span className="hidden md:inline">Consulter le portail public citoyen</span>
              <span className="md:hidden">Portail Citoyen</span>
            </Link>

            {/* Bouton WhatsApp */}
            <Link
              href="/simulateur-whatsapp"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-900 border border-emerald-300 hover:bg-emerald-100 transition-colors"
            >
              <img src="/whatsapp-icon.png" alt="WhatsApp" className="h-4 w-4 object-contain" />
              <span>Signalement WhatsApp</span>
            </Link>

            {/* Bouton Connexion */}
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 sm:px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-sm"
            >
              <Lock className="h-3.5 w-3.5 text-amber-400" />
              <span>Espace Membre</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Agadez Background Image */}
      <section className="relative overflow-hidden text-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/40">
        {/* Background Image of Agadez with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{
            backgroundImage: "url('/agadez-hero.svg')",
          }}
        />
        {/* Dark Emerald & Saharan Amber Overlay for Maximum Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-emerald-950/85 to-slate-950/95" />

        {/* Ambient Decorative Light */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-200 border border-emerald-500/40 shadow-md">
            <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
            <span>Service Officiel de Veille &amp; Vérification des Faits &bull; Région d&apos;Agadez 🇳🇪</span>
          </div>

          {/* Main Title - Perfectly readable without box border */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-lg">
            <span className="text-amber-400">Ensemble,</span> luttons contre les rumeurs et la désinformation
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-emerald-100/90 leading-relaxed font-normal drop-shadow">
            Permettre à chaque citoyen de signaler en toute sécurité une rumeur sur WhatsApp, aux
            membres du PLCDA de vérifier les faits sur le terrain et de diffuser uniquement la vérité officielle.
          </p>

          {/* High-Visibility Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 max-w-xl mx-auto">
            {/* 1. Bouton WhatsApp Citoyen (Vert éclatant) */}
            <Link
              href="/simulateur-whatsapp"
              className="flex-1 inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-4 text-sm sm:text-base shadow-xl shadow-emerald-900/40 hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all cursor-pointer ring-2 ring-emerald-300/40"
            >
              <img src="/whatsapp-icon.png" alt="WhatsApp" className="h-7 w-7 object-contain drop-shadow" />
              <div className="text-left">
                <span className="block leading-tight">Signaler sur WhatsApp</span>
                <span className="text-[10px] font-semibold text-emerald-950 opacity-90 block">
                  Service 24h/24 &bull; 100% Anonyme
                </span>
              </div>
            </Link>

            {/* 2. Bouton Portail Public Citoyen */}
            <Link
              href="/publications"
              className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black px-6 py-4 text-sm sm:text-base shadow-xl hover:scale-[1.02] transition-all cursor-pointer ring-2 ring-white/50"
            >
              <Globe className="h-5 w-5 text-emerald-700" />
              <div className="text-left">
                <span className="block leading-tight">Consulter le portail public</span>
                <span className="text-[10px] font-semibold text-slate-600 block">
                  Alertes & démentis officiels
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Tracking Search Bar */}
          <div className="pt-4 max-w-lg mx-auto">
            <form onSubmit={handleTrackingSearch} className="relative flex items-center">
              <Search className="pointer-events-none absolute left-4 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={trackingSearch}
                onChange={(e) => setTrackingSearch(e.target.value)}
                placeholder="Vérifier une référence (Ex: PLCDA-2026-0001) ou mot-clé..."
                className="w-full rounded-2xl bg-white/95 backdrop-blur-md py-3 pl-11 pr-28 text-xs sm:text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-xl"
              />
              <button
                type="submit"
                className="absolute right-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 text-xs transition-colors cursor-pointer"
              >
                Vérifier
              </button>
            </form>
            <p className="mt-2 text-[11px] text-emerald-200/80 font-medium">
              Recherchez instantanément si une rumeur a déjà été vérifiée ou réfutée à Agadez
            </p>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-200/90 max-w-3xl mx-auto border-t border-emerald-800/50">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Anonymat & Protection des Citoyens</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Shield className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Vérification Humaine de Terrain</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Globe className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Français &bull; Hausa &bull; Tamasheq &bull; Arabe</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Step Institutional Process Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Méthodologie Rigoureuse & Transparente
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Le processus de vérification en 7 étapes
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Inspiré de l&apos;architecture de confiance pour préserver la paix et la cohésion sociale
            dans l&apos;Aïr et le Ténéré.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VERIFICATION_STEPS.map((s) => (
            <div
              key={s.step}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs">
                    0{s.step}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    {s.role}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Pillars of the Platform */}
      <section className="bg-slate-100/70 py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
              <img src="/whatsapp-icon.png" alt="WhatsApp" className="h-6 w-6 object-contain" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Signalements WhatsApp</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Les citoyens envoient audios, messages et photos directement au bot. Un numéro de suivi
              confidentiel est remis instantanément.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Enquêtes de Terrain Habilitées</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Les vérificateurs PLCDA consultent les chefferies traditionnelles, les services
              médicaux et les forces de sécurité pour certifier les faits.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Megaphone className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Diffusion & Alertes Officielles</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Seules les informations validées par les autorités habilitées sont publiées et
              diffusées pour désamorcer les tensions et préserver la paix.
            </p>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-700" />
            <span className="font-bold text-slate-800">
              AGADEZ PLCDA BOT &bull; République du Niger
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/publications" className="hover:text-emerald-700 font-semibold">
              Portail Public Citoyen
            </Link>
            <Link href="/simulateur-whatsapp" className="hover:text-emerald-700 font-semibold">
              Signalement WhatsApp
            </Link>
            <Link href="/login" className="hover:text-emerald-700 font-semibold">
              Espace vérificateurs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
