import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "agadez-plcda-super-secret-jwt-key-2026-anti-rumeur-paix-securite"
);

// Chemins totalement publics
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/publications",
  "/verifier",
  "/simulateur-whatsapp", // Permet aux évaluateurs de tester le bot sans être obligatoirement connectés
  "/api/auth/login",
  "/api/auth/logout",
  "/api/whatsapp/webhook",
  "/api/whatsapp/simulate",
  "/api/public/alerts",
  "/api/public/verify",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les fichiers statiques Next.js et assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/whatsapp/webhook") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Vérifier si le chemin est public
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith("/publications/"));

  const sessionCookie = request.cookies.get("plcda_session")?.value;
  let userSession: { role?: string; id?: string } | null = null;

  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, JWT_SECRET);
      userSession = payload as { role?: string; id?: string };
    } catch {
      userSession = null;
    }
  }

  // Si l'utilisateur est sur la page de login et qu'il est déjà connecté, rediriger vers le dashboard
  if (pathname === "/login" && userSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Si la route n'est pas publique et que l'utilisateur n'est pas connecté
  if (!isPublic && !userSession) {
    // Si c'est un appel API, renvoyer 401 Unauthorized
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Contrôle d'accès par rôle (RBAC) pour les zones sensibles
  if (userSession) {
    const role = userSession.role || "OBSERVER";

    // Zones réservées exclusivement aux Administrateurs
    if (
      (pathname.startsWith("/membres") ||
        pathname.startsWith("/parametres") ||
        pathname.startsWith("/activites")) &&
      !["SUPER_ADMIN", "ADMIN"].includes(role)
    ) {
      return NextResponse.redirect(new URL("/dashboard?error=access_denied", request.url));
    }

    // Publication d'alerte réservée aux Super Admin, Admin et Communication
    if (
      pathname.startsWith("/alertes/creer") &&
      !["SUPER_ADMIN", "ADMIN", "COMMUNICATION"].includes(role)
    ) {
      return NextResponse.redirect(new URL("/alertes?error=unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
