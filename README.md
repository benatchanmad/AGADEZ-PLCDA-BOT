# 🌟 AGADEZ PLCDA BOT
### Plateforme Intelligente de Lutte Contre les Rumeurs et la Désinformation
**Région d'Agadez &bull; République du Niger 🇳🇪**

---

## 📖 À propos du projet

La région d'Agadez, carrefour stratégique au cœur du Sahara nigérien, fait face à une circulation accrue de rumeurs et de fausses informations (« infox ») sur les réseaux sociaux et WhatsApp relatives à la sécurité routière, aux campagnes sanitaires, aux marchés céréaliers, à l'orpaillage et à la cohésion sociale.

**AGADEZ PLCDA BOT** est la plateforme numérique officielle conçue pour la **Plateforme Locale de Concertation, de Dialogue et d'Action (PLCDA)** d'Agadez. Elle permet aux citoyens de signaler des rumeurs suspectes via WhatsApp, permet aux vérificateurs habilités de mener des enquêtes contradictoires auprès des autorités locales et des témoins de terrain, et permet aux responsables de communication de diffuser les alertes officielles et les démentis certifiés.

---

## 🛡️ Le Processus de Vérification Institutionnel en 7 Étapes

Conformément à la charte déontologique et aux directives institutionnelles du PLCDA :

1. **ÉTAPE 1 : Réception du signalement**
   Réception automatique des messages, audios, photos ou vidéos transmis par les citoyens sur WhatsApp ou via le portail web.
2. **ÉTAPE 2 : Enregistrement automatique & Code confidentiel**
   Attribution d'une référence unique (ex: `PLCDA-2026-0042`), anonymisation du numéro citoyen et indexation en base de données.
3. **ÉTAPE 3 : Affectation à un membre vérificateur PLCDA**
   La coordination désigne un enquêteur de terrain selon la zone géographique concernée (Agadez Ville, Arlit, Tchirozérine, Bilma, Ingall, Iferouane).
4. **ÉTAPE 4 : Vérification de terrain auprès des sources locales**
   L'enquêteur consulte les chefferies coutumières, les services hospitaliers, les forces de sécurité et les témoins oculaires.
5. **ÉTAPE 5 : Ajout des preuves & Observations contradictoires**
   Consignation des communiqués officiels, photos authentifiées et rapports d'enquête.
6. **ÉTAPE 6 : Soumission & Validation par un responsable habilité**
   Revue critique par le Responsable Communication ou l'Administrateur PLCDA. **Aucune information n'est publiée automatiquement sans validation humaine.**
7. **ÉTAPE 7 : Publication officielle & Diffusion citoyenne**
   Diffusion du résultat certifié sur le portail public citoyen et notification automatique de réponse aux citoyens sur WhatsApp.

---

## 🚀 Technologies & Architecture

- **Frontend :** Next.js 14 (App Router), React 18, TypeScript
- **Styling :** Tailwind CSS, Design System Institutionnel (Vert `#0c7a3d`, Orange `#ea580c`, Blanc, Gris clair)
- **Composants & Icônes :** Inspiré de shadcn/ui, Lucide React
- **Graphiques & Statistiques :** Recharts (Flux quotidien, statut, secteurs, répartition géographique)
- **Backend :** Next.js Route Handlers (API RESTful)
- **Base de données & ORM :** PostgreSQL (Production) / SQLite (Développement local zéro-friction), Prisma ORM
- **Authentification & Sécurité :** Sessions sécurisées JWT via cookies HTTP-only (chiffrement HS256 avec `jose`), hachage bcrypt, contrôle d'accès RBAC
- **Intégration WhatsApp :** Meta WhatsApp Business Cloud API (v20.0) + **Simulateur interactif Web intégré** pour tests et démonstrations immédiates sans compte Meta payant
- **Exports :** Rapports Excel (CSV certifié) et génération PDF imprimable

---

## 👥 Rôles et Droits d'Accès (RBAC)

1. **Super Administrateur (`SUPER_ADMIN`) :** Contrôle total de la plateforme, gestion des comptes, configuration système et audit.
2. **Administrateur PLCDA (`ADMIN`) :** Gestion générale, affectation des signalements, membres et catégories.
3. **Vérificateur (`VERIFIER`) :** Prise en charge des signalements, saisie des sources, observations et preuves d'enquête.
4. **Responsable Communication (`COMMUNICATION`) :** Revue finale (Étape 6), validation et publication des alertes citoyennes (Étape 7).
5. **Observateur (`OBSERVER`) :** Consultation en lecture seule des rapports autorisés (partenaires techniques, ONG, institutions).

### Comptes de démonstration préconfigurés (Mot de passe commun : `Agadez2026!`)

| Rôle | Email | Antenne / Département |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@plcda-agadez.ne` | Coordination Générale PLCDA |
| **Admin PLCDA** | `admin@plcda-agadez.ne` | Direction Opérationnelle Agadez |
| **Vérificateur 1** | `verificateur.ibrahim@plcda-agadez.ne` | Antenne Agadez Ville & Ingall |
| **Vérificateur 2** | `verificatrice.fatima@plcda-agadez.ne` | Antenne Bassin Minier Arlit |
| **Communication** | `comms@plcda-agadez.ne` | Cellule Média & Alertes |
| **Observateur** | `observateur.ong@plcda-agadez.ne` | Observatoire Cohésion Sociale |

---

## 💻 Installation & Démarrage Local

### Prérequis
- Node.js (version 18, 20 ou 22+)
- npm ou yarn

### 1. Cloner le projet et installer les dépendances
```bash
git clone <url-du-depot>
cd "Agadez PLCDA BOT"
npm install
```

### 2. Configuration des variables d'environnement
Copiez le fichier `.env.example` vers `.env` :
```bash
cp .env.example .env
```

### 3. Initialiser la base de données et charger les données de démo
```bash
npm run db:setup
```
*(Cette commande crée les tables avec Prisma et exécute le script `scripts/seed.mjs` contenant des rumeurs et alertes réalistes de la région d'Agadez).*

### 4. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🐳 Déploiement avec Docker & PostgreSQL

Un environnement prêt pour la production est configuré avec Docker Compose :

```bash
docker-compose up --build -d
```

Services démarrés :
- **PostgreSQL 16** sur le port `5432` avec volume persistant `postgres_data`.
- **Application Next.js** sur le port `3000`.

Pour basculer Prisma sur PostgreSQL en production, utilisez le schéma dédié :
```bash
cp prisma/schema.postgresql.prisma prisma/schema.prisma
npx prisma db push
node scripts/seed.mjs
```

---

## 🧪 Exécution des Tests

Les tests automatisés vérifient le hachage sécurisé, les sessions JWT, le contrôle RBAC, le masquage de confidentialité citoyenne et l'intégrité du workflow en 7 étapes :

```bash
npm test
```

---

## 📱 Tester le Bot WhatsApp sans compte Meta (Mode Démo)

Rendez-vous sur la page `/simulateur-whatsapp` dans votre navigateur.
Vous pouvez :
- Discuter en temps réel avec le bot PLCDA dans une interface calquée sur WhatsApp Web.
- Taper `1` pour consulter la FAQ multilingue (Français, Hausa, Tamasheq, Arabe).
- Taper `2` pour déposer un signalement citoyen et recevoir votre référence unique `PLCDA-2026-XXXX`.
- Taper `3` pour vérifier le statut d'une référence.
- Taper `4` pour afficher les dernières alertes officielles.
- Simuler l'envoi d'une photo de preuve.
- Chaque interaction est automatiquement enregistrée en base de données et visible dans le tableau de bord administrateur !

---

## 🔒 Sécurité et Protection de la Vie Privée

- **Anonymat citoyen :** Les numéros de téléphone des citoyens sont masqués (`+227 96 ** ** 33`) et ne sont jamais exposés publiquement.
- **Cartographie confidentielle :** Agrégation par commune (Agadez Ville, Arlit, Tchirozérine, Bilma, Ingall, Iferouane) sans coordonnées GPS privées.
- **Audit inaltérable :** Chaque action (connexion, affectation, vérification, validation) est inscrite dans la table `activity_logs` avec horodatage, utilisateur et IP.

---

## 🏛️ Maîtrise d'Œuvre & Contact
Plateforme Locale de Concertation, de Dialogue et d'Action (PLCDA)  
Région d'Agadez, République du Niger 🇳🇪  
Standard d'assistance : `+227 20 44 00 00` &bull; Email : `contact@plcda-agadez.ne`
