import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, hasRole } from "@/lib/auth";

export async function GET() {
  try {
    const categories = await prisma.reportCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { reports: true, alerts: true },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasRole(user.role, ["SUPER_ADMIN", "ADMIN"])) {
      return NextResponse.json({ error: "Action réservée aux administrateurs" }, { status: 403 });
    }

    const { name, description, color, icon } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Le nom est obligatoire." }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const category = await prisma.reportCategory.create({
      data: {
        name,
        slug,
        description: description || null,
        color: color || "#0c7a3d",
        icon: icon || "Shield",
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
