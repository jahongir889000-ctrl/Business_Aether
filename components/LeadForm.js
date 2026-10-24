"use client";

import { useState } from "react";
import Reveal from "./Reveal";

export default function LeadForm() {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setPending(true);
    setStatus("");
    const form = new FormData(formEl);
    const payload = {
      name: form.get("name"),
      contact: form.get("contact"),
      siteType: form.get("siteType"),
      message: form.get("message"),
      source: "form"
    };
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Ошибка отправки");
      }
      setStatus("Заявка принята. Напишем в тот же день.");
      formEl.reset();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="section" id="lead">
      <div className="shell lead-grid">
        <Reveal>
          <h2>Оставьте задачу — посчитаем срок и бюджет</h2>
          <p className="muted">
            Имя и телефон или Telegram. Если удобнее отвечать кнопками,
            откройте ИИ-бриф в углу экрана.
          </p>
        </Reveal>
        <Reveal>
          <form className="form" onSubmit={onSubmit}>
            <label>
              Имя
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              Телефон или Telegram
              <input name="contact" required autoComplete="tel" />
            </label>
            <label>
              Тип сайта
              <select name="siteType" defaultValue="landing">
                <option value="landing">Лендинг</option>
                <option value="corporate">Корпоративный</option>
                <option value="shop">Магазин</option>
                <option value="other">Пока не знаю</option>
              </select>
            </label>
            <label>
              Коротко о задаче
              <textarea name="message" placeholder="Ниша, срок, что должно быть на сайте" />
            </label>
            <button className="btn btn-primary" type="submit" disabled={pending}>
              {pending ? "Отправляем…" : "Получить расчёт"}
            </button>
            <p className="form-status">{status}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
