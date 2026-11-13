"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Settings,
  Save,
  Shield,
  Radio,
  Server,
  Lock,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const [demoMode, setDemoMode] = useState(true);
  const [phoneId, setPhoneId] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [slaHours, setSlaHours] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppShell>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Paramètres & Configuration Système
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Gestion technique de l&apos;API Meta WhatsApp, des clés d&apos;environnement et des règles de gouvernance
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Paramètres sauvegardés avec succès dans la base de données.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Meta WhatsApp Cloud API Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <MessageSquare className="h-5 w-5 text-emerald-700" />
                <span>Meta WhatsApp Business Cloud API</span>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[10px] font-bold text-emerald-800">
                v20.0
              </span>
            </div>

            {/* DEMO mode switch */}
            <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-amber-950 text-xs">
                  Mode Simulateur DEMO WhatsApp (Actif)
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Permet de tester et démontrer l&apos;application sans identifiants Meta Cloud réels.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={demoMode}
                  onChange={(e) => setDemoMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  WhatsApp Phone Number ID
                </label>
                <input
                  type="text"
                  value={phoneId}
                  onChange={(e) => setPhoneId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Webhook Verify Token
                </label>
                <input
                  type="text"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Webhook Callback URL (Meta Developers Portal)
              </label>
              <input
                type="text"
                readOnly
                value="https://votre-domaine.ne/api/whatsapp/webhook"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono text-slate-500"
              />
            </div>
          </div>

          {/* Governance & Region Settings */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <Shield className="h-5 w-5 text-emerald-700" />
              <span>Gouvernance institutionnelle & Délais de traitement (SLA)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Délai moyen d&apos;enquête terrain (SLA en heures)
                </label>
                <input
                  type="number"
                  value={slaHours}
                  onChange={(e) => setSlaHours(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ligne d&apos;urgence / Standard PLCDA Agadez
                </label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Enregistrer les paramètres</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
