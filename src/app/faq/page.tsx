"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { HelpCircle, PlusCircle, Globe, ChevronDown, ChevronUp } from "lucide-react";

export default function FAQPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState<"fr" | "ha" | "tmq" | "ar">("fr");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/faq")
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data.faqs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Foire Aux Questions (FAQ) Multilingue
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                {faqs.length} questions
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Base de connaissances automatisée alimentant le menu WhatsApp et l&apos;information citoyenne
            </p>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 rounded-2xl bg-white p-1 border border-slate-200 shadow-sm text-xs">
            {[
              { id: "fr", label: "Français" },
              { id: "ha", label: "Hausa" },
              { id: "tmq", label: "Tamasheq" },
              { id: "ar", label: "العربية (Arabe)" },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => setActiveLang(l.id as any)}
                className={`rounded-xl px-3 py-1.5 font-bold transition-colors ${
                  activeLang === l.id
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              Chargement de la base de connaissances...
            </div>
          ) : (
            faqs.map((faq, idx) => {
              const isExpanded = expandedId === faq.id || idx === 0;

              let q = faq.questionFr;
              let a = faq.answerFr;

              if (activeLang === "ha" && faq.questionHa) {
                q = faq.questionHa;
                a = faq.answerHa || faq.answerFr;
              } else if (activeLang === "tmq" && faq.questionTmq) {
                q = faq.questionTmq;
                a = faq.answerTmq || faq.answerFr;
              } else if (activeLang === "ar" && faq.questionAr) {
                q = faq.questionAr;
                a = faq.answerAr || faq.answerFr;
              }

              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-900 leading-snug">{q}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      <p className="whitespace-pre-wrap">{a}</p>
                      <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
                        <span>Catégorie : {faq.category}</span>
                        <span>&bull;</span>
                        <span>Disponible en WhatsApp Bot Option 1</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
