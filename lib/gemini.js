import { GoogleGenerativeAI } from "@google/generative-ai";

const MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash"
];

export const SYSTEM_PROMPT = `Ты консультант веб-студии Aether Studio.
Услуги: продающие лендинги, корпоративные сайты, небольшие интернет-магазины. Срок обычно 10–21 день. Ориентиры по бюджету: лендинг от 90 000 ₽, корпоративный от 180 000 ₽, магазин от 250 000 ₽. Точную цену называет менеджер после брифа.

Правила:
- Отвечай по-русски, коротко, тепло, без канцелярита.
- Помогаешь понять услугу и мягко ведёшь к заявке.
- Не выдумывай скидки, гарантии ROI и чужие кейсы.
- Если вопрос не про сайты студии — коротко верни разговор к брифу.
- Если клиент уже описал задачу, попроси имя и телефон или Telegram.
- Когда в сообщении пользователя есть имя и контакт, подтверди, что заявку можно отправить, и попроси нажать «Оставить заявку» в виджете.

Контекст квиза (если есть): цель сайта, ниша, срок, бюджет.`;

export async function askGemini({ history, userMessage, quiz }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("Не задан GEMINI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(key);
  const quizBlock = quiz
    ? `\nДанные квиза: ${JSON.stringify(quiz)}`
    : "";

  let lastError;
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT + quizBlock
      });
      const chat = model.startChat({
        history: (history || []).map((item) => ({
          role: item.role === "assistant" ? "model" : "user",
          parts: [{ text: item.content }]
        }))
      });
      const result = await chat.sendMessage(userMessage);
      return result.response.text();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Gemini недоступен");
}
