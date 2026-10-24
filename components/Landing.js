"use client";

import { useState } from "react";
import SmoothScroll from "./SmoothScroll";
import Hero from "./Hero";
import Advantages from "./Advantages";
import Reviews from "./Reviews";
import FAQ from "./FAQ";
import LeadForm from "./LeadForm";
import AiWidget from "./AiWidget";

export default function Landing() {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      <SmoothScroll />
      <header className="nav">
        <a className="logo" href="#top">
          Aether
        </a>
        <nav className="nav-links">
          <a href="#advantages">Подход</a>
          <a href="#reviews">Кейсы</a>
          <a href="#faq">Вопросы</a>
          <a href="#lead">Расчёт</a>
        </nav>
      </header>
      <Hero onOpenQuiz={() => setQuizOpen(true)} />
      <Advantages />
      <Reviews />
      <FAQ />
      <LeadForm />
      <footer className="footer shell">
        <span>Aether Studio</span>
        <span>Сайты с заявками, не с пустым портфолио</span>
      </footer>
      <AiWidget open={quizOpen} onOpenChange={setQuizOpen} />
    </>
  );
}
