import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, hasRole } from "@/lib/auth";

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ faqs });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasRole(user.role, ["SUPER_ADMIN", "ADMIN", "COMMUNICATION"])) {
      return NextResponse.json({ error: "Action non autorisée" }, { status: 403 });
    }

    const { questionFr, answerFr, questionHa, answerHa, questionTmq, answerTmq, questionAr, answerAr, category } =
      await req.json();

    if (!questionFr || !answerFr) {
      return NextResponse.json({ error: "La question et la réponse en français sont requises." }, { status: 400 });
    }

    const faq = await prisma.fAQ.create({
      data: {
        questionFr,
        answerFr,
        questionHa: questionHa || null,
        answerHa: answerHa || null,
        questionTmq: questionTmq || null,
        answerTmq: answerTmq || null,
        questionAr: questionAr || null,
        answerAr: answerAr || null,
        category: category || "GENERAL",
      },
    });

    return NextResponse.json({ success: true, faq });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
