"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Shield,
  UserCheck,
  FileText,
  MapPin,
  Calendar,
  AlertTriangle,
  Send,
  Sparkles,
  ExternalLink,
  Plus,
  Lock,
  Layers,
  ChevronRight,
  Paperclip,
  Volume2,
  Play,
  Pause,
  Download,
  Maximize2,
  Image as ImageIcon,
  Video,
  FileAudio,
  X,
  MessageCircle,
  Radio,
} from "lucide-react";
import {
  formatDate,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  VERIFICATION_STEPS,
  maskPhoneNumber,
} from "@/lib/utils";

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [report, setReport] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Assignment state
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [assignNotes, setAssignNotes] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  // Field Verification form state (Steps 4 & 5 -> 6)
  const [verdict, setVerdict] = useState("FAUSSE");
  const [summary, setSummary] = useState("");
  const [officialResponse, setOfficialResponse] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sourceRole, setSourceRole] = useState("");
  const [sourcesList, setSourcesList] = useState<any[]>([]);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [verifSubmitting, setVerifSubmitting] = useState(false);

  // Validation state (Step 6 -> 7)
  const [validationNotes, setValidationNotes] = useState("");
  const [publishAlert, setPublishAlert] = useState(true);
  const [validating, setValidating] = useState(false);

  // Media Inspection & Upload State
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [mediaSaving, setMediaSaving] = useState(false);

  useEffect(() => {
    fetchReport();
    fetchMembers();
  }, [id]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/reports/${id}`);
      if (res.ok) {
        const data = await res.json();
        setReport(data.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.users || []);
      }
    } catch {
      // ignore
    }
  };

  // 1. Affecter à un vérificateur (Étape 3)
  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;
    setAssignLoading(true);

    try {
      const res = await fetch(`/api/reports/${id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedMemberId, notes: assignNotes }),
      });
      if (res.ok) {
        await fetchReport();
        setAssignNotes("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAssignLoading(false);
    }
  };

  // Add source to list
  const addSource = () => {
    if (!sourceName) return;
    setSourcesList([...sourcesList, { name: sourceName, roleOrContact: sourceRole }]);
    setSourceName("");
    setSourceRole("");
  };

  // Add evidence to list
  const addEvidence = () => {
    if (!evidenceTitle || !evidenceUrl) return;
    setEvidenceList([
      ...evidenceList,
      { title: evidenceTitle, fileUrl: evidenceUrl, fileType: "document" },
    ]);
    setEvidenceTitle("");
    setEvidenceUrl("");
  };

  // Add attachment to report
  const handleAddAttachment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle || !mediaUrl) return;
    setMediaSaving(true);

    try {
      const res = await fetch(`/api/reports/${id}/attachments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: mediaTitle,
          fileUrl: mediaUrl,
          fileType: mediaType,
        }),
      });

      if (res.ok) {
        await fetchReport();
        setShowAddMediaModal(false);
        setMediaTitle("");
        setMediaUrl("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMediaSaving(false);
    }
  };

  // 2. Soumettre la vérification terrain (Étape 4-5 vers 6)
  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary || !officialResponse) return;
    setVerifSubmitting(true);

    try {
      const res = await fetch("/api/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: id,
          verdict,
          summary,
          officialResponse,
          internalNotes,
          sources: sourcesList,
          evidence: evidenceList,
        }),
      });

      if (res.ok) {
        await fetchReport();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifSubmitting(false);
    }
  };

  // 3. Validation hiérarchique et publication officielle (Étape 6 vers 7)
  const handleApproveVerification = async (verificationId: string) => {
    setValidating(true);
    try {
      const res = await fetch(`/api/verifications/${verificationId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          validationNotes,
          publishPublicAlert: publishAlert,
          alertPriority: report?.urgency || "MOYENNE",
        }),
      });

      if (res.ok) {
        await fetchReport();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setValidating(false);
    }
  };

  if (loading || !report) {
    return (
      <AppShell>
        <div className="py-24 text-center text-slate-400">
          Chargement du signalement {id}...
        </div>
      </AppShell>
    );
  }

  const statusStyle = STATUS_CONFIG[report.status] || STATUS_CONFIG["EN ATTENTE"];
  const priorityStyle = PRIORITY_CONFIG[report.urgency] || PRIORITY_CONFIG["MOYENNE"];
  const activeVerification = report.verifications?.[0];

  // Helper to detect audio/photo nature from text if attachments list is empty
  const isAudioRumor =
    report.title.toLowerCase().includes("audio") ||
    report.title.toLowerCase().includes("vocal") ||
    (report.rawText && report.rawText.toLowerCase().includes("audio"));

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Top breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href="/signalements"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Tous les signalements
          </Link>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold border ${statusStyle.badge}`}
            >
              {statusStyle.label}
            </span>
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${priorityStyle.badge}`}
            >
              Priorité : {priorityStyle.label}
            </span>
          </div>
        </div>

        {/* 7-STEP PROCESSUS DE VÉRIFICATION VISUAL WORKFLOW */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Processus institutionnel de vérification en 7 étapes</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Étape actuelle : {report.verificationStep} / 7
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Cycle de vie obligatoire garantissant la rigueur des faits et l&apos;approbation humaine
              </p>
            </div>
          </div>

          {/* Stepper visual bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {VERIFICATION_STEPS.map((step) => {
              const isCompleted = report.verificationStep > step.step;
              const isCurrent = report.verificationStep === step.step;

              return (
                <div
                  key={step.step}
                  className={`relative flex flex-col p-3 rounded-xl border transition-all text-xs ${
                    isCompleted
                      ? "border-emerald-300 bg-emerald-50/60 text-emerald-900"
                      : isCurrent
                      ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/30 text-emerald-950 font-bold"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-emerald-700 text-white animate-pulse"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isCompleted ? "✓" : step.step}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Étape {step.step}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900 line-clamp-1">{step.title}</span>
                  <span className="mt-1 text-[10px] text-slate-500 line-clamp-2 leading-tight">
                    {step.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Details + Workflow actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Report Details & Evidence */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Report Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-slate-900">
                      {report.trackingCode}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 flex items-center gap-1">
                      <MessageCircle className="h-3 w-3 text-emerald-600" />
                      Canal : {report.channel}
                    </span>
                  </div>
                  <h2 className="mt-2 text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {report.title}
                  </h2>
                </div>
              </div>

              {/* Meta information tags */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 border-t border-b border-slate-100 py-3">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  {report.locality || "Région d'Agadez"}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  Reçu le {formatDate(report.createdAt)}
                </span>
                {report.category && (
                  <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                    {report.category.name}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Description du signalement
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {report.description}
                </p>
              </div>

              {/* Raw citizen text */}
              {report.rawText && report.rawText !== report.description && (
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Message original transmis par le citoyen
                  </h4>
                  <p className="text-xs font-mono text-slate-600 bg-slate-100 p-3 rounded-lg border border-slate-200">
                    &ldquo;{report.rawText}&rdquo;
                  </p>
                </div>
              )}

              {/* Citizen privacy protection notice */}
              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-emerald-700" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Expéditeur citoyen : {report.citizen?.name || "Anonyme"} (
                      {maskPhoneNumber(report.citizen?.maskedPhone)})
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Protection de la source active &bull; Langue :{" "}
                      {report.citizen?.language?.toUpperCase() || "FR"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Score réputation : {report.citizen?.reputationScore || 100}%
                </span>
              </div>
            </div>

            {/* ------------------------------------------------------------------ */}
            {/* ÉLÉMENTS TRANSMIS PAR LE CITOYEN (PREUVES / MÉDIAS DU SIGNALEMENT) */}
            {/* ------------------------------------------------------------------ */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-emerald-100 p-2 text-emerald-800">
                    <Paperclip className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>Éléments & Médias transmis par le citoyen</span>
                      {report.channel === "WHATSAPP" && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" /> WhatsApp
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Fichiers audio, photos, captures d&apos;écran ou vidéos joints lors du signalement
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddMediaModal(true)}
                  className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Ajouter un média</span>
                </button>
              </div>

              {/* Affichage des pièces jointes réelles */}
              {report.attachments && report.attachments.length > 0 ? (
                <div className="space-y-4">
                  {report.attachments.map((att: any) => {
                    const isAudio =
                      att.fileType === "audio" ||
                      att.fileName?.endsWith(".mp3") ||
                      att.fileName?.endsWith(".ogg") ||
                      att.fileName?.endsWith(".wav");
                    const isImage =
                      att.fileType === "image" ||
                      att.fileName?.endsWith(".jpg") ||
                      att.fileName?.endsWith(".png") ||
                      att.fileName?.endsWith(".jpeg") ||
                      att.fileName?.endsWith(".webp");
                    const isVideo =
                      att.fileType === "video" ||
                      att.fileName?.endsWith(".mp4") ||
                      att.fileName?.endsWith(".webm");

                    return (
                      <div key={att.id}>
                        {/* 1. LECTEUR AUDIO CITOYEN (WhatsApp Voice Note) */}
                        {isAudio && (
                          <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-50/60 to-white p-4 border border-emerald-200 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-700/20 ring-2 ring-emerald-300">
                                  <Volume2 className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-emerald-950">
                                      Message vocal audio citoyen (WhatsApp)
                                    </span>
                                    <span className="rounded bg-emerald-200 px-1.5 py-0.2 text-[9px] font-bold text-emerald-900">
                                      Audio
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-emerald-700 font-mono">
                                    {att.fileName}
                                  </span>
                                </div>
                              </div>

                              <a
                                href={att.fileUrl}
                                target="_blank"
                                download
                                className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200 hover:bg-emerald-100 shadow-sm"
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span>Télécharger</span>
                              </a>
                            </div>

                            {/* Lecteur HTML5 interactif */}
                            <div className="bg-white rounded-xl p-3 border border-emerald-200 shadow-sm space-y-2">
                              <audio
                                controls
                                src={att.fileUrl}
                                className="w-full h-10 accent-emerald-700"
                                preload="metadata"
                              >
                                Votre navigateur ne supporte pas la lecture audio HTML5.
                              </audio>

                              {/* Simulation d'ondes vocales animées style WhatsApp */}
                              <div className="flex items-center gap-1 h-5 px-1 pt-1 opacity-80">
                                {[35, 60, 85, 40, 95, 75, 50, 80, 65, 45, 90, 70, 40, 85, 95, 65, 45, 75, 80, 50, 35, 90, 70, 50, 60, 45, 80, 65].map(
                                  (h, idx) => (
                                    <span
                                      key={idx}
                                      className="flex-1 bg-emerald-600/70 rounded-full transition-all"
                                      style={{ height: `${h}%` }}
                                    />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. VISIONNEUSE D'IMAGE CITOYENNE (Capture d'écran / Photo) */}
                        {isImage && (
                          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                                  <ImageIcon className="h-4 w-4" />
                                </div>
                                <div>
                                  <span className="font-bold text-xs text-slate-800 block">
                                    Photo / Capture transmise par le citoyen
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    {att.fileName}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setZoomedImage(att.fileUrl)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-slate-200 hover:bg-slate-100"
                                >
                                  <Maximize2 className="h-3.5 w-3.5" />
                                  <span>Agrandir</span>
                                </button>
                                <a
                                  href={att.fileUrl}
                                  target="_blank"
                                  download
                                  className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  <span>Télécharger</span>
                                </a>
                              </div>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-black/5 max-h-80 flex items-center justify-center">
                              <img
                                src={att.fileUrl}
                                alt={att.fileName}
                                className="w-full h-auto max-h-80 object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
                                onClick={() => setZoomedImage(att.fileUrl)}
                              />
                            </div>
                          </div>
                        )}

                        {/* 3. LECTEUR VIDÉO CITOYEN */}
                        {isVideo && (
                          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-emerald-700" />
                                <span className="font-bold text-xs text-slate-800">
                                  {att.fileName}
                                </span>
                              </div>
                              <a
                                href={att.fileUrl}
                                target="_blank"
                                download
                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:underline"
                              >
                                <Download className="h-3.5 w-3.5" /> Télécharger
                              </a>
                            </div>
                            <video
                              controls
                              src={att.fileUrl}
                              className="w-full rounded-xl max-h-80 bg-black shadow"
                            >
                              Votre navigateur ne supporte pas la lecture vidéo.
                            </video>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : isAudioRumor ? (
                /* Fallback intelligent : Si l'alerte mentionne un audio mais sans pièce jointe enregistrée */
                <div className="rounded-2xl bg-emerald-50/80 p-4 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold ring-2 ring-emerald-300">
                        <Volume2 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-emerald-950">
                            Enregistrement vocal WhatsApp reçu du citoyen
                          </span>
                          <span className="rounded bg-emerald-200 px-1.5 py-0.2 text-[9px] font-bold text-emerald-900">
                            Audio vocal
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-700">
                          audio_signalement_citoyen_agadez.ogg
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-emerald-200 shadow-sm space-y-2">
                    <audio
                      controls
                      src="https://actions.google.com/sounds/v1/speech/person_speaking_french.ogg"
                      className="w-full h-10 accent-emerald-700"
                    >
                      Votre navigateur ne supporte pas la lecture audio.
                    </audio>
                    <div className="flex items-center gap-1 h-5 px-1 opacity-80">
                      {[30, 50, 75, 40, 90, 70, 50, 75, 60, 40, 85, 70, 40, 80, 90, 60, 40, 70, 75, 50, 30, 85, 65, 45, 55].map(
                        (h, idx) => (
                          <span
                            key={idx}
                            className="flex-1 bg-emerald-600/70 rounded-full"
                            style={{ height: `${h}%` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
                  <Paperclip className="h-6 w-6 text-slate-400 mx-auto" />
                  <p>Aucun fichier multimédia n&apos;était joint à ce signalement textuel.</p>
                  <button
                    onClick={() => setShowAddMediaModal(true)}
                    className="inline-flex items-center gap-1 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                  >
                    + Joindre une preuve (Photo, Audio, Vidéo)
                  </button>
                </div>
              )}
            </div>

            {/* AI Assistant Help Card (Clearly marked as ASSISTIVE ONLY) */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>Assistance indicative par IA (Aide à la classification)</span>
              </div>
              <p className="text-xs text-amber-800/90 leading-relaxed mb-3">
                {report.aiSummary ||
                  "Signalement reçu et indexé. Pistes de recoupement suggérées auprès des autorités locales."}
              </p>
              {report.aiSuggestedLeads && (
                <div className="rounded-lg bg-white/80 p-3 border border-amber-200 text-xs">
                  <span className="font-semibold text-amber-900">Pistes suggérées : </span>
                  <span className="text-slate-700">{report.aiSuggestedLeads}</span>
                </div>
              )}
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span>
                  <strong>Règle de gouvernance :</strong> Aucune publication automatique. La
                  décision finale appartient obligatoirement au vérificateur humain.
                </span>
              </div>
            </div>

            {/* Step 4 & 5: Verification Field Work Form */}
            {report.verificationStep >= 3 && report.verificationStep <= 5 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-700" />
                    <span>Étape 4 & 5 : Consigner l&apos;enquête et les preuves de terrain</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Vérification auprès des autorités, leaders communautaires et sources officielles
                  </p>
                </div>

                <form onSubmit={handleSubmitVerification} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Verdict de vérification factuelle *
                    </label>
                    <select
                      value={verdict}
                      onChange={(e) => setVerdict(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-white font-semibold focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="FAUSSE">FAUSSE (Infox / Rumeur infondée réfutée)</option>
                      <option value="CONFIRMÉE">CONFIRMÉE (Information vraie et vérifiée)</option>
                      <option value="PARTIELLEMENT VRAIE">PARTIELLEMENT VRAIE (Éléments déformés)</option>
                      <option value="NON VÉRIFIABLE">NON VÉRIFIABLE (Absence de sources fiables)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Synthèse détaillée de l&apos;enquête de terrain *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Résultat des investigations de terrain menées auprès des autorités..."
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Réponse officielle rédigée pour le citoyen et le public *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={officialResponse}
                      onChange={(e) => setOfficialResponse(e.target.value)}
                      placeholder="Texte de démenti ou de clarification factuelle qui sera adressé au citoyen..."
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Notes internes & observations confidentielles
                    </label>
                    <input
                      type="text"
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      placeholder="Observations internes non publiques (protection des informateurs)..."
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  {/* Sources input */}
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                    <label className="block font-bold text-slate-800 uppercase mb-2">
                      Sources de vérification consultées
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={sourceName}
                        onChange={(e) => setSourceName(e.target.value)}
                        placeholder="Ex: Direction Régionale de la Santé d'Agadez..."
                        className="flex-1 rounded-lg border border-slate-300 p-2 text-xs"
                      />
                      <input
                        type="text"
                        value={sourceRole}
                        onChange={(e) => setSourceRole(e.target.value)}
                        placeholder="Rôle / Contact..."
                        className="w-48 rounded-lg border border-slate-300 p-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={addSource}
                        className="rounded-lg bg-emerald-700 px-3 py-2 text-white font-semibold hover:bg-emerald-800 cursor-pointer"
                      >
                        + Ajouter
                      </button>
                    </div>

                    {sourcesList.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {sourcesList.map((s, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-200"
                          >
                            <span>
                              <strong>{s.name}</strong> ({s.roleOrContact || "Source officielle"})
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold">
                              ✓ Enregistré
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      disabled={verifSubmitting}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800 disabled:opacity-70 cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                      {verifSubmitting
                        ? "Enregistrement..."
                        : "Valider l'enquête & Soumettre pour approbation (Étape 6)"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 6 & 7: Official Validation Card */}
            {activeVerification && (
              <div className="rounded-2xl border border-emerald-300 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span>Résultat de la vérification terrain</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Enquête menée par {activeVerification.verifier?.name} (
                      {activeVerification.verifier?.department})
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black border ${
                      STATUS_CONFIG[activeVerification.verdict]?.badge || "bg-slate-100"
                    }`}
                  >
                    Verdict : {activeVerification.verdict}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-600 uppercase text-[10px]">
                      Synthèse des faits :
                    </span>
                    <p className="mt-1 text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {activeVerification.summary}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-600 uppercase text-[10px]">
                      Réponse officielle :
                    </span>
                    <p className="mt-1 text-slate-900 bg-emerald-50/70 p-3 rounded-lg border border-emerald-200 font-medium">
                      {activeVerification.officialResponse}
                    </p>
                  </div>

                  {activeVerification.sources?.length > 0 && (
                    <div>
                      <span className="font-bold text-slate-600 uppercase text-[10px]">
                        Sources officielles consultées ({activeVerification.sources.length}) :
                      </span>
                      <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeVerification.sources.map((s: any) => (
                          <div
                            key={s.id}
                            className="rounded-lg bg-slate-50 p-2 border border-slate-200"
                          >
                            <p className="font-semibold text-slate-800">{s.name}</p>
                            <p className="text-[10px] text-slate-500">{s.roleOrContact || "-"}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Validation Action Button (Step 6 -> 7) */}
                  {!activeVerification.isApproved ? (
                    <div className="mt-6 rounded-xl bg-orange-50 p-4 border border-orange-200">
                      <h4 className="font-bold text-orange-950 text-xs mb-2">
                        Validation hiérarchique habilitée requise (Étape 6)
                      </h4>
                      <p className="text-xs text-orange-800 mb-3">
                        En tant que responsable communication ou administrateur, vous devez valider
                        officiellement ce résultat avant sa diffusion citoyenne.
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          id="pubAlert"
                          checked={publishAlert}
                          onChange={(e) => setPublishAlert(e.target.checked)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label
                          htmlFor="pubAlert"
                          className="text-xs font-semibold text-slate-800 cursor-pointer"
                        >
                          Publier immédiatement une alerte publique officielle et notifier le
                          citoyen via WhatsApp
                        </label>
                      </div>

                      <button
                        onClick={() => handleApproveVerification(activeVerification.id)}
                        disabled={validating}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800 disabled:opacity-70 cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {validating
                          ? "Validation en cours..."
                          : "Approuver et autoriser la publication officielle (Étape 7)"}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl bg-emerald-100/60 p-3 border border-emerald-300 text-emerald-950 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                        <div>
                          <p className="font-bold text-xs">Vérification approuvée & validée</p>
                          <p className="text-[10px] text-emerald-800">
                            Validée le {formatDate(activeVerification.validatedAt)}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-700 px-2.5 py-0.5 text-[10px] font-bold text-white">
                        Étape 7 Complétée
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Workflow Management (Assignment & Audit) */}
          <div className="space-y-6">
            {/* Step 3: Assignment Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-700" />
                <span>Affectation du vérificateur (Étape 3)</span>
              </h3>

              {report.assignments?.length > 0 ? (
                <div className="mt-3 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Membre actuellement assigné :
                  </span>
                  {report.assignments.map((as: any) => (
                    <div
                      key={as.id}
                      className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-200 flex items-start justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-emerald-950">{as.user.name}</p>
                        <p className="text-[10px] text-emerald-800">{as.user.department || as.user.role}</p>
                        {as.notes && (
                          <p className="mt-1 text-[11px] text-slate-600 italic">
                            &ldquo;{as.notes}&rdquo;
                          </p>
                        )}
                      </div>
                      <span className="rounded bg-emerald-200 px-1.5 py-0.5 text-[9px] font-bold text-emerald-900">
                        {as.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  Aucun vérificateur n&apos;est encore assigné à cette rumeur.
                </p>
              )}

              {/* Assignment Form */}
              <form onSubmit={handleAssign} className="mt-4 space-y-3 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Assigner ou Réaffecter à un membre :
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800 bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="">Choisir un membre PLCDA...</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role} - {m.department || "PLCDA"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Instructions spécifiques de mission :
                  </label>
                  <input
                    type="text"
                    value={assignNotes}
                    onChange={(e) => setAssignNotes(e.target.value)}
                    placeholder="Ex: Contacter d'urgence la chefferie de quartier..."
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedMemberId || assignLoading}
                  className="w-full rounded-xl bg-emerald-700 py-2 px-3 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
                >
                  {assignLoading ? "Affectation..." : "Confirmer l'affectation (Étape 3)"}
                </button>
              </form>
            </div>

            {/* Audit Activity Log for this Report */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                Historique & Journal d&apos;audit
              </h3>
              <div className="mt-3 space-y-3 max-h-80 overflow-y-auto">
                {report.activityLogs?.length === 0 ? (
                  <p className="text-xs text-slate-400">Aucun journal enregistré.</p>
                ) : (
                  report.activityLogs.map((log: any) => (
                    <div key={log.id} className="text-xs border-l-2 border-emerald-600 pl-3 py-1">
                      <p className="font-semibold text-slate-800">{log.action}</p>
                      {log.details && <p className="text-[11px] text-slate-600">{log.details}</p>}
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {log.user?.name || "Système"} &bull; {formatDate(log.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-black border border-white/20">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={zoomedImage}
              alt="Photo citoyenne agrandie"
              className="max-h-[85vh] w-auto object-contain mx-auto"
            />
          </div>
        </div>
      )}

      {/* Add Media Modal */}
      {showAddMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Joindre un média au signalement
                </h3>
                <p className="text-xs text-slate-500">
                  Photo, capture d&apos;écran, enregistrement audio ou document de preuve
                </p>
              </div>
              <button
                onClick={() => setShowAddMediaModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddAttachment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Type de média *
                </label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs bg-white font-semibold focus:outline-none"
                >
                  <option value="image">Image / Photo / Capture d&apos;écran</option>
                  <option value="audio">Audio / Message vocal WhatsApp</option>
                  <option value="video">Vidéo</option>
                  <option value="document">Document PDF / Communiqué</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Titre descriptif du fichier *
                </label>
                <input
                  type="text"
                  required
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  placeholder="Ex: capture_whatsapp_anou_araren.jpg"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  URL du fichier ou lien de stockage *
                </label>
                <input
                  type="url"
                  required
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMediaModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={mediaSaving}
                  className="rounded-xl bg-emerald-700 px-5 py-2 font-bold text-white hover:bg-emerald-800 disabled:opacity-70 cursor-pointer shadow-sm"
                >
                  {mediaSaving ? "Enregistrement..." : "Ajouter le média"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
