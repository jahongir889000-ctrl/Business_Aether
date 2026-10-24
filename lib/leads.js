import { getTurso } from "./turso";

function mapLead(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    name: row.name,
    contact: row.contact,
    siteType: row.site_type || "",
    message: row.message || "",
    source: row.source
  };
}

async function ensureTable() {
  const db = getTurso();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      site_type TEXT,
      message TEXT,
      source TEXT NOT NULL
    )
  `);
  return db;
}

export async function readLeads() {
  const db = await ensureTable();
  const result = await db.execute(
    "SELECT * FROM leads ORDER BY created_at DESC"
  );
  return result.rows.map(mapLead);
}

export async function addLead(lead) {
  const db = await ensureTable();
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

  await db.execute({
    sql: `INSERT INTO leads (id, created_at, status, name, contact, site_type, message, source)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      entry.id,
      entry.createdAt,
      entry.status,
      entry.name,
      entry.contact,
      entry.siteType,
      entry.message,
      entry.source
    ]
  });

  return entry;
}

export async function updateLeadStatus(id, status) {
  const allowed = new Set(["new", "contacted", "done"]);
  if (!allowed.has(status)) {
    throw new Error("Неизвестный статус");
  }
  const db = await ensureTable();
  await db.execute({
    sql: "UPDATE leads SET status = ? WHERE id = ?",
    args: [status, id]
  });
  const result = await db.execute({
    sql: "SELECT * FROM leads WHERE id = ? LIMIT 1",
    args: [id]
  });
  return result.rows[0] ? mapLead(result.rows[0]) : null;
}
