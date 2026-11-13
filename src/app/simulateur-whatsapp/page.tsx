"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Send,
  Paperclip,
  Smile,
  Shield,
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Sparkles,
  Info,
  Radio,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ChatMessage {
  id: string;
  phoneNumber: string;
  direction: string;
  body: string | null;
  mediaUrl?: string | null;
  type: string;
  createdAt: string;
}

export default function WhatsAppSimulatorPage() {
  const [phone, setPhone] = useState("+22790112233");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, [phone]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    try {
      const res = await fetch(`/api/whatsapp/simulate?phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {
      // ignore
    }
  };

  const handleSendMessage = async (textToSend?: string, mediaUrl?: string) => {
    const text = textToSend || inputMessage;
    if (!text && !mediaUrl) return;

    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/whatsapp/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          message: text,
          mediaUrl,
          mediaType: mediaUrl ? "image" : "text",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickSend = (val: string) => {
    handleSendMessage(val);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
      {/* Top Banner */}
      <div className="bg-emerald-950 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 font-semibold text-emerald-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour Dashboard
          </Link>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1 text-orange-400 font-semibold">
            <Radio className="h-3 w-3 animate-pulse" />
            Mode Simulateur WhatsApp Interactif (Prêt pour démonstration)
          </span>
        </div>
        <div className="text-[11px] text-emerald-300 hidden sm:block">
          Moteur conversationnel Meta Cloud API &bull; Multilingue (FR, HA, TMQ, AR)
        </div>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto p-2 sm:p-6 flex flex-col sm:flex-row gap-4">
        {/* Left Toolbar / Scenarios */}
        <div className="w-full sm:w-80 shrink-0 space-y-4">
          <div className="rounded-2xl bg-slate-800 p-4 border border-slate-700 text-white space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2 text-emerald-400">
              <Shield className="h-4 w-4" />
              <span>Paramètres du simulateur</span>
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                Numéro WhatsApp Citoyen :
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+227 90 00 00 00"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Quick Menu Triggers */}
          <div className="rounded-2xl bg-slate-800 p-4 border border-slate-700 text-white space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Boutons de raccourci (Menu Bot)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => quickSend("Menu")}
                className="rounded-xl bg-slate-700 p-2 font-medium hover:bg-emerald-700 text-left transition-colors"
              >
                🌟 Accueil (Menu)
              </button>
              <button
                onClick={() => quickSend("1")}
                className="rounded-xl bg-slate-700 p-2 font-medium hover:bg-emerald-700 text-left transition-colors"
              >
                1️⃣ FAQ (Questions)
              </button>
              <button
                onClick={() => quickSend("2")}
                className="rounded-xl bg-slate-700 p-2 font-medium hover:bg-emerald-700 text-left transition-colors"
              >
                2️⃣ Signaler rumeur
              </button>
              <button
                onClick={() => quickSend("3")}
                className="rounded-xl bg-slate-700 p-2 font-medium hover:bg-emerald-700 text-left transition-colors"
              >
                3️⃣ Vérifier référence
              </button>
              <button
                onClick={() => quickSend("4")}
                className="rounded-xl bg-slate-700 p-2 font-medium hover:bg-emerald-700 text-left transition-colors"
              >
                4️⃣ Alertes officielles
              </button>
              <button
                onClick={() => quickSend("5")}
                className="rounded-xl bg-slate-700 p-2 font-medium hover:bg-emerald-700 text-left transition-colors"
              >
                5️⃣ Conseils anti-infox
              </button>
            </div>
          </div>
        </div>

        {/* WhatsApp Mobile / Web Screen Container */}
        <div className="flex-1 flex flex-col rounded-3xl overflow-hidden bg-[#0b141a] border border-slate-800 shadow-2xl h-[650px]">
          {/* WhatsApp Header */}
          <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#2a3942] text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-white p-0.5 overflow-hidden flex items-center justify-center shadow-inner ring-1 ring-emerald-500/50">
                  <img
                    src="/logo-plcda.jpg"
                    alt="Bot PLCDA"
                    className="h-full w-full object-contain rounded-full"
                  />
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#202c33]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-slate-100">AGADEZ PLCDA BOT</h4>
                  <span className="rounded bg-emerald-900/80 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300">
                    Officiel
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400">En ligne &bull; Réponse automatique</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <Phone className="h-4 w-4 cursor-pointer hover:text-white" />
              <Video className="h-4 w-4 cursor-pointer hover:text-white" />
              <MoreVertical className="h-4 w-4 cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* Chat Messages Body with WhatsApp background pattern */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b141a] bg-opacity-95">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 text-xs p-6 space-y-2">
                <Shield className="h-12 w-12 text-emerald-600/50" />
                <p className="font-semibold text-slate-400">
                  Bienvenue sur le simulateur officiel AGADEZ PLCDA BOT
                </p>
                <p className="max-w-xs text-[11px] text-slate-500">
                  Tapez &ldquo;Menu&rdquo; ou cliquez sur l&apos;un des raccourcis à gauche pour
                  lancer la conversation.
                </p>
              </div>
            ) : (
              messages.map((m) => {
                const isOutbound = m.direction === "OUTBOUND";

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isOutbound ? "items-start" : "items-end"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 shadow-md text-xs leading-relaxed whitespace-pre-wrap ${
                        isOutbound
                          ? "bg-[#202c33] text-slate-100 rounded-tl-none border border-[#2a3942]"
                          : "bg-[#005c4b] text-white rounded-tr-none"
                      }`}
                    >
                      {/* Media if present */}
                      {m.mediaUrl && (
                        <div className="mb-2 rounded-xl overflow-hidden bg-slate-900/50 p-2 border border-white/10 flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-emerald-400" />
                          <span className="text-[11px] font-semibold text-slate-200 truncate">
                            Photo / Document joint
                          </span>
                        </div>
                      )}

                      <div>{m.body}</div>

                      <div
                        className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                          isOutbound ? "text-slate-400" : "text-emerald-200"
                        }`}
                      >
                        <span>{formatDate(m.createdAt)}</span>
                        {!isOutbound && <CheckCheck className="h-3.5 w-3.5 text-blue-400" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Chat Input Bar */}
          <div className="bg-[#202c33] px-3 py-2.5 flex items-center gap-2 border-t border-[#2a3942]">
            <Smile className="h-5 w-5 text-slate-400 cursor-pointer hover:text-white" />
            <button
              onClick={() =>
                handleSendMessage(
                  "Voici une capture d'écran reçue concernant des alertes météorologiques sur l'Aïr.",
                  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500"
                )
              }
              title="Joindre une image de preuve"
              className="text-slate-400 hover:text-emerald-400 cursor-pointer"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex-1 flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Écrivez un message ou tapez 1, 2, 3..."
                className="w-full rounded-xl bg-[#2a3942] py-2 px-4 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="rounded-xl bg-[#00a884] p-2 text-slate-950 font-bold hover:bg-emerald-400 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
