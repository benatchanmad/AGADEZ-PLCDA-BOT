import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, logActivity } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const { fileName, fileUrl, fileType = "image", fileSize } = await req.json();

    if (!fileName || !fileUrl) {
      return NextResponse.json(
        { error: "Le nom du fichier et l'URL sont obligatoires." },
        { status: 400 }
      );
    }

    const report = await prisma.report.findUnique({
      where: { id: params.id },
    });

    if (!report) {
      return NextResponse.json({ error: "Signalement introuvable" }, { status: 404 });
    }

    const attachment = await prisma.reportAttachment.create({
      data: {
        reportId: report.id,
        fileName,
        fileUrl,
        fileType,
        fileSize: fileSize || 500000,
      },
    });

    await logActivity({
      userId: user?.id,
      reportId: report.id,
      action: "AJOUT_PIECE_JOINTE",
      details: `Ajout du média "${fileName}" (${fileType})`,
      req,
    });

    return NextResponse.json({ success: true, attachment });
  } catch (error) {
    console.error("Erreur ajout pièce jointe:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
