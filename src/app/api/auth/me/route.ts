import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  if (session.id.startsWith("prototype-")) {
    return NextResponse.json({
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
        department: session.department || "PLCDA Agadez",
        avatar: null,
        phone: "",
        isActive: true,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      },
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      avatar: true,
      phone: true,
      isActive: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  return NextResponse.json({ user: user || session });
}
