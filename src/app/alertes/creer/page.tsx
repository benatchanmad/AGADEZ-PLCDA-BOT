"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { ArrowLeft, Save, Megaphone, AlertCircle } from "lucide-react";

export default function CreateAlertPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [factCheckContent, setFactCheckContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState("MOYENNE");
  const [verdict, setVerdict] = useState("FAUSSE");
  const [sourcesUsed, setSourcesUsed] = useState("");
  const [status, setStatus] = useState("PUBLISHED");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          factCheckContent,
          categoryId: categoryId || undefined,
          priority,
          verdict,
          sourcesUsed,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur de création");
        setLoading(false);
        return;
      }

      router.push("/alertes");
    } catch {
      setError("Erreur serveur.");
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/alertes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux alertes
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h1 className="text-xl font-black text-slate-900">
              Rédiger une nouvelle alerte officielle
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Publication d&apos;un démenti ou d&apos;une confirmation factuelle officielle pour le
              public d&apos;Agadez
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Titre de l&apos;alerte officielle *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: DÉMENTI : Prétendue coupure de la route Agadez - Tahoua"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Résumé de la rumeur ou fausse information *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Expliquez brièvement ce qui circulait sur les réseaux ou par WhatsApp..."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Clarification officielle & Éléments factuels vérifiés *
              </label>
              <textarea
                required
                rows={4}
                value={factCheckContent}
                onChange={(e) => setFactCheckContent(e.target.value)}
                placeholder="Présentez les faits réels établis avec certitude par les autorités et les équipes PLCDA..."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Verdict factuel
                </label>
                <select
                  value={verdict}
                  onChange={(e) => setVerdict(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="FAUSSE">FAUSSE (Infox réfutée)</option>
                  <option value="CONFIRMÉE">CONFIRMÉE (Information vraie)</option>
                  <option value="PARTIELLEMENT VRAIE">PARTIELLEMENT VRAIE</option>
                  <option value="NON VÉRIFIABLE">NON VÉRIFIABLE</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Niveau d&apos;urgence
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="CRITIQUE">Critique (Sécurité / Urgence)</option>
                  <option value="ÉLEVÉE">Élevée</option>
                  <option value="MOYENNE">Moyenne</option>
                  <option value="FAIBLE">Faible</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="">Sélectionner une catégorie...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Sources institutionnelles citées
              </label>
              <input
                type="text"
                value={sourcesUsed}
                onChange={(e) => setSourcesUsed(e.target.value)}
                placeholder="Ex: Gouvernorat d'Agadez, FDS, Hôpital Régional, Chef de Canton..."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Statut initial de l&apos;alerte
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="PUBLISHED"
                    checked={status === "PUBLISHED"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  <span>Publier immédiatement sur le portail</span>
                </label>
                <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="DRAFT"
                    checked={status === "DRAFT"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  <span>Enregistrer comme brouillon</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Link
                href="/alertes"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800 disabled:opacity-70 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {loading ? "Enregistrement..." : "Enregistrer l'alerte"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
