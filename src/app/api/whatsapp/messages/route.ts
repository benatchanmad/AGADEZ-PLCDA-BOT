import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.whatsAppMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        citizen: {
          select: { name: true, maskedPhone: true, locality: true },
        },
      },
    });

    const totalInbound = await prisma.whatsAppMessage.count({ where: { direction: "INBOUND" } });
    const totalOutbound = await prisma.whatsAppMessage.count({ where: { direction: "OUTBOUND" } });

    return NextResponse.json({ messages, totalInbound, totalOutbound });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
