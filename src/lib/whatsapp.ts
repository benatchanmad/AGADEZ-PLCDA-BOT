// ==============================================================================
// GESTIONNAIRE WHATSAPP BUSINESS CLOUD API & SIMULATEUR PLCDA AGADEZ
// Intégration officielle Meta Graph API + Moteur interactif de démonstration
// ==============================================================================

import prisma from "./prisma";
import { generateTrackingCode, maskPhoneNumber } from "./utils";

const META_API_VERSION = process.env.WHATSAPP_API_VERSION || "v20.0";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "";
const IS_DEMO_MODE =
  process.env.WHATSAPP_DEMO_MODE === "true" || !PHONE_NUMBER_ID || !ACCESS_TOKEN;

// Menus multilingues
export const BOT_TEXTS = {
  fr: {
    welcome:
      "🌟 *BIENVENUE SUR AGADEZ PLCDA BOT*\n\n" +
      "Plateforme Locale de Concertation, de Dialogue et d'Action pour la paix et la cohésion sociale dans la région d'Agadez.\n\n" +
      "Ensemble, luttons contre les rumeurs et la désinformation.\n\n" +
      "👉 *1* - Poser une question (FAQ)\n" +
      "👉 *2* - Signaler une rumeur suspecte\n" +
      "👉 *3* - Vérifier une information (avec référence)\n" +
      "👉 *4* - Consulter les alertes officielles\n" +
      "👉 *5* - Conseils contre la désinformation\n" +
      "👉 *6* - Changer de langue (Hausa / Tamasheq / Arabe)\n\n" +
      "_Répondez avec le chiffre de votre choix._",
    askReportPrompt:
      "📝 *SIGNALER UNE RUMEUR*\n\n" +
      "Veuillez décrire la rumeur avec un maximum de détails :\n" +
      "- De quoi s'agit-il ?\n" +
      "- Dans quelle localité / quartier (Agadez, Arlit, Bilma, Tchirozérine, Ingall...) ?\n" +
      "- Avez-vous une photo, capture ou audio ? (Vous pouvez l'envoyer directement).\n\n" +
      "_Votre identité restera strictement confidentielle._",
    reportSuccess: (code: string) =>
      `✅ *SIGNALEMENT ENREGISTRÉ AVEC SUCCÈS*\n\n` +
      `Votre numéro de suivi confidentiel est :\n*${code}*\n\n` +
      `Nos vérificateurs mènent actuellement les investigations auprès des sources officielles et autorités compétentes.\n` +
      `Vous serez informé(e) dès validation de la réponse officielle.`,
    askCodePrompt:
      "🔍 *VÉRIFICATION D'UNE INFORMATION*\n\n" +
      "Veuillez saisir votre numéro de référence (Ex: PLCDA-2026-0001) ou des mots-clés de la rumeur :",
    reportNotFound: "❌ Aucun signalement ne correspond à cette référence. Veuillez vérifier le code.",
    reportStatus: (code: string, status: string, title: string, verdictText?: string) =>
      `📊 *STATUT DU SIGNALEMENT ${code}*\n\n` +
      `📌 *Sujet :* ${title}\n` +
      `🏷️ *Statut :* *${status}*\n\n` +
      (verdictText ? `💡 *Réponse officielle :*\n${verdictText}` : `⏳ *En cours d'enquête sur le terrain.*`),
    tips:
      "🛡️ *CONSEILS CONTRE LA DÉSINFORMATION*\n\n" +
      "1. Vérifiez toujours la source avant de partager.\n" +
      "2. Méfiez-vous des audios anonymes et alarmistes.\n" +
      "3. Demandez-vous : qui a intérêt à propager cette rumeur ?\n" +
      "4. En cas de doute, signalez-la sur AGADEZ PLCDA BOT.",
    changeLanguagePrompt:
      "🌍 *CHOIX DE LA LANGUE / ZABIN HARSHENKA*\n\n" +
      "1 - Français\n" +
      "2 - Hausa (Harshen Hausa)\n" +
      "3 - Tamasheq (Tamasheq)\n" +
      "4 - Arabe (العربية)\n\n" +
      "Tapez 1, 2, 3 ou 4 :",
  },
  ha: {
    welcome:
      "🌟 *BARKA DA ZUWA AGADEZ PLCDA BOT*\n\n" +
      "Dandalin tabbatar da zaman lafiya da yaki da labaran karya a yankin Agadez.\n\n" +
      "1 - Yi tambaya (FAQ)\n" +
      "2 - Aika rahoton labarin karya\n" +
      "3 - Bincika labari ta lambar shaida\n" +
      "4 - Duba sanarwar gwamnati da hukumomi\n" +
      "5 - Shawarwari kan yaki da karya\n" +
      "6 - Canza harshe\n\n" +
      "_Aika lambar da kake so._",
    askReportPrompt:
      "📝 *AIKA RAHOTON LABARIN KARYA*\n\n" +
      "Bayyana labarin da kaji da inda abin ya faru (Agadez, Arlit, Tchirozérine, Bilma...).\n" +
      "Zaka iya tura hoto ko murya.",
    reportSuccess: (code: string) =>
      `✅ *AN KARBI RAHOTONKA*\n\nLambar bin diddigin ka ita ce:\n*${code}*\n\nMasu bincikenmu suna kan aiki.`,
    askCodePrompt: "🔍 *BIN DIDDIGIN LABARI*\n\nDa fatan za a rubuta lambar shaida (Misali: PLCDA-2026-0001) :",
    reportNotFound: "❌ Ba a sami wani rahoto da wannan lambar ba. Da fatan a sake dubawa.",
    reportStatus: (code: string, status: string, title: string, verdictText?: string) =>
      `📊 *MATSAYIN RAHOTO ${code}*\n\n📌 *Maudu'i :* ${title}\n🏷️ *Matsayi :* *${status}*\n\n` +
      (verdictText ? `💡 *Amsar hukuma :*\n${verdictText}` : `⏳ *Ana kan bincike.*`),
    tips: "🛡️ *SHAWARWARI*\n1. Tabbatar da tushen labari.\n2. Kada ka yada sakon da ba ka da tabbas akansa.\n3. Tambayi PLCDA kafin ka tura wa wasu.",
    changeLanguagePrompt: "🌍 *ZABIN HARSHENKA*\n\n1 - Français\n2 - Hausa\n3 - Tamasheq\n4 - Arabe",
  },
  tmq: {
    welcome:
      "🌟 *ANSOUF YESSEN DAƔ AGADEZ PLCDA BOT*\n\n" +
      "Edeles n əssəlam d-əzzəgzan fəl rumeurs daɣ Agadez.\n\n" +
      "1 - Təssəna arat (FAQ)\n" +
      "2 - Taza rumeur fəl enettafen\n" +
      "3 - Təssəna tidət n nomro\n" +
      "4 - Elxabaran n əddewlət\n" +
      "5 - Imaslan fəl tidət\n" +
      "6 - Təsnəfləst awal\n\n" +
      "_Azen nomro as təxsed._",
    askReportPrompt: "📝 Azen elxabar d-adag as iga daɣ Agadez.",
    reportSuccess: (code: string) => `✅ Nomro-nek iga: *${code}*`,
    askCodePrompt: "🔍 Azen nomro n elxabar-nek (Ex: PLCDA-2026-0001) :",
    reportNotFound: "❌ Wər nufi elxabar daɣ nomro wa.",
    reportStatus: (code: string, status: string, title: string, verdictText?: string) =>
      `📊 *STATUT ${code}*\n\n📌 *Arat :* ${title}\n🏷️ *Statut :* *${status}*\n\n` +
      (verdictText ? `💡 *Awal n əddewlət :*\n${verdictText}` : `⏳ *Eselli illa.*`),
    tips: "🛡️ Ghadəl elxabar wər ten-tuzina fəl meddan s əmmiyad.",
    changeLanguagePrompt: "🌍 Təsnəfləst awal :\n1 - Français\n2 - Hausa\n3 - Tamasheq\n4 - Arabe",
  },
  ar: {
    welcome:
      "🌟 *مرحباً بكم في منصة AGADEZ PLCDA BOT*\n\n" +
      "منصة مكافحة الشائعات والمعلومات المضللة في منطقة أغاديز.\n\n" +
      "1 - طرح سؤال (الأسئلة الشائعة)\n" +
      "2 - الإبلاغ عن شائعة مشبوهة\n" +
      "3 - التحقق من صحة خبر برقم التتبع\n" +
      "4 - التنبيهات والبيانات الرسمية\n" +
      "5 - نصائح للوقاية من التضليل\n" +
      "6 - تغيير اللغة\n\n" +
      "_يرجى الرد برقم الخيار._",
    askReportPrompt: "📝 يرجى كتابة تفاصيل الشائعة مع ذكر المدينة أو الحي.",
    reportSuccess: (code: string) => `✅ تم تسجيل البلاغ بنجاح.\nرمز المتابعة الخاص بك: *${code}*`,
    askCodePrompt: "🔍 يرجى إدخال رمز المتابعة (مثال: PLCDA-2026-0001) :",
    reportNotFound: "❌ لم يتم العثور على أي بلاغ بهذا الرمز. يرجى التحقق وإعادة المحاولة.",
    reportStatus: (code: string, status: string, title: string, verdictText?: string) =>
      `📊 *حالة البلاغ ${code}*\n\n📌 *الموضوع :* ${title}\n🏷️ *الحالة :* *${status}*\n\n` +
      (verdictText ? `💡 *الرد الرسمي :*\n${verdictText}` : `⏳ *التحقيق الميداني جاري.*`),
    tips: "🛡️ تأكد دائماً من المصادر الرسمية قبل إعادة نشر أي خبر.",
    changeLanguagePrompt: "🌍 اختر لغة المحادثة :\n1 - الفرنسية\n2 - الهوسا\n3 - التماشق\n4 - العربية",
  },
};

/**
 * Envoie un message WhatsApp (Réel Meta API ou Simulé en local)
 */
export async function sendWhatsAppMessage({
  to,
  text,
  mediaUrl,
  type = "text",
}: {
  to: string;
  text: string;
  mediaUrl?: string;
  type?: string;
}): Promise<{ success: boolean; messageId: string; demo: boolean }> {
  const cleanPhone = to.replace(/\s+/g, "");

  // Journalisation en base de données dans tous les cas
  const messageRecord = await prisma.whatsAppMessage.create({
    data: {
      phoneNumber: cleanPhone,
      direction: "OUTBOUND",
      type,
      body: text,
      mediaUrl: mediaUrl || null,
      status: "sent",
    },
  });

  // Si on est en mode DEMO ou si les clés Meta ne sont pas configurées
  if (IS_DEMO_MODE) {
    console.log(`[WHATSAPP-DEMO] ➡️ Message envoyé à ${cleanPhone} :\n${text}`);
    return {
      success: true,
      messageId: messageRecord.id,
      demo: true,
    };
  }

  // Appel réel à Meta WhatsApp Cloud API
  try {
    const url = `https://graph.facebook.com/${META_API_VERSION}/${PHONE_NUMBER_ID}/messages`;
    const payload: Record<string, unknown> = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanPhone.replace("+", ""),
      type: "text",
      text: { body: text },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[WHATSAPP-META-ERROR]", data);
      return { success: false, messageId: messageRecord.id, demo: false };
    }

    const metaId = data.messages?.[0]?.id || messageRecord.id;
    await prisma.whatsAppMessage.update({
      where: { id: messageRecord.id },
      data: { metaMessageId: metaId, status: "delivered" },
    });

    return { success: true, messageId: metaId, demo: false };
  } catch (err) {
    console.error("[WHATSAPP-SEND-FAIL]", err);
    return { success: false, messageId: messageRecord.id, demo: false };
  }
}

/**
 * Traite un message entrant provenant d'un citoyen (Webhook ou Simulateur)
 */
export async function processInboundMessage({
  fromPhone,
  text,
  mediaUrl,
  mediaType,
  channel = "WHATSAPP",
}: {
  fromPhone: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  channel?: string;
}) {
  const cleanPhone = fromPhone.replace(/\s+/g, "");

  // 1. Récupération ou création du citoyen
  let citizen = await prisma.citizen.findUnique({
    where: { phoneNumber: cleanPhone },
  });

  if (!citizen) {
    citizen = await prisma.citizen.create({
      data: {
        phoneNumber: cleanPhone,
        maskedPhone: maskPhoneNumber(cleanPhone),
        language: "fr",
      },
    });
  }

  // 2. Enregistrement du message entrant
  await prisma.whatsAppMessage.create({
    data: {
      citizenId: citizen.id,
      phoneNumber: cleanPhone,
      direction: "INBOUND",
      type: mediaType || (mediaUrl ? "image" : "text"),
      body: text || "[Média joint]",
      mediaUrl: mediaUrl || null,
      status: "received",
    },
  });

  const lang = (citizen.language as "fr" | "ha" | "tmq" | "ar") || "fr";
  const texts = BOT_TEXTS[lang] || BOT_TEXTS.fr;
  const trimmed = text?.trim() || "";

  // 3. Logique conversationnelle interactive
  // A. Changement de langue
  if (trimmed === "6" || trimmed.toLowerCase() === "langue") {
    await sendWhatsAppMessage({ to: cleanPhone, text: BOT_TEXTS.fr.changeLanguagePrompt });
    return { action: "MENU_LANG" };
  }

  if (trimmed === "lang:ha" || (trimmed === "2" && citizen.notes === "WAITING_LANG")) {
    await prisma.citizen.update({ where: { id: citizen.id }, data: { language: "ha", notes: null } });
    await sendWhatsAppMessage({ to: cleanPhone, text: "An canza harshe zuwa Hausa.\n\n" + BOT_TEXTS.ha.welcome });
    return { action: "LANG_UPDATED" };
  }

  // B. Choix 1 - FAQ
  if (trimmed === "1" || trimmed.toLowerCase().includes("question") || trimmed.toLowerCase().includes("faq")) {
    const faqs = await prisma.fAQ.findMany({ where: { isPublished: true }, take: 3 });
    let faqText = "❓ *FOIRE AUX QUESTIONS - PLCDA AGADEZ*\n\n";
    faqs.forEach((f, idx) => {
      const q = lang === "ha" && f.questionHa ? f.questionHa : f.questionFr;
      const a = lang === "ha" && f.answerHa ? f.answerHa : f.answerFr;
      faqText += `*${idx + 1}. ${q}*\n${a}\n\n`;
    });
    faqText += "_Tapez 0 pour revenir au menu principal._";
    await sendWhatsAppMessage({ to: cleanPhone, text: faqText });
    return { action: "FAQ_SENT" };
  }

  // C. Choix 3 - Vérifier une information
  if (trimmed === "3") {
    await prisma.citizen.update({
      where: { id: citizen.id },
      data: { notes: "WAITING_VERIFY_CODE" },
    });
    await sendWhatsAppMessage({ to: cleanPhone, text: texts.askCodePrompt });
    return { action: "WAITING_VERIFY_CODE" };
  }

  if (citizen.notes === "WAITING_VERIFY_CODE" || trimmed.toUpperCase().startsWith("PLCDA-")) {
    const queryCode = trimmed.toUpperCase();
    const report = await prisma.report.findFirst({
      where: {
        OR: [
          { trackingCode: queryCode },
          { trackingCode: { contains: queryCode } },
          { title: { contains: trimmed } },
        ],
      },
      include: { verifications: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    await prisma.citizen.update({ where: { id: citizen.id }, data: { notes: null } });

    if (!report) {
      await sendWhatsAppMessage({ to: cleanPhone, text: texts.reportNotFound });
      return { action: "REPORT_NOT_FOUND" };
    }

    const latestVerif = report.verifications[0];
    const msg = texts.reportStatus(
      report.trackingCode,
      report.status,
      report.title,
      latestVerif?.officialResponse
    );
    await sendWhatsAppMessage({ to: cleanPhone, text: msg });
    return { action: "REPORT_STATUS_SENT" };
  }

  // D. Choix 4 - Dernières alertes officielles publiées
  if (trimmed === "4" || trimmed.toLowerCase().includes("alerte")) {
    const alerts = await prisma.publicAlert.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 2,
    });

    if (alerts.length === 0) {
      await sendWhatsAppMessage({
        to: cleanPhone,
        text: "ℹ️ Aucune alerte officielle urgente pour le moment. La situation est calme.",
      });
      return { action: "NO_ALERTS" };
    }

    let alertsText = "📢 *DERNIÈRES ALERTES OFFICIELLES PLCDA*\n\n";
    alerts.forEach((a) => {
      alertsText += `🔴 *${a.title}*\nStatut : *${a.verdict}*\n${a.description}\n\n`;
    });
    alertsText += "_Pour en savoir plus, consultez notre portail citoyen._";
    await sendWhatsAppMessage({ to: cleanPhone, text: alertsText });
    return { action: "ALERTS_SENT" };
  }

  // E. Choix 5 - Conseils
  if (trimmed === "5" || trimmed.toLowerCase().includes("conseil")) {
    await sendWhatsAppMessage({ to: cleanPhone, text: texts.tips });
    return { action: "TIPS_SENT" };
  }

  // F. Choix 2 ou Signalement direct d'une rumeur
  if (
    trimmed === "2" ||
    citizen.notes === "WAITING_REPORT_DETAILS" ||
    (trimmed.length > 20 && !["0", "1", "2", "3", "4", "5", "6"].includes(trimmed)) ||
    mediaUrl
  ) {
    if (trimmed === "2" && !mediaUrl) {
      await prisma.citizen.update({
        where: { id: citizen.id },
        data: { notes: "WAITING_REPORT_DETAILS" },
      });
      await sendWhatsAppMessage({ to: cleanPhone, text: texts.askReportPrompt });
      return { action: "WAITING_REPORT_DETAILS" };
    }

    // Création automatique du signalement en base de données (ÉTAPES 1 & 2)
    const trackingCode = generateTrackingCode();
    const content = trimmed === "2" ? "Signalement citoyen avec média joint" : trimmed;

    // Détection heuristique / IA légère de la catégorie
    let categorySlug = "autres";
    const lower = content.toLowerCase();
    if (lower.includes("attaque") || lower.includes("armée") || lower.includes("gendarme") || lower.includes("sécurité") || lower.includes("route")) {
      categorySlug = "securite";
    } else if (lower.includes("vaccin") || lower.includes("santé") || lower.includes("maladie") || lower.includes("hôpital") || lower.includes("méningite")) {
      categorySlug = "sante";
    } else if (lower.includes("école") || lower.includes("examen") || lower.includes("bepc") || lower.includes("bac")) {
      categorySlug = "education";
    } else if (lower.includes("marché") || lower.includes("céréale") || lower.includes("mil") || lower.includes("prix") || lower.includes("opvn")) {
      categorySlug = "vie-communautaire";
    } else if (lower.includes("pluie") || lower.includes("kouri") || lower.includes("vent") || lower.includes("inondation") || lower.includes("or")) {
      categorySlug = "environnement";
    }

    const category = await prisma.reportCategory.findUnique({ where: { slug: categorySlug } });

    // Création du signalement officiel
    const report = await prisma.report.create({
      data: {
        trackingCode,
        citizenId: citizen.id,
        categoryId: category?.id || null,
        title: content.slice(0, 100) + (content.length > 100 ? "..." : ""),
        description: content,
        rawText: content,
        channel,
        status: "EN ATTENTE",
        verificationStep: 1, // Étape 1 : Réception
        urgency: categorySlug === "securite" ? "CRITIQUE" : "MOYENNE",
        locality: citizen.locality || "Région d'Agadez",
        aiSummary: `Signalement reçu via WhatsApp. Thématique pressentie : ${category?.name || "Générale"}.`,
        aiDetectedCategory: category?.name,
        aiSuggestedLeads: "Vérifier la provenance de l'information avec les autorités locales.",
      },
    });

    // Si un média était joint
    if (mediaUrl) {
      await prisma.reportAttachment.create({
        data: {
          reportId: report.id,
          fileUrl: mediaUrl,
          fileName: `whatsapp_media_${Date.now()}`,
          fileType: mediaType || "image",
        },
      });
    }

    // Réinitialisation de l'état d'attente du citoyen
    await prisma.citizen.update({
      where: { id: citizen.id },
      data: { notes: null },
    });

    // Envoi de l'accusé de réception avec le code de suivi
    await sendWhatsAppMessage({
      to: cleanPhone,
      text: texts.reportSuccess(trackingCode),
    });

    // Notification interne aux vérificateurs
    const verifiers = await prisma.user.findMany({
      where: { role: { in: ["VERIFIER", "ADMIN", "SUPER_ADMIN"] }, isActive: true },
    });

    for (const v of verifiers) {
      await prisma.notification.create({
        data: {
          userId: v.id,
          title: `Nouveau signalement WhatsApp (${trackingCode})`,
          message: `Rumeur reçue : "${report.title}". Prise en charge requise.`,
          type: "ASSIGNMENT",
          link: `/signalements/${report.id}`,
        },
      });
    }

    return { action: "REPORT_CREATED", trackingCode, reportId: report.id };
  }

  // Par défaut : renvoi du menu d'accueil
  await sendWhatsAppMessage({ to: cleanPhone, text: texts.welcome });
  return { action: "MENU_SENT" };
}
