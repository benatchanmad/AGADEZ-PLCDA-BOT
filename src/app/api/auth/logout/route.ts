import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, getCurrentUser, logActivity } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (currentUser && !currentUser.id.startsWith("prototype-")) {
    await logActivity({
      userId: currentUser.id,
      action: "DECONNEXION",
      details: "Déconnexion manuelle de la session utilisateur",
      req,
    });
  }

  const response = NextResponse.json({ success: true, message: "Déconnecté" });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
