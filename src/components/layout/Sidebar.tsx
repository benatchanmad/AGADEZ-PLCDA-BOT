"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Inbox,
  CheckCircle2,
  Megaphone,
  MessageSquareCode,
  MessageCircle,
  Globe,
  Users,
  FolderTree,
  HelpCircle,
  BarChart3,
  ShieldCheck,
  Settings,
  LogOut,
  UserCheck,
  Shield,
  Radio,
} from "lucide-react";
import { cn, ROLE_CONFIG } from "@/lib/utils";

interface SidebarProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string | null;
  } | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const navGroups = [
    {
      group: "VUE D'ENSEMBLE",
      items: [
        { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
        { label: "Carte régionale", href: "/carte", icon: MapPin },
      ],
    },
    {
      group: "TRAITEMENT & VÉRIFICATION",
      items: [
        { label: "Signalements reçus", href: "/signalements", icon: Inbox },
        { label: "Enquêtes terrain", href: "/verifications", icon: CheckCircle2 },
        { label: "Alertes officielles", href: "/alertes", icon: Megaphone },
      ],
    },
    {
      group: "CANAUX CITOYENS & WHATSAPP",
      items: [
        {
          label: "Simulateur WhatsApp",
          href: "/simulateur-whatsapp",
          icon: MessageSquareCode,
          badge: "Mode Démo",
        },
        { label: "Conversations WhatsApp", href: "/whatsapp", icon: MessageCircle },
        { label: "Portail citoyen public", href: "/publications", icon: Globe },
      ],
    },
    {
      group: "ADMINISTRATION & ANALYSE",
      items: [
        { label: "Membres PLCDA", href: "/membres", icon: Users },
        { label: "Catégories", href: "/categories", icon: FolderTree },
        { label: "FAQ multilingue", href: "/faq", icon: HelpCircle },
        { label: "Rapports & Exports", href: "/rapports", icon: BarChart3 },
        { label: "Journal d'audit", href: "/activites", icon: ShieldCheck },
        { label: "Paramètres", href: "/parametres", icon: Settings },
      ],
    },
  ];

  const roleInfo = user?.role ? ROLE_CONFIG[user.role] : null;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-sm",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5 bg-gradient-to-r from-emerald-50/50 to-white">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white p-0.5 shadow-md shadow-emerald-900/10 ring-2 ring-emerald-600/30 overflow-hidden">
            <img
              src="/logo-plcda.jpg"
              alt="Logo PLCDA Agadez"
              className="h-11 w-11 object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-base tracking-tight">
                AGADEZ <span className="text-emerald-700">PLCDA</span>
              </span>
              <span className="inline-flex items-center rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-800 border border-orange-200">
                BOT
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              Région d&apos;Agadez &bull; Niger 🇳🇪
            </span>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="mx-4 mt-3 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 border border-emerald-200/60">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-900">Veille active 24/7</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">
            En ligne
          </span>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.group}
              </p>
              <div className="mt-1 space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={false}
                      onClick={() => onClose && onClose()}
                      className={cn(
                        "group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150",
                        isActive
                          ? "bg-emerald-700 text-white shadow-sm shadow-emerald-800/20 font-semibold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "h-4 w-4 transition-colors",
                            isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-700"
                          )}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide",
                            isActive
                              ? "bg-emerald-900 text-emerald-100"
                              : "bg-orange-100 text-orange-700 border border-orange-200"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User profile footer */}
        <div className="border-t border-slate-100 p-3 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <Link
              href="/profil"
              className="flex items-center gap-2.5 overflow-hidden group hover:opacity-90"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs ring-1 ring-emerald-300">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "PL"}
              </div>
              <div className="flex flex-col truncate">
                <span className="truncate text-xs font-semibold text-slate-800 group-hover:text-emerald-700">
                  {user?.name || "Utilisateur"}
                </span>
                <span className="text-[10px] text-slate-500 truncate">
                  {roleInfo?.label || user?.role || "Membre"}
                </span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              title="Déconnexion"
              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
