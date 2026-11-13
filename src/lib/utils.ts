import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Masque un numéro de téléphone pour préserver la vie privée et la sécurité des citoyens.
 * Ex: "+22796112233" -> "+227 96 ** ** 33"
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return "Numéro confidentiel";
  const cleaned = phone.replace(/\s+/g, "");
  if (cleaned.length < 8) return "***";
  const start = cleaned.slice(0, Math.min(6, cleaned.length - 4));
  const end = cleaned.slice(-2);
  return `${start} ** ** ${end}`;
}

/**
 * Formate une date en français
 */
export function formatDate(date: string | Date | null | undefined, includeTime = true): string {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  }).format(d);
}

/**
 * Génère un identifiant unique de signalement au format institutionnel PLCDA
 * Ex: PLCDA-2026-7842
 */
export function generateTrackingCode(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PLCDA-${year}-${random}`;
}

/**
 * Couleurs et étiquettes pour les statuts de signalement
 */
export const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; badge: string }
> = {
  "EN ATTENTE": {
    label: "En attente",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-300",
    badge: "bg-amber-100 text-amber-800 border-amber-300",
  },
  "EN COURS DE VÉRIFICATION": {
    label: "En cours de vérification",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-300",
    badge: "bg-blue-100 text-blue-800 border-blue-300",
  },
  "CONFIRMÉE": {
    label: "Confirmée (Vraie)",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-300",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  "FAUSSE": {
    label: "Fausse (Infox réfutée)",
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-300",
    badge: "bg-rose-100 text-rose-800 border-rose-300",
  },
  "PARTIELLEMENT VRAIE": {
    label: "Partiellement vraie",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-300",
    badge: "bg-purple-100 text-purple-800 border-purple-300",
  },
  "NON VÉRIFIABLE": {
    label: "Non vérifiable",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-300",
    badge: "bg-slate-100 text-slate-700 border-slate-300",
  },
};

/**
 * 7 ÉTAPES DU PROCESSUS OFFICIEL DE VÉRIFICATION PLCDA
 */
export const VERIFICATION_STEPS = [
  {
    step: 1,
    title: "Réception",
    description: "Réception automatique du signalement (WhatsApp ou formulaire)",
    role: "Système / Citoyen",
  },
  {
    step: 2,
    title: "Enregistrement",
    description: "Attribution du code de suivi confidentiel et indexation en BDD",
    role: "Système / Administrateur",
  },
  {
    step: 3,
    title: "Affectation",
    description: "Désignation d'un membre vérificateur du PLCDA selon la zone",
    role: "Coordination PLCDA",
  },
  {
    step: 4,
    title: "Vérification de terrain",
    description: "Enquête directe auprès des sources officielles et témoins locaux",
    role: "Vérificateur de terrain",
  },
  {
    step: 5,
    title: "Preuves & Observations",
    description: "Consignation des preuves documentées et notes contradictoires",
    role: "Vérificateur de terrain",
  },
  {
    step: 6,
    title: "Validation hiérarchique",
    description: "Revue et approbation par un responsable habilité (Comms / Admin)",
    role: "Responsable habilité",
  },
  {
    step: 7,
    title: "Publication officielle",
    description: "Diffusion de la clarification citoyenne et alerte WhatsApp autorisée",
    role: "Cellule Communication",
  },
];

/**
 * Priorité
 */
export const PRIORITY_CONFIG: Record<string, { label: string; badge: string }> = {
  FAIBLE: { label: "Faible", badge: "bg-slate-100 text-slate-700 border-slate-200" },
  MOYENNE: { label: "Moyenne", badge: "bg-blue-100 text-blue-700 border-blue-200" },
  ÉLEVÉE: { label: "Élevée", badge: "bg-orange-100 text-orange-700 border-orange-200" },
  CRITIQUE: { label: "Critique", badge: "bg-red-100 text-red-700 border-red-300 font-semibold" },
};

/**
 * Rôles PLCDA
 */
export const ROLE_CONFIG: Record<string, { label: string; description: string; color: string }> = {
  SUPER_ADMIN: {
    label: "Super Administrateur",
    description: "Contrôle technique et administratif total de la plateforme",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  ADMIN: {
    label: "Administrateur PLCDA",
    description: "Gestion opérationnelle générale, membres et catégories",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  VERIFIER: {
    label: "Vérificateur de terrain",
    description: "Traitement, enquête et vérification des rumeurs",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  COMMUNICATION: {
    label: "Responsable Communication",
    description: "Validation et publication des alertes citoyennes",
    color: "bg-amber-100 text-amber-800 border-amber-200",
  },
  OBSERVER: {
    label: "Observateur",
    description: "Consultation en lecture seule des rapports autorisés",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};
