"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Info } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Identifiants invalides");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Impossible de contacter le serveur d'authentification.");
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Agadez2026!");
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        {/* Brand identity */}
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white p-1.5 shadow-2xl shadow-emerald-950/60 ring-4 ring-emerald-500/40">
            <img
              src="/logo-plcda.jpg"
              alt="Logo Officiel PLCDA Agadez"
              className="h-full w-full object-contain rounded-full"
            />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
            AGADEZ <span className="text-emerald-400">PLCDA</span> BOT
          </h2>
          <p className="mt-1 text-sm font-medium text-emerald-200/80">
            Plateforme de Lutte Contre la Désinformation
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-900/60 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-700/50">
            <span>Région d&apos;Agadez &bull; République du Niger 🇳🇪</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="mt-6 rounded-2xl bg-white p-8 shadow-2xl shadow-black/40 border border-slate-100">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Espace d&apos;accès sécurisé</h3>
            <p className="text-xs text-slate-500">
              Veuillez saisir vos identifiants institutionnels habilités.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Email professionnel
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@plcda-agadez.ne"
                  className="block w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-700 py-2.5 px-4 text-sm font-bold text-white shadow-md hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transition-all disabled:opacity-70 cursor-pointer"
            >
              {loading ? "Vérification en cours..." : "Connexion à la plateforme"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Quick Demo switcher for testing */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2.5">
              <Info className="h-3.5 w-3.5 text-orange-600" />
              <span>Accès démo rapide (1 clic pour tester) :</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemo("superadmin@plcda-agadez.ne")}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-left font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              >
                👑 <span className="font-semibold">Super Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("admin@plcda-agadez.ne")}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-left font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              >
                🏛️ <span className="font-semibold">Admin PLCDA</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("verificateur.ibrahim@plcda-agadez.ne")}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-left font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              >
                🔍 <span className="font-semibold">Vérificateur</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("comms@plcda-agadez.ne")}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-left font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              >
                📢 <span className="font-semibold">Communication</span>
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-400">
              Mot de passe partagé : <code className="font-mono text-slate-600">Agadez2026!</code>
            </p>
          </div>
        </div>

        {/* Security watermark */}
        <p className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
          <Shield className="h-3 w-3 text-emerald-500" />
          <span>Accès crypté SSL 256-bit &bull; Traçabilité des actions RBAC</span>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <h4 className="text-base font-bold text-slate-900">Réinitialisation d&apos;accès</h4>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Pour des raisons de sécurité institutionnelle, la réinitialisation des accès des membres
              du PLCDA est administrée par la Direction Opérationnelle à Agadez.
            </p>
            <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900">
              <p className="font-semibold">Contact support administrateur :</p>
              <p>Email : admin@plcda-agadez.ne</p>
              <p>Téléphone d&apos;urgence : +227 20 44 00 00</p>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="mt-4 w-full rounded-lg bg-emerald-700 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              Compris, fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
