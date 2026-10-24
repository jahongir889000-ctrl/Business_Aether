import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "leads.json");

async function ensureFile() {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]", "utf8");
  }
}

export async function readLeads() {
  await ensureFile();
  const raw = await fs.readFile(filePath, "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function addLead(lead) {
  const leads = await readLeads();
  const entry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
    name: String(lead.name || "").trim(),
    contact: String(lead.contact || "").trim(),
    siteType: String(lead.siteType || "").trim(),
    message: String(lead.message || "").trim(),
    source: lead.source === "ai-quiz" ? "ai-quiz" : "form"
  };
  leads.unshift(entry);
  await fs.writeFile(filePath, JSON.stringify(leads, null, 2), "utf8");
  return entry;
}

export async function updateLeadStatus(id, status) {
  const allowed = new Set(["new", "contacted", "done"]);
  if (!allowed.has(status)) {
    throw new Error("Неизвестный статус");
  }
  const leads = await readLeads();
  const next = leads.map((item) =>
    item.id === id ? { ...item, status } : item
  );
  await fs.writeFile(filePath, JSON.stringify(next, null, 2), "utf8");
  return next.find((item) => item.id === id) || null;
}
