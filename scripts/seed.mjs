// ==============================================================================
// PROTOTYPE MODE - AGADEZ PLCDA BOT
// Initialise une base de données vierge (sans données de démonstration)
// ==============================================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Réinitialisation du prototype AGADEZ PLCDA BOT (sans données)...");

  await prisma.activityLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.verificationEvidence.deleteMany({});
  await prisma.verificationSource.deleteMany({});
  await prisma.verification.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.reportAttachment.deleteMany({});
  await prisma.publicAlert.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.reportCategory.deleteMany({});
  await prisma.whatsAppMessage.deleteMany({});
  await prisma.whatsAppTemplate.deleteMany({});
  await prisma.fAQ.deleteMany({});
  await prisma.citizen.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.settings.deleteMany({});

  console.log("✅ Prototype réinitialisé avec succès (0 donnée dans toutes les tables).");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors de la réinitialisation:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
