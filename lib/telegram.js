export async function sendTelegramLead(lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { skipped: true };
  }

  const text = [
    "Новая заявка Aether Studio",
    `Источник: ${lead.source}`,
    `Имя: ${lead.name}`,
    `Контакт: ${lead.contact}`,
    `Тип сайта: ${lead.siteType || "не указан"}`,
    "",
    lead.message || "Без комментария"
  ].join("\n");

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text
      })
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Telegram: ${details}`);
  }

  return { ok: true };
}
