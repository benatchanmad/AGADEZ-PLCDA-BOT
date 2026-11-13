import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, hashPassword, hasRole, logActivity } from "@/lib/auth";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        department: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        _count: {
          select: {
            assignments: true,
            verifications: true,
          },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !hasRole(currentUser.role, ["SUPER_ADMIN", "ADMIN"])) {
      return NextResponse.json({ error: "Action non autorisée" }, { status: 403 });
    }

    const { name, email, password, role, department, phone } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Nom, email, mot de passe et rôle requis." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
        department: department || "PLCDA Agadez",
        phone: phone || null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
      },
    });

    await logActivity({
      userId: currentUser.id,
      action: "AJOUT_MEMBRE",
      details: `Création du compte membre pour ${name} (${role})`,
      req,
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Erreur ajout membre:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
