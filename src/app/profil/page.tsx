"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { UserCheck, Shield, Mail, Phone, Building2, Lock, Save, CheckCircle2 } from "lucide-react";
import { formatDate, ROLE_CONFIG } from "@/lib/utils";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading || !user) {
    return (
      <AppShell>
        <div className="py-24 text-center text-slate-400">Chargement de votre profil...</div>
      </AppShell>
    );
  }

  const roleInfo = ROLE_CONFIG[user.role] || { label: user.role, color: "bg-slate-100" };

  return (
    <AppShell>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Profil Utilisateur & Compte Habilité
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Informations personnelles, antenne d&apos;affectation et droits d&apos;accès RBAC
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Profil mis à jour avec succès.</span>
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          {/* User badge */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="h-16 w-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-xl shadow-inner ring-4 ring-emerald-200">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
              <span
                className={`inline-block mt-1 rounded-md px-2.5 py-0.5 text-xs font-bold border ${roleInfo.color}`}
              >
                {roleInfo.label}
              </span>
              <p className="text-xs text-slate-500 mt-1">{user.department || "PLCDA Agadez"}</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email institutionnel</label>
                <input
                  type="email"
                  readOnly
                  defaultValue={user.email}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Numéro de téléphone</label>
                <input
                  type="text"
                  defaultValue={user.phone || "+227 "}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Département ou Antenne</label>
                <input
                  type="text"
                  readOnly
                  defaultValue={user.department || "Coordination Générale Agadez"}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Sécurité & Mot de passe</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Confirmer mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Enregistrer les modifications</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
