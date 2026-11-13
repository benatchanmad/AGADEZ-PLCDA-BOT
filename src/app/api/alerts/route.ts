import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, logActivity } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const alerts = await prisma.publicAlert.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        report: { select: { id: true, trackingCode: true, title: true } },
        validator: { select: { name: true, role: true } },
      },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Erreur alertes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      factCheckContent,
      categoryId,
      priority = "MOYENNE",
      verdict = "FAUSSE",
      sourcesUsed,
      imageUrl,
      status = "DRAFT",
    } = body;

    if (!title || !description || !factCheckContent) {
      return NextResponse.json(
        { error: "Titre, résumé et contenu de clarification sont obligatoires." },
        { status: 400 }
      );
    }

    const slug = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 50)}-${Date.now().toString().slice(-4)}`;

    const alert = await prisma.publicAlert.create({
      data: {
        title,
        slug,
        description,
        factCheckContent,
        categoryId: categoryId || null,
        priority,
        verdict,
        sourcesUsed: sourcesUsed || "Cellule de vérification PLCDA Agadez",
        imageUrl: imageUrl || null,
        authorId: user.id,
        validatorId: status === "PUBLISHED" ? user.id : null,
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
      include: { category: true },
    });

    await logActivity({
      userId: user.id,
      action: "CREATION_ALERTE",
      details: `Création de l'alerte publique: "${title}" (statut: ${status})`,
      req,
    });

    return NextResponse.json({ success: true, alert });
  } catch (error) {
    console.error("Erreur création alerte:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
