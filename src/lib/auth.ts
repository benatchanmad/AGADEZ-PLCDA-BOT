import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import prisma from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "agadez-plcda-super-secret-jwt-key-2026-anti-rumeur-paix-securite"
);

export const SESSION_COOKIE_NAME = "plcda_session";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string | null;
}

/**
 * Crée un JWT sécurisé pour l'utilisateur
 */
export async function createSessionToken(user: UserSession): Promise<string> {
  return await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

/**
 * Valide et décode le JWT
 */
export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as string,
      department: (payload.department as string) || null,
    };
  } catch {
    return null;
  }
}

/**
 * Récupère l'utilisateur actuellement connecté depuis les cookies de requête
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Vérifie le mot de passe
 */
export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

/**
 * Hache un mot de passe
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

/**
 * Vérification des permissions par rôle (RBAC)
 */
export function hasRole(userRole: string, allowedRoles: string[]): boolean {
  if (userRole === "SUPER_ADMIN") return true;
  return allowedRoles.includes(userRole);
}

/**
 * Enregistrement dans le journal d'audit sécurisé
 */
export async function logActivity({
  userId,
  reportId,
  action,
  details,
  req,
}: {
  userId?: string | null;
  reportId?: string | null;
  action: string;
  details?: string;
  req?: NextRequest | Request;
}) {
  try {
    let ipAddress = "127.0.0.1";
    let userAgent = "Next.js Server";

    if (req && "headers" in req) {
      ipAddress =
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        req.headers.get("x-real-ip") ||
        "127.0.0.1";
      userAgent = req.headers.get("user-agent") || "Browser";
    }

    await prisma.activityLog.create({
      data: {
        userId: userId || null,
        reportId: reportId || null,
        action,
        details: details || null,
        ipAddress,
        userAgent,
      },
    });
  } catch (err) {
    console.error("Échec de journalisation d'audit:", err);
  }
}
