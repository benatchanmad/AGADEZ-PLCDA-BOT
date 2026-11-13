import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, logActivity } from "@/lib/auth";
import { generateTrackingCode } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const urgency = searchParams.get("urgency");
    const locality = searchParams.get("locality");

    // Construction du filtre Prisma
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { trackingCode: { contains: search } },
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category && category !== "ALL") {
      where.categoryId = category;
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (urgency && urgency !== "ALL") {
      where.urgency = urgency;
    }

    if (locality && locality !== "ALL") {
      where.locality = { contains: locality };
    }

    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        citizen: {
          select: { maskedPhone: true, locality: true },
        },
        assignments: {
          include: {
            user: { select: { id: true, name: true, role: true } },
          },
        },
        verifications: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Erreur récupération signalements:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { title, description, categoryId, urgency, locality, channel = "WEB" } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Le titre et la description sont obligatoires." },
        { status: 400 }
      );
    }

    const trackingCode = generateTrackingCode();

    const report = await prisma.report.create({
      data: {
        trackingCode,
        title,
        description,
        categoryId: categoryId || null,
        urgency: urgency || "MOYENNE",
        locality: locality || "Région d'Agadez",
        channel,
        status: "EN ATTENTE",
        verificationStep: 1,
      },
      include: { category: true },
    });

    // Journal d'audit
    await logActivity({
      userId: user?.id,
      reportId: report.id,
      action: "CREATION_SIGNALEMENT",
      details: `Création du signalement ${trackingCode} via canal ${channel}`,
      req,
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Erreur création signalement:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
