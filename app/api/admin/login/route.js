import { NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json();
  const password = String(body.password || "");
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Задайте ADMIN_PASSWORD в .env.local" },
      { status: 500 }
    );
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
