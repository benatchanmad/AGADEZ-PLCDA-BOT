import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, logActivity } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { userId, notes } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Veuillez sélectionner un membre vérificateur." },
        { status: 400 }
      );
    }

    const report = await prisma.report.findUnique({
      where: { id: params.id },
    });

    if (!report) {
      return NextResponse.json({ error: "Signalement introuvable" }, { status: 404 });
    }

    const assignedUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!assignedUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Création de l'affectation
    const assignment = await prisma.assignment.create({
      data: {
        reportId: report.id,
        userId: assignedUser.id,
        assignedBy: currentUser?.name || "Administrateur",
        notes: notes || "Affectation pour vérification de terrain.",
      },
    });

    // Mise à jour du signalement -> Étape 3 (Affecté) ou Étape 4 (En cours de vérification)
    await prisma.report.update({
      where: { id: report.id },
      data: {
        status: "EN COURS DE VÉRIFICATION",
        verificationStep: 3,
      },
    });

    // Notification à l'utilisateur assigné
    await prisma.notification.create({
      data: {
        userId: assignedUser.id,
        title: `Affectation du signalement ${report.trackingCode}`,
        message: `Vous avez été désigné(e) pour vérifier la rumeur : "${report.title}".`,
        type: "ASSIGNMENT",
        link: `/signalements/${report.id}`,
      },
    });

    // Journal d'audit
    await logActivity({
      userId: currentUser?.id,
      reportId: report.id,
      action: "AFFECTATION_VERIFICATEUR",
      details: `Signalement affecté à ${assignedUser.name} (${assignedUser.role})`,
      req,
    });

    return NextResponse.json({ success: true, assignment });
  } catch (error) {
    console.error("Erreur affectation:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
