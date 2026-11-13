import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, logActivity } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const {
      reportId,
      verdict,
      summary,
      officialResponse,
      internalNotes,
      sources = [],
      evidence = [],
    } = body;

    if (!reportId || !verdict || !summary || !officialResponse) {
      return NextResponse.json(
        { error: "Veuillez renseigner le rapport, le verdict, la synthèse et la réponse officielle." },
        { status: 400 }
      );
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json({ error: "Signalement introuvable." }, { status: 404 });
    }

    // Création de la vérification terrain (Étape 4 & 5 complétées, passage à l'étape 6 : Soumission)
    const verification = await prisma.verification.create({
      data: {
        reportId: report.id,
        verifierId: user.id,
        verdict,
        summary,
        officialResponse,
        internalNotes: internalNotes || null,
        step: 6,
        submittedForValidationAt: new Date(),
        sources: {
          create: sources.map((s: { name: string; roleOrContact?: string; sourceType?: string; reliability?: string; notes?: string; isConfidential?: boolean }) => ({
            name: s.name,
            roleOrContact: s.roleOrContact || null,
            sourceType: s.sourceType || "OFFICIAL",
            reliability: s.reliability || "HIGH",
            notes: s.notes || null,
            isConfidential: s.isConfidential ?? true,
          })),
        },
        evidence: {
          create: evidence.map((e: { title: string; fileUrl: string; fileType?: string; description?: string }) => ({
            title: e.title,
            fileUrl: e.fileUrl,
            fileType: e.fileType || "image",
            description: e.description || null,
          })),
        },
      },
      include: { sources: true, evidence: true },
    });

    // Mise à jour de l'étape du signalement vers Étape 6 : En attente de validation
    await prisma.report.update({
      where: { id: report.id },
      data: {
        verificationStep: 6,
      },
    });

    // Notifier les responsables communication et administrateurs
    const validators = await prisma.user.findMany({
      where: {
        role: { in: ["COMMUNICATION", "ADMIN", "SUPER_ADMIN"] },
        isActive: true,
      },
    });

    for (const val of validators) {
      await prisma.notification.create({
        data: {
          userId: val.id,
          title: `Validation requise : ${report.trackingCode}`,
          message: `La vérification du signalement "${report.title}" par ${user.name} a été soumise pour validation finale.`,
          type: "VALIDATION",
          link: `/verifications`,
        },
      });
    }

    // Journal d'audit
    await logActivity({
      userId: user.id,
      reportId: report.id,
      action: "SOUMISSION_VERIFICATION",
      details: `Vérification complétée avec verdict "${verdict}" et ${sources.length} sources renseignées. Soumis à validation.`,
      req,
    });

    return NextResponse.json({ success: true, verification });
  } catch (error) {
    console.error("Erreur enregistrement vérification:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
