"use client";

import { useCallback, useEffect, useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState([]);

  const loadLeads = useCallback(async () => {
    const response = await fetch("/api/leads");
    if (response.status === 401) {
      setAuthed(false);
      return;
    }
    const data = await response.json();
    setLeads(data.leads || []);
    setAuthed(true);
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  async function login(event) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Не удалось войти");
      return;
    }
    setPassword("");
    await loadLeads();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setLeads([]);
  }

  async function changeStatus(id, status) {
    await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    await loadLeads();
  }

  return (
    <main className="admin">
      <div className="shell">
        <h1>Заявки</h1>
        {!authed ? (
          <form className="admin-login form" onSubmit={login}>
            <p className="muted">Пароль из ADMIN_PASSWORD</p>
            <label>
              Пароль
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <button className="btn btn-primary" type="submit">
              Войти
            </button>
            <p className="form-status">{error}</p>
          </form>
        ) : (
          <>
            <div className="cta-row" style={{ marginTop: 24 }}>
              <button className="btn btn-ghost" type="button" onClick={loadLeads}>
                Обновить
              </button>
              <button className="btn btn-ghost" type="button" onClick={logout}>
                Выйти
              </button>
            </div>
            {leads.length === 0 ? (
              <p className="empty">Заявок пока нет. Они появятся с лендинга и из ИИ-брифа.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Источник</th>
                      <th>Имя</th>
                      <th>Контакт</th>
                      <th>Тип</th>
                      <th>Детали</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        <td>{new Date(lead.createdAt).toLocaleString("ru-RU")}</td>
                        <td>{lead.source}</td>
                        <td>{lead.name}</td>
                        <td>{lead.contact}</td>
                        <td>{lead.siteType}</td>
                        <td>{lead.message}</td>
                        <td>
                          <select
                            className="status"
                            value={lead.status}
                            onChange={(event) =>
                              changeStatus(lead.id, event.target.value)
                            }
                          >
                            <option value="new">новая</option>
                            <option value="contacted">связались</option>
                            <option value="done">закрыта</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
