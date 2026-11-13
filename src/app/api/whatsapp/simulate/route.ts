import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { processInboundMessage } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const { phone = "+22790001122", message, mediaUrl, mediaType = "text" } = await req.json();

    if (!message && !mediaUrl) {
      return NextResponse.json({ error: "Message ou média requis" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\s+/g, "");

    // Exécution du workflow du bot
    const result = await processInboundMessage({
      fromPhone: cleanPhone,
      text: message,
      mediaUrl,
      mediaType,
      channel: "WHATSAPP_SIMULATOR",
    });

    // Récupération de l'historique complet pour ce numéro
    const messages = await prisma.whatsAppMessage.findMany({
      where: { phoneNumber: cleanPhone },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      result,
      messages,
    });
  } catch (error) {
    console.error("Erreur simulateur:", error);
    return NextResponse.json({ error: "Erreur simulateur" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone") || "+22790001122";
    const cleanPhone = phone.replace(/\s+/g, "");

    const messages = await prisma.whatsAppMessage.findMany({
      where: { phoneNumber: cleanPhone },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération" }, { status: 500 });
  }
}
