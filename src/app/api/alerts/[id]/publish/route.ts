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
        { error: "Seuls les responsables de communication et administrateurs peuvent publier une alerte." },
        { status: 403 }
      );
    }

    const { broadcastWhatsApp = true } = await req.json().catch(() => ({ broadcastWhatsApp: true }));

    const alert = await prisma.publicAlert.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!alert) {
      return NextResponse.json({ error: "Alerte introuvable" }, { status: 404 });
    }

    // Récupération des citoyens pour la diffusion
    const citizens = await prisma.citizen.findMany({
      where: { isBlocked: false },
      take: 50, // Diffusé aux citoyens actifs enregistrés
    });

    let broadcastCount = alert.broadcastCount;

    if (broadcastWhatsApp) {
      const broadcastText =
        `📢 *ALERTE OFFICIELLE PLCDA AGADEZ*\n\n` +
        `🔴 *${alert.title}*\n` +
        `🏷️ Statut : *${alert.verdict}*\n\n` +
        `📝 *Faits vérifiés :*\n${alert.description}\n\n` +
        `🔎 *Démenti / Précisions officielles :*\n${alert.factCheckContent}\n\n` +
        `_Sources consultées : ${alert.sourcesUsed || "Autorités compétentes & PLCDA"}_`;

      for (const c of citizens) {
        await sendWhatsAppMessage({
          to: c.phoneNumber,
          text: broadcastText,
        });
        broadcastCount++;
      }
    }

    const updatedAlert = await prisma.publicAlert.update({
      where: { id: alert.id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        validatorId: user.id,
        broadcastWhatsApp,
        broadcastCount,
      },
    });

    await logActivity({
      userId: user.id,
      action: "DIFFUSION_ALERTE_PUBLIQUE",
      details: `Alerte "${alert.title}" publiée et diffusée à ${citizens.length} citoyens via WhatsApp.`,
      req,
    });

    return NextResponse.json({ success: true, alert: updatedAlert, broadcastTo: citizens.length });
  } catch (error) {
    console.error("Erreur diffusion alerte:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
