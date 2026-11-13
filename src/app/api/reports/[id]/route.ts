import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, logActivity } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        citizen: {
          select: {
            id: true,
            maskedPhone: true,
            name: true,
            language: true,
            locality: true,
            reputationScore: true,
          },
        },
        attachments: true,
        assignments: {
          include: {
            user: {
              select: { id: true, name: true, role: true, department: true },
            },
          },
          orderBy: { assignedAt: "desc" },
        },
        verifications: {
          include: {
            verifier: {
              select: { id: true, name: true, role: true, department: true },
            },
            sources: true,
            evidence: true,
          },
          orderBy: { createdAt: "desc" },
        },
        publicAlert: true,
        activityLogs: {
          include: {
            user: { select: { name: true, role: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Signalement introuvable" }, { status: 404 });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Erreur récupération signalement:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { status, verificationStep, categoryId, urgency, locality, title, description } = body;

    const updated = await prisma.report.update({
      where: { id: params.id },
      data: {
        ...(status ? { status } : {}),
        ...(verificationStep ? { verificationStep } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(urgency ? { urgency } : {}),
        ...(locality ? { locality } : {}),
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
      },
      include: { category: true },
    });

    await logActivity({
      userId: user?.id,
      reportId: updated.id,
      action: "MODIFICATION_SIGNALEMENT",
      details: `Mise à jour statut: ${status || updated.status}, étape: ${verificationStep || updated.verificationStep}`,
      req,
    });

    return NextResponse.json({ success: true, report: updated });
  } catch (error) {
    console.error("Erreur mise à jour signalement:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
