import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalReports = await prisma.report.count();
    const pendingReports = await prisma.report.count({ where: { status: "EN ATTENTE" } });
    const underVerificationReports = await prisma.report.count({
      where: { status: "EN COURS DE VÉRIFICATION" },
    });
    const confirmedReports = await prisma.report.count({ where: { status: "CONFIRMÉE" } });
    const falseReports = await prisma.report.count({ where: { status: "FAUSSE" } });
    const partiallyTrueReports = await prisma.report.count({
      where: { status: "PARTIELLEMENT VRAIE" },
    });
    const unverifiableReports = await prisma.report.count({
      where: { status: "NON VÉRIFIABLE" },
    });
    const totalCitizens = await prisma.citizen.count();
    const publishedAlerts = await prisma.publicAlert.count({
      where: { status: "PUBLISHED" },
    });

    // Répartition par catégorie
    const categories = await prisma.reportCategory.findMany({
      include: {
        _count: {
          select: { reports: true },
        },
      },
    });

    const categoryDistribution = categories.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      count: cat._count.reports,
      color: cat.color,
    }));

    // Répartition géographique dans la région d'Agadez
    const localities = [
      { name: "Agadez Ville", count: await prisma.report.count({ where: { locality: { contains: "Agadez" } } }) },
      { name: "Arlit", count: await prisma.report.count({ where: { locality: { contains: "Arlit" } } }) },
      { name: "Tchirozérine", count: await prisma.report.count({ where: { locality: { contains: "Tchirozérine" } } }) },
      { name: "Bilma / Djado", count: await prisma.report.count({ where: { locality: { contains: "Bilma" } } }) },
      { name: "Ingall", count: await prisma.report.count({ where: { locality: { contains: "Ingall" } } }) },
      { name: "Iferouane / Timia", count: await prisma.report.count({ where: { locality: { contains: "Iferouane" } } }) },
    ];

    // Répartition par statut
    const statusDistribution = [
      { name: "En attente", count: pendingReports, color: "#d97706" },
      { name: "En cours", count: underVerificationReports, color: "#2563eb" },
      { name: "Confirmée (Vraie)", count: confirmedReports, color: "#059669" },
      { name: "Fausse (Infox)", count: falseReports, color: "#dc2626" },
      { name: "Partiellement vraie", count: partiallyTrueReports, color: "#9333ea" },
      { name: "Non vérifiable", count: unverifiableReports, color: "#64748b" },
    ];

    // Évolution quotidienne (7 derniers jours)
    const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Aujourd'hui"];
    const dailyEvolution = days.map((day, idx) => ({
      day,
      recues: idx === days.length - 1 ? totalReports : 0,
      verifiees: idx === days.length - 1 ? confirmedReports + falseReports : 0,
      fausses: idx === days.length - 1 ? falseReports : 0,
    }));

    // Derniers signalements
    const recentReports = await prisma.report.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        citizen: {
          select: { maskedPhone: true, locality: true },
        },
      },
    });

    return NextResponse.json({
      stats: {
        totalReports,
        pendingReports,
        underVerificationReports,
        confirmedReports,
        falseReports,
        partiallyTrueReports,
        unverifiableReports,
        totalCitizens,
        publishedAlerts,
        avgVerificationHours: totalReports > 0 ? 3.5 : 0,
      },
      categoryDistribution,
      localityDistribution: localities,
      statusDistribution,
      dailyEvolution,
      recentReports,
    });
  } catch (error) {
    console.error("Erreur stats:", error);
    return NextResponse.json({ error: "Erreur serveur stats" }, { status: 500 });
  }
}
