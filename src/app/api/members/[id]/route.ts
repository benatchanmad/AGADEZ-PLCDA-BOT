import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, hashPassword, hasRole, logActivity } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        phone: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !hasRole(currentUser.role, ["SUPER_ADMIN", "ADMIN"])) {
      return NextResponse.json({ error: "Action non autorisée" }, { status: 403 });
    }

    const { name, email, role, department, phone, isActive, password } = await req.json();

    const existing = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });
    }

    // Si l'email est modifié, vérifier qu'il n'est pas déjà pris
    if (email && email.toLowerCase().trim() !== existing.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
      if (emailTaken) {
        return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 400 });
      }
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase().trim();
    if (role) updateData.role = role;
    if (department !== undefined) updateData.department = department;
    if (phone !== undefined) updateData.phone = phone;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (password && password.trim()) {
      updateData.password = await hashPassword(password);
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        phone: true,
        isActive: true,
      },
    });

    await logActivity({
      userId: currentUser.id,
      action: "MODIFICATION_MEMBRE",
      details: `Mise à jour du profil de ${updated.name} (${updated.role})`,
      req,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Erreur modification membre:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !hasRole(currentUser.role, ["SUPER_ADMIN", "ADMIN"])) {
      return NextResponse.json({ error: "Action non autorisée" }, { status: 403 });
    }

    // Protection : Empêcher l'utilisateur de supprimer son propre compte
    if (currentUser.id === params.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre compte en cours de session." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });
    }

    // Suppression sécurisée ordonnée
    // Supprimer les notifications du membre
    await prisma.notification.deleteMany({ where: { userId: params.id } });
    
    // Dissocier ou supprimer les assignations et logs d'activité
    await prisma.assignment.deleteMany({ where: { userId: params.id } });
    await prisma.activityLog.deleteMany({ where: { userId: params.id } });
    
    // Dissocier les alertes où l'utilisateur était validateur
    await prisma.publicAlert.updateMany({
      where: { validatorId: params.id },
      data: { validatorId: null },
    });

    // Supprimer les vérifications faites par ce membre si existantes
    const userVerifications = await prisma.verification.findMany({
      where: { verifierId: params.id },
      select: { id: true },
    });
    for (const v of userVerifications) {
      await prisma.verificationSource.deleteMany({ where: { verificationId: v.id } });
      await prisma.verificationEvidence.deleteMany({ where: { verificationId: v.id } });
    }
    await prisma.verification.deleteMany({ where: { verifierId: params.id } });

    // Suppression finale de l'utilisateur
    await prisma.user.delete({
      where: { id: params.id },
    });

    await logActivity({
      userId: currentUser.id,
      action: "SUPPRESSION_MEMBRE",
      details: `Suppression définitive du compte de ${targetUser.name} (${targetUser.email})`,
      req,
    });

    return NextResponse.json({ success: true, message: "Membre supprimé avec succès." });
  } catch (error) {
    console.error("Erreur suppression membre:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la suppression." }, { status: 500 });
  }
}
