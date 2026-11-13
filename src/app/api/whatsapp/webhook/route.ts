import { NextRequest, NextResponse } from "next/server";
import { processInboundMessage } from "@/lib/whatsapp";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "agadez_plcda_webhook_verify_token_2026";

/**
 * 1. VÉRIFICATION DU WEBHOOK PAR META (GET)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook Meta WhatsApp vérifié avec succès !");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Interdit : Jeton de vérification incorrect", { status: 403 });
}

/**
 * 2. RÉCEPTION DES ÉVÉNEMENTS & MESSAGES ENTRANTS (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Vérifier si c'est un événement WhatsApp valide
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (message) {
        const from = message.from; // Numéro de téléphone de l'expéditeur
        const messageType = message.type;
        let textContent = "";
        let mediaUrl = "";

        if (messageType === "text") {
          textContent = message.text?.body || "";
        } else if (messageType === "image") {
          textContent = message.image?.caption || "Photo transmise";
          mediaUrl = message.image?.id ? `https://graph.facebook.com/v20.0/${message.image.id}` : "";
        } else if (messageType === "audio") {
          textContent = "Message vocal audio reçu";
          mediaUrl = message.audio?.id ? `https://graph.facebook.com/v20.0/${message.audio.id}` : "";
        } else if (messageType === "interactive") {
          textContent =
            message.interactive?.button_reply?.title ||
            message.interactive?.list_reply?.title ||
            "";
        }

        // Traitement automatique par le moteur conversationnel PLCDA
        await processInboundMessage({
          fromPhone: `+${from}`,
          text: textContent,
          mediaUrl,
          mediaType: messageType,
          channel: "WHATSAPP",
        });
      }

      return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
    }

    return NextResponse.json({ status: "IGNORED" }, { status: 404 });
  } catch (error) {
    console.error("Erreur Webhook WhatsApp:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
