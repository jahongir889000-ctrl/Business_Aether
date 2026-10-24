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
- `TURSO_DATABASE_URL` — URL базы Turso (`libsql://...`).
- `TURSO_AUTH_TOKEN` — токен доступа к базе.

Заявки хранятся в таблице `leads` на Turso. Если Telegram не настроен, заявка всё равно остаётся в базе.

## Turso

1. Установите CLI: `npm i -g @turso/cli` и выполните `turso auth login`.
2. Создайте базу: `turso db create aether-leads`.
3. Возьмите URL: `turso db show aether-leads --url`.
4. Создайте токен: `turso db tokens create aether-leads`.
5. Впишите значения в `.env.local` и перезапустите `npm run dev`.
