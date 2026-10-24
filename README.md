# Aether Studio

Лендинг веб-студии с ИИ-брифом, админкой заявок и дублированием в Telegram.

## Запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000). Админка: [http://localhost:3000/admin](http://localhost:3000/admin).

## Переменные окружения

- `GEMINI_API_KEY` — ключ Google AI Studio. Модель `gemini-3.5-flash-lite`, при недоступности — запасные.
- `TELEGRAM_BOT_TOKEN` — токен бота от [@BotFather](https://t.me/BotFather).
- `TELEGRAM_CHAT_ID` — ваш личный чат или рабочая группа. Напишите боту `/start`, затем узнайте id (например, через `@userinfobot` или API `getUpdates`).
- `ADMIN_PASSWORD` — пароль входа в `/admin`.

Заявки сохраняются в `data/leads.json`. Если Telegram не настроен или бот недоступен, заявка всё равно остаётся на сайте.
