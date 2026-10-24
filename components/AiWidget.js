"use client";

import { useMemo, useState } from "react";

const STEPS = [
  {
    key: "goal",
    prompt: "Какой сайт нужен?",
    chips: [
      { label: "Лендинг", value: "лендинг" },
      { label: "Корпоративный", value: "корпоративный сайт" },
      { label: "Магазин", value: "интернет-магазин" }
    ]
  },
  {
    key: "niche",
    prompt: "В какой нише работаете?",
    chips: [
      { label: "Услуги", value: "услуги" },
      { label: "Медицина", value: "медицина" },
      { label: "Образование", value: "образование" },
      { label: "Ритейл", value: "ритейл" }
    ]
  },
  {
    key: "deadline",
    prompt: "Когда хотите запуститься?",
    chips: [
      { label: "До 2 недель", value: "до 2 недель" },
      { label: "Месяц", value: "около месяца" },
      { label: "Не горит", value: "без жёсткого срока" }
    ]
  },
  {
    key: "budget",
    prompt: "Какой бюджет комфортен?",
    chips: [
      { label: "90–150 тыс.", value: "90–150 тысяч ₽" },
      { label: "150–250 тыс.", value: "150–250 тысяч ₽" },
      { label: "250+", value: "от 250 тысяч ₽" }
    ]
  }
];

const greet =
  "Я Аэра, помощник студии. Можно ответить кнопками или своими словами — соберём бриф и оставим заявку менеджеру.";

export default function AiWidget({ open, onOpenChange }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: greet }]);
  const [quiz, setQuiz] = useState({});
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const current = STEPS[step];
  const quizReady = step >= STEPS.length;

  const history = useMemo(
    () =>
      messages
        .filter((item) => item.role === "user" || item.role === "assistant")
        .map((item) => ({ role: item.role, content: item.content })),
    [messages]
  );

  async function sendToModel(text, nextQuiz = quiz) {
    setBusy(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          quiz: nextQuiz
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "ИИ временно недоступен");
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.message +
            ". Можно сразу оставить имя и контакт в форме ниже — заявка всё равно дойдёт."
        }
      ]);
    } finally {
      setBusy(false);
    }
  }

  function pickChip(chip) {
    const nextQuiz = { ...quiz, [current.key]: chip.value };
    setQuiz(nextQuiz);
    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep < STEPS.length) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: chip.label },
        { role: "assistant", content: STEPS[nextStep].prompt }
      ]);
    } else {
      sendToModel(
        `Квиз: нужен ${nextQuiz.goal}, ниша ${nextQuiz.niche}, срок ${nextQuiz.deadline}, бюджет ${nextQuiz.budget}. Кратко скажи, что подойдёт, и попроси контакт.`,
        nextQuiz
      );
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!input.trim() || busy) return;
    const text = input.trim();
    setInput("");
    if (!quizReady && current) {
      const nextQuiz = { ...quiz, [current.key]: text };
      setQuiz(nextQuiz);
      const nextStep = step + 1;
      setStep(nextStep);
      if (nextStep < STEPS.length) {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: text },
          { role: "assistant", content: STEPS[nextStep].prompt }
        ]);
        return;
      }
      await sendToModel(
        `Квиз: ${JSON.stringify(nextQuiz)}. Сообщение клиента: ${text}`,
        nextQuiz
      );
      return;
    }
    await sendToModel(text);
  }

  async function submitLead() {
    if (!name.trim() || !contact.trim()) return;
    setBusy(true);
    try {
      const summary = [
        quiz.goal && `Тип: ${quiz.goal}`,
        quiz.niche && `Ниша: ${quiz.niche}`,
        quiz.deadline && `Срок: ${quiz.deadline}`,
        quiz.budget && `Бюджет: ${quiz.budget}`
      ]
        .filter(Boolean)
        .join(". ");
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          siteType: quiz.goal || "",
          message: summary,
          source: "ai-quiz"
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setDone(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Заявку отправила. Менеджер напишет в тот же день."
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: error.message }
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        className="ai-fab"
        type="button"
        aria-label="Открыть ИИ-помощника"
        onClick={() => onOpenChange(!open)}
      >
        А
      </button>
      {open ? (
        <div className="ai-panel" role="dialog" aria-label="ИИ-бриф">
          <div className="ai-head">
            <strong>Бриф с Аэрой</strong>
            <span>Ответьте кнопками или напишите сами</span>
          </div>
          <div className="ai-log">
            {messages.map((item, index) => (
              <div key={index} className={`bubble ${item.role === "user" ? "user" : "bot"}`}>
                {item.content}
              </div>
            ))}
          </div>
          {!quizReady && current ? (
            <div className="chips">
              {current.chips.map((chip) => (
                <button
                  key={chip.value}
                  className="chip"
                  type="button"
                  disabled={busy}
                  onClick={() => pickChip(chip)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          ) : null}
          {quizReady && !done ? (
            <div className="contact-mini">
              <input
                placeholder="Имя"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <input
                placeholder="Телефон или Telegram"
                value={contact}
                onChange={(event) => setContact(event.target.value)}
              />
              <button
                className="btn btn-primary"
                type="button"
                disabled={busy}
                onClick={submitLead}
              >
                Оставить заявку
              </button>
            </div>
          ) : null}
          <form className="ai-compose" onSubmit={onSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={current && !quizReady ? current.prompt : "Вопрос по услуге"}
              disabled={busy || done}
            />
            <button type="submit" disabled={busy || done}>
              OK
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
