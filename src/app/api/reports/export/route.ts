import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "json";

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        citizen: { select: { maskedPhone: true, locality: true } },
        verifications: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: { verifier: { select: { name: true } } },
        },
      },
    });

    if (format === "csv") {
      const header = [
        "Code de suivi",
        "Date reception",
        "Titre",
        "Categorie",
        "Statut",
        "Etape",
        "Urgence",
        "Localite",
        "Verificateur",
      ].join(";");

      const rows = reports.map((r) => {
        const verifierName = r.verifications[0]?.verifier?.name || "Non assigné";
        return [
          `"${r.trackingCode}"`,
          `"${formatDate(r.createdAt, false)}"`,
          `"${r.title.replace(/"/g, '""')}"`,
          `"${r.category?.name || "Non catégorisé"}"`,
          `"${r.status}"`,
          `"Étape ${r.verificationStep}/7"`,
          `"${r.urgency}"`,
          `"${r.locality || "-"}"`,
          `"${verifierName}"`,
        ].join(";");
      });

      const csvContent = "\uFEFF" + [header, ...rows].join("\r\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="rapport-plcda-agadez-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ reports });
  } catch (error) {
    return NextResponse.json({ error: "Erreur export" }, { status: 500 });
  }
}
