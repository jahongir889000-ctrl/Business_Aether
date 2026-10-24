import { NextResponse } from "next/server";
import { addLead, readLeads, updateLeadStatus } from "@/lib/leads";
import { sendTelegramLead } from "@/lib/telegram";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }
  const leads = await readLeads();
  return NextResponse.json({ leads });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const contact = String(body.contact || "").trim();
    if (!name || !contact) {
      return NextResponse.json(
        { error: "Укажите имя и контакт" },
        { status: 400 }
      );
    }

    const lead = await addLead({
      name,
      contact,
      siteType: body.siteType,
      message: body.message,
      source: body.source
    });

    let telegram = { ok: false };
    try {
      telegram = await sendTelegramLead(lead);
    } catch (error) {
      telegram = { ok: false, error: error.message };
    }

    return NextResponse.json({ lead, telegram });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Не удалось сохранить заявку" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }
  const body = await request.json();
  const updated = await updateLeadStatus(body.id, body.status);
  if (!updated) {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }
  return NextResponse.json({ lead: updated });
}
