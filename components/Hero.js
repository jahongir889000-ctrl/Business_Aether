"use client";

import { useEffect, useState } from "react";

export default function Hero({ onOpenQuiz }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    const onScroll = () => setOffset(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="hero" id="top">
      <div
        className="hero-layer hero-wash"
        style={{ transform: `translateY(${offset * 0.12}px)` }}
      />
      <div
        className="hero-layer hero-grid"
        style={{ transform: `translateY(${offset * 0.28}px)` }}
      />
      <div
        className="hero-layer hero-orb"
        style={{ transform: `translate3d(${offset * -0.04}px, ${offset * 0.18}px, 0)` }}
      />
      <div
        className="hero-frame"
        style={{
          transform: `rotate(8deg) translate3d(0, ${offset * 0.35}px, 0)`
        }}
        aria-hidden="true"
      />
      <div className="shell hero-content">
        <h1>Сайт, который сам приводит заявки</h1>
        <p className="lede">
          Aether Studio собирает лендинг или корпоративный сайт под ваш оффер.
          ИИ-помощник уточняет задачу за минуту — без долгих созвонов «просто
          познакомиться».
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href="#lead">
            Получить расчёт
          </a>
          <button className="btn btn-ghost" type="button" onClick={onOpenQuiz}>
            Пройти бриф с ИИ
          </button>
        </div>
      </div>
    </section>
  );
}
