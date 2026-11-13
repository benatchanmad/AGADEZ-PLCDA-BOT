"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  PlusCircle,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  X,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface HeaderProps {
  onMenuToggle: () => void;
  user?: {
    name: string;
    role: string;
    email: string;
  } | null;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

export default function Header({ onMenuToggle, user }: HeaderProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // ignore
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // ignore
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur">
      {/* Left: Mobile hamburger & Institutional slogan */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Cellule Régionale de Veille & Vérification des Faits
          </span>
        </div>
      </div>

      {/* Right: Quick actions, notifications, user avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Simulator CTA */}
        <Link
          href="/simulateur-whatsapp"
          className="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
        >
          <img src="/whatsapp-icon.png" alt="WhatsApp" className="h-4 w-4 object-contain" />
          <span>Tester le WhatsApp Bot</span>
        </Link>

        {/* Create report button */}
        <Link
          href="/signalements/nouveau"
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 transition-colors"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Nouveau signalement</span>
          <span className="sm:hidden">Ajouter</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-4 shadow-xl z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-emerald-700 hover:underline font-medium"
                    >
                      Tout marquer lu
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-500">
                    Aucune notification pour le moment.
                  </p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "py-2.5 px-1 hover:bg-slate-50 transition-colors rounded-lg",
                        !item.isRead ? "bg-emerald-50/40" : ""
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-800">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatDate(item.createdAt, false)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                        {item.message}
                      </p>
                      {item.link && (
                        <Link
                          href={item.link}
                          onClick={() => setShowNotifications(false)}
                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline"
                        >
                          Consulter <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Public portal link */}
        <Link
          href="/publications"
          target="_blank"
          title="Consulter le portail public citoyen"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
        >
          <ExternalLink className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
