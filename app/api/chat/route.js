import { NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini";

export async function POST(request) {
  try {
    const body = await request.json();
    const userMessage = String(body.message || "").slice(0, 2000);
    if (!userMessage) {
      return NextResponse.json({ error: "Введите сообщение" }, { status: 400 });
    }
    const history = Array.isArray(body.history) ? body.history.slice(-12) : [];
    const text = await askGemini({
      history,
      userMessage,
      quiz: body.quiz || null
    });
    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Не удалось ответить" },
      { status: 500 }
    );
  }
}
