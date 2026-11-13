import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, logActivity, hasRole } from "@/lib/auth";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasRole(user.role, ["COMMUNICATION", "ADMIN", "SUPER_ADMIN"])) {
      return NextResponse.json(
        { error: "Vous n'avez pas l'autorisation d'approuver une vérification officielle." },
        { status: 403 }
      );
    }

    const { validationNotes, publishPublicAlert = false, alertPriority = "MOYENNE" } =
      await req.json();

    const verification = await prisma.verification.findUnique({
      where: { id: params.id },
      include: {
        report: {
          include: { citizen: true, category: true },
        },
      },
    });

    if (!verification) {
      return NextResponse.json({ error: "Vérification introuvable" }, { status: 404 });
    }

    // 1. Approbation officielle de la vérification (Étape 6 validée)
    const updatedVerification = await prisma.verification.update({
      where: { id: verification.id },
      data: {
        isApproved: true,
        validatedById: user.id,
        validatedAt: new Date(),
        validationNotes: validationNotes || "Vérification approuvée conformément aux procédures de vérité factuelle.",
        step: 7,
      },
    });

    // 2. Mise à jour du signalement (Étape 7 : Publication / Verdict final)
    const updatedReport = await prisma.report.update({
      where: { id: verification.reportId },
      data: {
        status: verification.verdict,
        verificationStep: 7,
        isPublished: publishPublicAlert,
      },
    });

    // 3. Si publication publique demandée, créer ou mettre à jour l'alerte publique
    let publicAlert = null;
    if (publishPublicAlert) {
      const slug = `alerte-${verification.report.trackingCode.toLowerCase()}-${Date.now().toString().slice(-4)}`;
      publicAlert = await prisma.publicAlert.upsert({
        where: { reportId: verification.reportId },
        create: {
          reportId: verification.reportId,
          categoryId: verification.report.categoryId,
          title: `CLARIFICATION OFFICIELLE : ${verification.report.title}`,
          slug,
          description: verification.summary,
          factCheckContent: verification.officialResponse,
          priority: alertPriority,
          verdict: verification.verdict,
          sourcesUsed: "Sources vérifiées PLCDA Agadez",
          authorId: verification.verifierId,
          validatorId: user.id,
          status: "PUBLISHED",
          publishedAt: new Date(),
          broadcastWhatsApp: true,
        },
        update: {
          status: "PUBLISHED",
          publishedAt: new Date(),
          validatorId: user.id,
        },
      });
    }

    // 4. Notification au citoyen via WhatsApp si le numéro est connu
    if (verification.report.citizen?.phoneNumber) {
      const citizenMsg =
        `🔔 *RÉSULTAT DE VOTRE SIGNALEMENT ${verification.report.trackingCode}*\n\n` +
        `Nos équipes ont finalisé les vérifications officielles auprès des autorités et sources de terrain.\n\n` +
        `📌 *Verdict officiel :* *${verification.verdict}*\n\n` +
        `💡 *Précisions officielles :*\n${verification.officialResponse}\n\n` +
        `Merci de votre contribution citoyenne à la paix et à la vérité dans la région d'Agadez.\n` +
        `_PLCDA Agadez_`;

      await sendWhatsAppMessage({
        to: verification.report.citizen.phoneNumber,
        text: citizenMsg,
      });
    }

    // Journal d'audit
    await logActivity({
      userId: user.id,
      reportId: verification.reportId,
      action: "VALIDATION_ETAPE_7",
      details: `Vérification approuvée avec verdict ${verification.verdict}. Publication alerte: ${publishPublicAlert}`,
      req,
    });

    return NextResponse.json({
      success: true,
      verification: updatedVerification,
      report: updatedReport,
      publicAlert,
    });
  } catch (error) {
    console.error("Erreur approbation vérification:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
