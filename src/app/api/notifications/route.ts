import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  const notifications = await prisma.notification.findMany({
    where: user ? { userId: user.id } : undefined,
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const unreadCount = await prisma.notification.count({
    where: {
      ...(user ? { userId: user.id } : {}),
      isRead: false,
    },
  });

  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}
