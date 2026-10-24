import { createClient } from "@libsql/client";

let client;

export function getTurso() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) {
    throw new Error("Задайте TURSO_DATABASE_URL в .env.local");
  }
  if (!client) {
    client = createClient({
      url,
      authToken
    });
  }
  return client;
}
