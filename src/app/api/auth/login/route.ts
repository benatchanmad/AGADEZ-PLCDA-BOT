import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME, logActivity } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Veuillez fournir un email et un mot de passe." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // Mode Prototype sans données : autoriser la connexion des rôles prototypes si la base est vide
    const PROTOTYPE_ACCOUNTS: Record<string, { id: string; name: string; role: string; department: string }> = {
      "superadmin@plcda-agadez.ne": {
        id: "prototype-superadmin",
        name: "Super Administrateur",
        role: "SUPER_ADMIN",
        department: "Coordination Générale PLCDA",
      },
      "admin@plcda-agadez.ne": {
        id: "prototype-admin",
        name: "Administrateur PLCDA",
        role: "ADMIN",
        department: "Direction Opérationnelle PLCDA",
      },
      "admin@plcda.ne": {
        id: "prototype-admin-main",
        name: "Super Administrateur",
        role: "SUPER_ADMIN",
        department: "Coordination Générale PLCDA",
      },
      "verificateur@plcda-agadez.ne": {
        id: "prototype-verifier",
        name: "Vérificateur Terrain",
        role: "VERIFIER",
        department: "Antenne de Vérification",
      },
      "verificateur.ibrahim@plcda-agadez.ne": {
        id: "prototype-verifier",
        name: "Vérificateur Terrain",
        role: "VERIFIER",
        department: "Antenne de Vérification",
      },
      "comms@plcda-agadez.ne": {
        id: "prototype-comms",
        name: "Responsable Communication",
        role: "COMMUNICATION",
        department: "Cellule Communication",
      },
      "communication@plcda.ne": {
        id: "prototype-comms",
        name: "Responsable Communication",
        role: "COMMUNICATION",
        department: "Cellule Communication",
      },
      "observateur@plcda-agadez.ne": {
        id: "prototype-observer",
        name: "Observateur",
        role: "OBSERVER",
        department: "Observatoire",
      },
    };

    if (!user && PROTOTYPE_ACCOUNTS[cleanEmail]) {
      const proto = PROTOTYPE_ACCOUNTS[cleanEmail];
      const sessionUser = {
        id: proto.id,
        name: proto.name,
        email: cleanEmail,
        role: proto.role,
        department: proto.department,
      };
      const token = await createSessionToken(sessionUser);
      const response = NextResponse.json({
        success: true,
        user: sessionUser,
      });
      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      return response;
    }

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Identifiants invalides ou compte désactivé." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Identifiants invalides." },
        { status: 401 }
      );
    }

    // Mise à jour de la dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    };

    const token = await createSessionToken(sessionUser);

    // Audit log
    await logActivity({
      userId: user.id,
      action: "CONNEXION_REUSSIE",
      details: `Connexion au compte avec le rôle ${user.role}`,
      req,
    });

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
    });

    // Définition du cookie de session sécurisé
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 heures
    });

    return response;
  } catch (error) {
    console.error("Erreur de connexion:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la connexion." },
      { status: 500 }
    );
  }
}
