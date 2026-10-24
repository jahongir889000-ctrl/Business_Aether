import { cookies } from "next/headers";
import { createHmac } from "crypto";

const COOKIE = "aether_admin";

function secret() {
  return process.env.ADMIN_PASSWORD || "change-me";
}

export function signSession() {
  return createHmac("sha256", secret()).update("admin").digest("hex");
}

export async function isAdmin() {
  const store = await cookies();
  return store.get(COOKIE)?.value === signSession();
}

export async function setAdminCookie() {
  const store = await cookies();
  store.set(COOKIE, signSession(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}
