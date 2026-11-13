// ==============================================================================
// SEED SCRIPT - AGADEZ PLCDA BOT
// Données de démonstration réalistes pour la région d'Agadez (Niger)
// ==============================================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Initialisation de la base de données AGADEZ PLCDA BOT...");

  // Nettoyage préalable ordonné
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

  console.log("🧹 Tables vidées avec succès.");

  // 1. UTILISATEURS
  const defaultPassword = await bcrypt.hash("Agadez2026!", 10);

  const superAdmin = await prisma.user.create({
    data: {
      name: "Elhadji Amadou Ousmane",
      email: "superadmin@plcda-agadez.ne",
      password: defaultPassword,
      phone: "+227 96 11 22 33",
      role: "SUPER_ADMIN",
      department: "Coordination Générale PLCDA Agadez",
      isActive: true,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Mme Halima Salifou",
      email: "admin@plcda-agadez.ne",
      password: defaultPassword,
      phone: "+227 90 22 33 44",
      role: "ADMIN",
      department: "Direction Opérationnelle PLCDA",
      isActive: true,
    },
  });

  const verifier1 = await prisma.user.create({
    data: {
      name: "Ibrahim Moussa Dan Koulou",
      email: "verificateur.ibrahim@plcda-agadez.ne",
      password: defaultPassword,
      phone: "+227 94 33 44 55",
      role: "VERIFIER",
      department: "Antenne Terrain Agadez Ville & Ingall",
      isActive: true,
    },
  });

  const verifier2 = await prisma.user.create({
    data: {
      name: "Fatima Alassane Ag Rhissa",
      email: "verificatrice.fatima@plcda-agadez.ne",
      password: defaultPassword,
      phone: "+227 97 44 55 66",
      role: "VERIFIER",
      department: "Antenne Bassin Minier Arlit & Tchirozérine",
      isActive: true,
    },
  });

  const comms = await prisma.user.create({
    data: {
      name: "Moussa Khamed Oumarou",
      email: "comms@plcda-agadez.ne",
      password: defaultPassword,
      phone: "+227 89 55 66 77",
      role: "COMMUNICATION",
      department: "Cellule Média & Communication Officielle",
      isActive: true,
    },
  });

  const observer = await prisma.user.create({
    data: {
      name: "Dr. Abdoulaye Garba",
      email: "observateur.ong@plcda-agadez.ne",
      password: defaultPassword,
      phone: "+227 92 66 77 88",
      role: "OBSERVER",
      department: "Observatoire de la Cohésion Sociale & Paix",
      isActive: true,
    },
  });

  console.log("✅ 6 Utilisateurs créés avec les 5 rôles RBAC.");

  // 2. CATÉGORIES
  const categoriesData = [
    {
      name: "Sécurité",
      slug: "securite",
      description: "Rumeurs d'attaques, mouvements armés, axes routiers et patrouilles sécuritaires",
      color: "#dc2626",
      icon: "ShieldAlert",
    },
    {
      name: "Santé",
      slug: "sante",
      description: "Épidémies, campagnes vaccinales, faux remèdes et centres hospitaliers",
      color: "#0284c7",
      icon: "Activity",
    },
    {
      name: "Éducation",
      slug: "education",
      description: "Examens scolaires, bourses, calendrier académique et grèves",
      color: "#7c3aed",
      icon: "GraduationCap",
    },
    {
      name: "Politique et gouvernance",
      slug: "politique-gouvernance",
      description: "Décisions administratives régionales, arrêtés, nominations et déclarations",
      color: "#ea580c",
      icon: "Landmark",
    },
    {
      name: "Environnement",
      slug: "environnement",
      description: "Crues des kouris, orpaillage artisanal, tempêtes de sable et changements climatiques",
      color: "#059669",
      icon: "CloudRain",
    },
    {
      name: "Vie communautaire",
      slug: "vie-communautaire",
      description: "Marchés, prix des denrées céréalières, aides alimentaires et transports",
      color: "#ca8a04",
      icon: "Users",
    },
    {
      name: "Paix et cohésion sociale",
      slug: "paix-cohesion-sociale",
      description: "Rapports intercommunautaires, transhumance, médiations pastorales et rumeurs identitaires",
      color: "#16a34a",
      icon: "HeartHandshake",
    },
    {
      name: "Autres",
      slug: "autres",
      description: "Escroqueries numériques, offres d'emploi fictives et sujets divers",
      color: "#64748b",
      icon: "HelpCircle",
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.reportCategory.create({ data: cat });
    categories[cat.slug] = created;
  }
  console.log("✅ 8 Catégories thématiques créées.");

  // 3. CITOYENS (WhatsApp)
  const citizen1 = await prisma.citizen.create({
    data: {
      phoneNumber: "+22796112244",
      maskedPhone: "+227 96 ** ** 44",
      name: "Aboubacar S. (Commerçant)",
      language: "ha",
      locality: "Agadez Ville - Quartier Sabon Gari",
      reputationScore: 100,
    },
  });

  const citizen2 = await prisma.citizen.create({
    data: {
      phoneNumber: "+22790223355",
      maskedPhone: "+227 90 ** ** 55",
      name: "Zeinabou A. (Enseignante)",
      language: "fr",
      locality: "Arlit - Quartier Akokan",
      reputationScore: 95,
    },
  });

  const citizen3 = await prisma.citizen.create({
    data: {
      phoneNumber: "+22794334466",
      maskedPhone: "+227 94 ** ** 66",
      name: "Mahamadou K. (Transporteur)",
      language: "fr",
      locality: "Tchirozérine",
      reputationScore: 90,
    },
  });

  const citizen4 = await prisma.citizen.create({
    data: {
      phoneNumber: "+22797445577",
      maskedPhone: "+227 97 ** ** 77",
      name: "Rhissa M. (Éleveur)",
      language: "tmq",
      locality: "Ingall",
      reputationScore: 85,
    },
  });

  const citizen5 = await prisma.citizen.create({
    data: {
      phoneNumber: "+22791556688",
      maskedPhone: "+227 91 ** ** 88",
      name: "Fatouma B. (Ménagère)",
      language: "ha",
      locality: "Bilma",
      reputationScore: 90,
    },
  });
  console.log("✅ 5 Citoyens enregistrés.");

  // 4. SIGNALEMENTS, VÉRIFICATIONS & ALERTES

  // Signalement 1 : Rumeur OPVN Marché d'Agadez (FAUSSE - ÉTAPE 7 PUBLIÉE)
  const report1 = await prisma.report.create({
    data: {
      trackingCode: "PLCDA-2026-0001",
      citizenId: citizen1.id,
      categoryId: categories["vie-communautaire"].id,
      title: "Rumeur de rupture totale des stocks de maïs et mil de l'OPVN au marché d'Agadez",
      description: "Un message audio viral sur WhatsApp affirme que les dépôts de l'OPVN sont vides et qu'une flambée incontrôlée des prix va tripler le sac de mil dès demain.",
      rawText: "Salam, on m'a envoyé un audio disant que les magasins OPVN à Agadez n'ont plus aucun sac et que les commerçants vont tout bloquer demain matin.",
      channel: "WHATSAPP",
      status: "FAUSSE",
      verificationStep: 7,
      urgency: "ÉLEVÉE",
      locality: "Agadez Ville - Grand Marché",
      latitude: 16.9738,
      longitude: 7.9908,
      aiSummary: "Rumeur de pénurie alimentaire fictive susceptible de provoquer la panique d'achat au marché central.",
      aiDetectedCategory: "Vie communautaire",
      aiSuggestedLeads: "Contacter le chef d'antenne régionale OPVN Agadez et le Syndicat des commerçants de céréales.",
      isPublished: true,
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    },
  });

  await prisma.assignment.create({
    data: {
      reportId: report1.id,
      userId: verifier1.id,
      assignedBy: admin.name,
      notes: "Priorité haute : éviter la spéculation sur les céréales.",
      status: "COMPLETED",
      completedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    },
  });

  const verif1 = await prisma.verification.create({
    data: {
      reportId: report1.id,
      verifierId: verifier1.id,
      verdict: "FAUSSE",
      summary: "Visite in situ effectuée aux entrepôts OPVN d'Agadez. Les stocks stratégiques de sécurité sont pleins à plus de 80%. La vente à prix modéré se poursuit normalement.",
      internalNotes: "Rencontre avec M. Harouna (Directeur régional OPVN). Aucun risque de pénurie. Les quotas mensuels sont garantis.",
      officialResponse: "L'information faisant état d'une rupture des stocks de céréales de l'OPVN à Agadez est TOTALEMENT FAUSSE. Les magasins disposent de réserves suffisantes et les opérations de vente à prix modéré restent ouvertes au public.",
      step: 7,
      submittedForValidationAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      validatedById: comms.id,
      validatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000 + 3600 * 1000),
      validationNotes: "Vérification claire et corroborée. Publication immédiate d'une alerte citoyenne.",
      isApproved: true,
    },
  });

  await prisma.verificationSource.createMany({
    data: [
      {
        verificationId: verif1.id,
        name: "Direction Régionale OPVN Agadez",
        roleOrContact: "Directeur Régional des Stocks",
        sourceType: "OFFICIAL",
        reliability: "HIGH",
        notes: "Confirmation des bordereaux d'entrée en stock.",
        isConfidential: false,
      },
      {
        verificationId: verif1.id,
        name: "Délégué du Grand Marché d'Agadez",
        roleOrContact: "Représentant des marchands de céréales",
        sourceType: "FIELD_WITNESS",
        reliability: "HIGH",
        notes: "Confirme la régularité des approvisionnements.",
        isConfidential: true,
      },
    ],
  });

  await prisma.publicAlert.create({
    data: {
      reportId: report1.id,
      categoryId: categories["vie-communautaire"].id,
      title: "DÉMENTI : Disponibilité normale des stocks de céréales OPVN à Agadez",
      slug: "dementi-stocks-cereales-opvn-agadez-2026",
      description: "Une rumeur persistante sur WhatsApp prétendant que les dépôts de l'Office des Produits Vivriers du Niger sont à sec est infondée.",
      factCheckContent: "La coordination PLCDA Agadez a vérifié l'état des entrepôts OPVN ce matin en présence des autorités locales. Les stocks de mil, maïs et sorgho sont abondants et les ventes aux tarifs subventionnés se poursuivent sans interruption. Ne cédez pas à la panique ni aux spéculateurs.",
      priority: "ÉLEVÉE",
      verdict: "FAUSSE",
      sourcesUsed: "Direction Régionale OPVN Agadez, Mairie d'Agadez, Délégué des Commerçants",
      authorId: verifier1.id,
      validatorId: comms.id,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      broadcastWhatsApp: true,
      broadcastCount: 1420,
      viewsCount: 3840,
    },
  });

  // Signalement 2 : Sécurité - Fausse attaque axe Agadez-Tahoua (FAUSSE - ÉTAPE 7)
  const report2 = await prisma.report.create({
    data: {
      trackingCode: "PLCDA-2026-0002",
      citizenId: citizen3.id,
      categoryId: categories["securite"].id,
      title: "Fausse alerte d'attaque et de coupure de route sur l'axe Agadez-Tahoua",
      description: "Publication sur les réseaux sociaux affirmant que la RN25 est bloquée suite à une attaque armée près d'Anou Araren et que tous les bus sont immobilisés.",
      rawText: "Urgent ! On me signale que la route de Tahoua est bloquée vers Anou Araren par des bandits armés. Est-ce vrai ?",
      channel: "WHATSAPP",
      status: "FAUSSE",
      verificationStep: 7,
      urgency: "CRITIQUE",
      locality: "Axe RN25 - Anou Araren / Tchirozérine",
      latitude: 17.2514,
      longitude: 7.7428,
      aiSummary: "Rumeur anxiogène relative à la sécurité routière sur l'axe vital RN25.",
      aiDetectedCategory: "Sécurité",
      aiSuggestedLeads: "Contacter le Commandement de la Compagnie de Gendarmerie d'Agadez et les syndicats de chauffeurs d'autobus.",
      isPublished: true,
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000),
    },
  });

  const verif2 = await prisma.verification.create({
    data: {
      reportId: report2.id,
      verifierId: verifier2.id,
      verdict: "FAUSSE",
      summary: "Rapprochement effectué avec le Centre des Opérations Conjointes de Sécurité et le syndicat des transporteurs. Aucun incident n'a été signalé. La circulation est fluide avec escorte et patrouilles régulières.",
      internalNotes: "Vérification directe auprès du Capitaine de la Légion de Gendarmerie. Rumeur fabriquée à partir d'une photo d'accident mécanique datant de 2023.",
      officialResponse: "La circulation sur l'axe Agadez - Tahoua est totalement normale et sécurisée. Aucune attaque n'a eu lieu à Anou Araren. Les usagers peuvent emprunter l'axe sans inquiétude.",
      step: 7,
      submittedForValidationAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      validatedById: comms.id,
      validatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000 + 1800 * 1000),
      validationNotes: "Alerte de haute priorité. Réfutation publiée sur tous les canaux.",
      isApproved: true,
    },
  });

  await prisma.verificationSource.createMany({
    data: [
      {
        verificationId: verif2.id,
        name: "Légion de Gendarmerie d'Agadez",
        roleOrContact: "Officier de permanence",
        sourceType: "OFFICIAL",
        reliability: "HIGH",
        isConfidential: false,
      },
      {
        verificationId: verif2.id,
        name: "Gare routière d'Agadez (Compagnies de transport)",
        roleOrContact: "Chef de convoi",
        sourceType: "FIELD_WITNESS",
        reliability: "HIGH",
        isConfidential: true,
      },
    ],
  });

  await prisma.publicAlert.create({
    data: {
      reportId: report2.id,
      categoryId: categories["securite"].id,
      title: "SÉCURITÉ : Circulation fluide et normale sur l'axe Agadez - Tahoua (RN25)",
      slug: "securite-axe-agadez-tahoua-rn25-fausse-attaque",
      description: "Les informations alarmistes circulant sur WhatsApp faisant état d'un blocage de la RN25 à hauteur d'Anou Araren sont complètement dénuées de fondement.",
      factCheckContent: "Après vérification rigoureuse auprès des Forces de Défense et de Sécurité (FDS) et des compagnies de transport de passagers, le PLCDA confirme qu'aucun incident n'est survenu. Les patrouilles veillent sur l'ensemble du corridor.",
      priority: "CRITIQUE",
      verdict: "FAUSSE",
      sourcesUsed: "FDS Région d'Agadez, Syndicat des Transporteurs Routiers",
      authorId: verifier2.id,
      validatorId: comms.id,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      broadcastWhatsApp: true,
      broadcastCount: 2850,
      viewsCount: 6120,
    },
  });

  // Signalement 3 : Campagne Méningite à Tchirozérine (CONFIRMÉE - ÉTAPE 6)
  const report3 = await prisma.report.create({
    data: {
      trackingCode: "PLCDA-2026-0003",
      citizenId: citizen2.id,
      categoryId: categories["sante"].id,
      title: "Campagne de vaccination préventive contre la méningite dans le département de Tchirozérine",
      description: "Des messages circulent indiquant que le district sanitaire lance une campagne gratuite de vaccination pour les enfants de 1 à 15 ans du 10 au 15 du mois.",
      channel: "WHATSAPP",
      status: "CONFIRMÉE",
      verificationStep: 6,
      urgency: "MOYENNE",
      locality: "Tchirozérine Ville",
      latitude: 17.2581,
      longitude: 7.7617,
      aiSummary: "Vérification d'une annonce officielle de santé publique.",
      aiDetectedCategory: "Santé",
      aiSuggestedLeads: "Contacter le Médecin Chef de District Sanitaire de Tchirozérine.",
      isPublished: true,
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    },
  });

  const verif3 = await prisma.verification.create({
    data: {
      reportId: report3.id,
      verifierId: verifier2.id,
      verdict: "CONFIRMÉE",
      summary: "Contact pris avec le Médecin Chef de District de Tchirozérine. La campagne est bel et bien organisée et homologuée par le Ministère de la Santé Publique.",
      officialResponse: "L'information est VRAIE ET CONFIRMÉE. Le District Sanitaire de Tchirozérine organise bien une campagne de vaccination gratuite contre la méningite A+C pour les enfants de 1 à 15 ans.",
      step: 6,
      submittedForValidationAt: new Date(Date.now() - 24 * 3600 * 1000),
      isApproved: true,
      validatedById: comms.id,
      validatedAt: new Date(Date.now() - 20 * 3600 * 1000),
    },
  });

  await prisma.verificationSource.create({
    data: {
      verificationId: verif3.id,
      name: "District Sanitaire de Tchirozérine",
      roleOrContact: "Médecin Chef de District",
      sourceType: "OFFICIAL",
      reliability: "HIGH",
    },
  });

  await prisma.publicAlert.create({
    data: {
      reportId: report3.id,
      categoryId: categories["sante"].id,
      title: "SANTÉ PUBLIQUE : Confirmation de la campagne de vaccination contre la méningite à Tchirozérine",
      slug: "confirmation-vaccination-meningite-tchirozerine-2026",
      description: "Le PLCDA confirme l'authenticité de la campagne vaccinale gratuite annoncée pour les enfants.",
      factCheckContent: "Les équipes mobiles du district sanitaire sillonneront les écoles et les cases de santé. Les vaccins sont homologués et gratuits.",
      priority: "MOYENNE",
      verdict: "CONFIRMÉE",
      sourcesUsed: "Direction Régionale de la Santé Publique d'Agadez, District Sanitaire de Tchirozérine",
      authorId: verifier2.id,
      validatorId: comms.id,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 18 * 3600 * 1000),
      broadcastWhatsApp: true,
      broadcastCount: 950,
      viewsCount: 2200,
    },
  });

  // Signalement 4 : Route d'Arlit ensablée (PARTIELLEMENT VRAIE - ÉTAPE 5)
  const report4 = await prisma.report.create({
    data: {
      trackingCode: "PLCDA-2026-0004",
      citizenId: citizen2.id,
      categoryId: categories["environnement"].id,
      title: "Coupure de la route goudronnée entre Agadez et Arlit suite à une tempête d'ensablement",
      description: "Des internautes rapportent que les dunes de sable ont totalement enseveli la voie au niveau d'Assamaka et qu'aucun camion ne peut passer.",
      channel: "WHATSAPP",
      status: "PARTIELLEMENT VRAIE",
      verificationStep: 5,
      urgency: "MOYENNE",
      locality: "Arlit - Axe Agadez-Arlit",
      latitude: 18.7369,
      longitude: 7.3853,
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
    },
  });

  const verif4 = await prisma.verification.create({
    data: {
      reportId: report4.id,
      verifierId: verifier2.id,
      verdict: "PARTIELLEMENT VRAIE",
      summary: "Une forte tempête de vent a bien déposé des cordons dunaires sur la chaussée sur environ 3 km. Cependant la route n'est pas fermée : des engins de la Direction Régionale de l'Équipement sont à l'œuvre et une déviation balisée permet le transit.",
      officialResponse: "Information PARTIELLEMENT VRAIE : Un ensablement partiel existe au PK 140, mais la circulation n'est pas bloquée. Les travaux de dégagement sont en cours.",
      step: 5,
    },
  });

  await prisma.verificationSource.create({
    data: {
      verificationId: verif4.id,
      name: "Direction Régionale de l'Équipement d'Agadez",
      roleOrContact: "Ingénieur subdivisionnaire d'Arlit",
      sourceType: "OFFICIAL",
      reliability: "HIGH",
    },
  });

  // Signalement 5 : Ruée vers l'or Djado fictive (EN COURS DE VÉRIFICATION - ÉTAPE 4)
  const report5 = await prisma.report.create({
    data: {
      trackingCode: "PLCDA-2026-0005",
      citizenId: citizen5.id,
      categoryId: categories["politique-gouvernance"].id,
      title: "Rumeur d'ouverture libre et sans permis des sites aurifères du Djado",
      description: "Un message prétend que l'État a autorisé l'accès sans conditions à tous les orpailleurs artisanaux sur les anciens sites fermés du Djado.",
      channel: "WHATSAPP",
      status: "EN COURS DE VÉRIFICATION",
      verificationStep: 4,
      urgency: "ÉLEVÉE",
      locality: "Bilma / Djado",
      latitude: 18.6853,
      longitude: 12.9164,
      aiSummary: "Risque de mouvement massif de populations vers le désert sur la base d'une annonce administrative non vérifiée.",
      createdAt: new Date(Date.now() - 12 * 3600 * 1000),
    },
  });

  await prisma.assignment.create({
    data: {
      reportId: report5.id,
      userId: verifier1.id,
      assignedBy: admin.name,
      notes: "Contacter d'urgence la Préfecture de Bilma et le Ministère des Mines.",
      status: "ACTIVE",
    },
  });

  // Signalement 6 : Fausse ONG demandant 5000 FCFA pour kits solaires (FAUSSE - ÉTAPE 7)
  const report6 = await prisma.report.create({
    data: {
      trackingCode: "PLCDA-2026-0006",
      citizenId: citizen1.id,
      categoryId: categories["autres"].id,
      title: "Escroquerie : Fausse distribution de kits solaires contre frais d'adhésion de 5 000 FCFA",
      description: "Des individus se réclamant d'un projet humanitaire international distribuent des formulaires à Sabon Gari en exigeant 5 000 FCFA par ménage par virement mobile.",
      channel: "WHATSAPP",
      status: "FAUSSE",
      verificationStep: 7,
      urgency: "ÉLEVÉE",
      locality: "Agadez Ville - Sabon Gari & Dagmanet",
      latitude: 16.9744,
      longitude: 7.9892,
      isPublished: true,
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
    },
  });

  await prisma.publicAlert.create({
    data: {
      reportId: report6.id,
      categoryId: categories["autres"].id,
      title: "ALERTE ARNAQUE : Fausse distribution de kits solaires payants à Agadez",
      slug: "alerte-arnaque-faux-kits-solaires-agadez",
      description: "Méfiance absolue face aux collecteurs de fonds illégaux prétendant fournir des panneaux solaires subventionnés.",
      factCheckContent: "Aucun projet officiel ni ONG reconnue n'exige de transfert d'argent pour des kits solaires. Les autorités municipales invitent la population à signaler immédiatement ces faux démarcheurs aux services de police.",
      priority: "ÉLEVÉE",
      verdict: "FAUSSE",
      sourcesUsed: "Mairie d'Agadez, Direction Régionale de l'Action Sociale",
      authorId: verifier1.id,
      validatorId: comms.id,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000),
      broadcastWhatsApp: true,
      broadcastCount: 1800,
      viewsCount: 4500,
    },
  });

  // Signalement 7 : Alerte météo tempête de sable Aïr (EN COURS DE VÉRIFICATION - ÉTAPE 3)
  const report7 = await prisma.report.create({
    data: {
      trackingCode: "PLCDA-2026-0007",
      citizenId: citizen4.id,
      categoryId: categories["environnement"].id,
      title: "Avis de tempête de poussière extrême et gel nocturne dans le massif de l'Aïr",
      description: "Alerte relayée par des bergers concernant une violente vague de froid et des vents de plus de 90 km/h attendus sur Timia et Iferouane.",
      channel: "WHATSAPP",
      status: "EN COURS DE VÉRIFICATION",
      verificationStep: 3,
      urgency: "MOYENNE",
      locality: "Iferouane / Timia",
      latitude: 19.0583,
      longitude: 8.4167,
      createdAt: new Date(Date.now() - 6 * 3600 * 1000),
    },
  });

  await prisma.assignment.create({
    data: {
      reportId: report7.id,
      userId: verifier2.id,
      assignedBy: admin.name,
      notes: "Vérifier avec la Direction Régionale de la Météorologie d'Agadez.",
      status: "ACTIVE",
    },
  });

  // Signalement 8 : Audio suspension des examens scolaires (EN ATTENTE - ÉTAPE 1)
  const report8 = await prisma.report.create({
    data: {
      trackingCode: "PLCDA-2026-0008",
      citizenId: citizen3.id,
      categoryId: categories["education"].id,
      title: "Audio WhatsApp proclamant l'annulation des épreuves du BEPC à Agadez",
      description: "Un audio non signé de 45 secondes affirme que toutes les épreuves du BEPC sont annulées suite à des fuites supposées sur les réseaux.",
      rawText: "Bonjour PLCDA, écoutez cet audio qui circule partout dans les groupes des élèves d'Agadez. Est-ce vrai que le BEPC est annulé ?",
      channel: "WHATSAPP",
      status: "EN ATTENTE",
      verificationStep: 1,
      urgency: "ÉLEVÉE",
      locality: "Agadez Ville",
      latitude: 16.973,
      longitude: 7.99,
      aiSummary: "Rumeur susceptible de déstabiliser les candidats aux examens scolaires nationaux.",
      aiDetectedCategory: "Éducation",
      aiSuggestedLeads: "Saisir la Direction Régionale de l'Éducation Nationale (DREN) d'Agadez.",
      createdAt: new Date(Date.now() - 45 * 60 * 1000), // il y a 45 min
    },
  });

  // ATTACHMENTS (Pièces jointes des citoyens via WhatsApp)
  await prisma.reportAttachment.createMany({
    data: [
      {
        reportId: report8.id,
        fileName: "audio_vocal_whatsapp_annulation_bepc.mp3",
        fileUrl: "https://actions.google.com/sounds/v1/speech/person_speaking_french.ogg",
        fileType: "audio",
        fileSize: 485000,
        mimeType: "audio/ogg",
      },
      {
        reportId: report1.id,
        fileName: "message_vocal_penurie_cereales_agadez.mp3",
        fileUrl: "https://actions.google.com/sounds/v1/speech/person_speaking_french.ogg",
        fileType: "audio",
        fileSize: 620000,
        mimeType: "audio/ogg",
      },
      {
        reportId: report2.id,
        fileName: "capture_whatsapp_anou_araren_route.jpg",
        fileUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
        fileType: "image",
        fileSize: 1250000,
        mimeType: "image/jpeg",
      },
      {
        reportId: report4.id,
        fileName: "photo_ensablement_dunes_axe_arlit.jpg",
        fileUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800",
        fileType: "image",
        fileSize: 980000,
        mimeType: "image/jpeg",
      },
      {
        reportId: report6.id,
        fileName: "faux_formulaire_kits_solaires_payants.jpg",
        fileUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800",
        fileType: "image",
        fileSize: 840000,
        mimeType: "image/jpeg",
      },
      {
        reportId: report7.id,
        fileName: "audio_alerte_meteo_bergers_timia.mp3",
        fileUrl: "https://actions.google.com/sounds/v1/speech/person_speaking_french.ogg",
        fileType: "audio",
        fileSize: 310000,
        mimeType: "audio/ogg",
      },
    ],
  });

  console.log("✅ Pièces jointes (Audios et Photos WhatsApp) associées aux signalements.");
  console.log("✅ 8 Signalements complets créés couvrant les étapes 1 à 7 et tous les statuts.");

  // 5. NOTIFICATIONS
  await prisma.notification.createMany({
    data: [
      {
        userId: verifier1.id,
        title: "Nouveau signalement en attente",
        message: "Le signalement PLCDA-2026-0008 (BEPC à Agadez) a été reçu et nécessite une prise en charge.",
        type: "ASSIGNMENT",
        link: `/signalements/${report8.id}`,
      },
      {
        userId: comms.id,
        title: "Alerte publiée avec succès",
        message: "L'alerte concernant la RN25 (Anou Araren) a été diffusée à 2 850 citoyens via WhatsApp.",
        type: "SUCCESS",
        link: `/alertes`,
      },
      {
        userId: admin.id,
        title: "Vérification soumise pour approbation",
        message: "Le vérificateur Ibrahim Moussa a complété la vérification du signalement PLCDA-2026-0005.",
        type: "VALIDATION",
        link: `/verifications`,
      },
    ],
  });

  // 6. ACTIVITÉ D'AUDIT (JOURNAL INALTÉRABLE)
  await prisma.activityLog.createMany({
    data: [
      {
        userId: superAdmin.id,
        action: "INITIALISATION_SYSTEME",
        details: "Démarrage officiel de la plateforme AGADEZ PLCDA BOT.",
        ipAddress: "197.214.120.14",
      },
      {
        userId: verifier1.id,
        reportId: report1.id,
        action: "VERIFICATION_COMPLETED",
        details: "Vérification sur le terrain effectuée auprès des entrepôts OPVN.",
        ipAddress: "197.214.120.25",
      },
      {
        userId: comms.id,
        reportId: report1.id,
        action: "PUBLIC_ALERT_PUBLISHED",
        details: "Diffusion de l'alerte démenti céréales OPVN sur WhatsApp et portail citoyen.",
        ipAddress: "197.214.120.88",
      },
      {
        userId: verifier2.id,
        reportId: report2.id,
        action: "VERIFICATION_COMPLETED",
        details: "Confirmation FDS obtenue concernant la fluidité de la RN25.",
        ipAddress: "197.214.120.62",
      },
    ],
  });

  // 7. FOIRE AUX QUESTIONS (FAQ) MULTILINGUE
  await prisma.fAQ.createMany({
    data: [
      {
        questionFr: "Qu'est-ce que le PLCDA et quel est son rôle à Agadez ?",
        answerFr: "La Plateforme Locale de Concertation, de Dialogue et d'Action (PLCDA) d'Agadez est un cadre institutionnel regroupant autorités régionales, leaders coutumiers, chefs religieux, forces vives et société civile pour promouvoir la paix, la cohésion sociale et la vérité informationnelle dans la région.",
        questionHa: "Menene PLCDA kuma menene aikinsa a Agadez?",
        answerHa: "PLCDA wani tsari ne na hadin gwiwa da ke tara hukumomi, sarakunan gargajiya, malaman addini da kungiyoyin jama'a domin tabbatar da zaman lafiya da yaki da labaran karya a yankin Agadez.",
        questionTmq: "Mani iga PLCDA d-esel-net daɣ Agadez?",
        answerTmq: "PLCDA enta tadawalt n əddewlət d-imɣaran d-iytan d-amadal fəl əzzəgzan d-əssəlam d-əssəlmad n tidət daɣ Agadez.",
        questionAr: "ما هي منصة PLCDA وما هو دورها في منطقة أغاديز؟",
        answerAr: "منصة الحوار والتشاور والعمل المحلي (PLCDA) هي إطار مؤسسي يجمع السلطات والقادة التقليديين والمجتمع المدني لتعزيز السلام ومكافحة الشائعات في أغاديز.",
        category: "GENERAL",
        sortOrder: 1,
      },
      {
        questionFr: "Comment signaler une rumeur suspecte via WhatsApp ?",
        answerFr: "Envoyez simplement votre message, audio, capture d'écran ou vidéo au numéro officiel WhatsApp du PLCDA. Le bot automatique enregistrera votre signalement et vous fournira un numéro de suivi confidentiel (ex: PLCDA-2026-XXXX).",
        questionHa: "Yaya zan iya aika rahoton labarin karya ta WhatsApp?",
        answerHa: "Kawai tura sakon ka, muryarka ko hotonka zuwa lambar WhatsApp na PLCDA. Na'urar za ta ba ka lambar bin diddigi ta sirri.",
        questionTmq: "Mamek as ad tettez edeles n kərkər daɣ WhatsApp?",
        answerTmq: "Azen ghas elxabar-nek maɣ kalala-nek daɣ WhatsApp n PLCDA. Ad tawi nomro n aselken s əssir.",
        questionAr: "كيف يمكن الإبلاغ عن شائعة مشبوهة عبر واتساب؟",
        answerAr: "ما عليك سوى إرسال الرسالة أو التسجيل الصوتي أو الصورة إلى رقم واتساب الرسمي الخاص بالمنصة، وسيقوم الروبوت بتسجيل البلاغ وتزويدك برمز تتبع خاص.",
        category: "UTILISATION",
        sortOrder: 2,
      },
      {
        questionFr: "Mon numéro et mon identité sont-ils protégés ?",
        answerFr: "OUI, ABSOLUMENT. La sécurité et l'anonymat des citoyens sont garantis par le système. Votre numéro est systématiquement masqué et n'est jamais divulgué au public ni aux tiers non autorisés.",
        questionHa: "Shin an kare lambata da sunana?",
        answerHa: "Kwarai kuwa. Ba za a taba bayyana lambar wayarka ko sunanka ga kowa ba. Komai yana karkashin sirri.",
        questionTmq: "Emeɣzar-in d-ism-in wər ten-ittasen meddan?",
        answerTmq: "Kala, əssir ikmel. Nomro-nek wər ittwassen fəl meddan n arat.",
        questionAr: "هل رقم هاتفي وهويتي محميان وسريان؟",
        answerAr: "نعم بالتأكيد. يتم إخفاء أرقام الهواتف تلقائياً ولا يتم الكشف عن هوية المواطن لأي جهة غير مخولة.",
        category: "SECURITE",
        sortOrder: 3,
      },
      {
        questionFr: "Comment reconnaître une fausse information (infox) ?",
        answerFr: "1. Vérifiez la source officielle. 2. Méfiez-vous des messages alarmistes appelant au partage urgent. 3. Examinez les dates et les photos. 4. En cas de doute, transférez le message au PLCDA BOT avant de le relayer.",
        questionHa: "Yaya ake gane labarin karya?",
        answerHa: "1. Duba tushen labarin. 2. Yi hankali da sakonni masu tayar da hankali. 3. Tabbatar da kwanan wata. 4. Tambayi PLCDA BOT kafin ka tura wa wasu.",
        questionTmq: "Mamek as ad təssəna tidət daɣ kərkər?",
        answerTmq: "1. Səkkəl may d-ikkan elxabar. 2. Ghadəl daɣ aratan n təssəssast. 3. Asikən PLCDA wər tuzina arat.",
        questionAr: "كيف يمكن تمييز المعلومات المضللة والأخبار الكاذبة؟",
        answerAr: "1. التحقق من المصادر الرسمية. 2. الحذر من الرسائل التهويلية التي تطالب بإعادة النشر الفوري. 3. التحقق من التواريخ والصور. 4. إرسال الشك إلى PLCDA للتأكد.",
        category: "CONSEILS",
        sortOrder: 4,
      },
    ],
  });

  // 8. TEMPLATES WHATSAPP
  await prisma.whatsAppTemplate.createMany({
    data: [
      {
        name: "menu_accueil_principal",
        category: "UTILITY",
        language: "fr",
        header: "🌟 AGADEZ PLCDA BOT",
        body: "Bienvenue sur le service citoyen de vérification des informations de la région d'Agadez.\n\nEnsemble, luttons contre les rumeurs et préservons la paix sociale.\n\nQue souhaitez-vous faire ?\n1️⃣ Poser une question\n2️⃣ Signaler une rumeur\n3️⃣ Vérifier une information (avec référence)\n4️⃣ Consulter les alertes officielles\n5️⃣ Conseils contre la désinformation\n\nRépondez simplement avec le chiffre correspondant.",
        footer: "Service officiel sécurisé & anonyme",
        metaStatus: "APPROVED",
      },
      {
        name: "accuse_reception_signalement",
        category: "UTILITY",
        language: "fr",
        header: "✅ Signalement bien reçu",
        body: "Votre signalement a été enregistré avec succès par l'équipe de veille du PLCDA Agadez.\n\n📌 Votre référence de suivi confidentielle : {{trackingCode}}\n\nNos vérificateurs mènent actuellement des investigations auprès des autorités et sources locales compétentes. Vous recevrez une notification dès validation du résultat.",
        footer: "PLCDA - Pour la vérité et la cohésion",
        metaStatus: "APPROVED",
      },
    ],
  });

  // 9. PARAMÈTRES SYSTÈME
  await prisma.settings.createMany({
    data: [
      {
        key: "system_status",
        value: "OPERATIONAL",
        description: "État opérationnel général de la plateforme",
      },
      {
        key: "meta_api_mode",
        value: "DEMO_ENABLED",
        description: "Mode Meta Cloud API (PRODUCTION / DEMO_ENABLED)",
      },
      {
        key: "verification_sla_hours",
        value: "24",
        description: "Délai moyen d'engagement pour la vérification terrain (en heures)",
      },
      {
        key: "emergency_hotline",
        value: "+227 20 44 00 00",
        description: "Numéro vert ou standard d'urgence PLCDA Agadez",
      },
      {
        key: "default_language",
        value: "fr",
        description: "Langue par défaut du système",
      },
    ],
  });

  console.log("🎉 Données initiales créées avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
