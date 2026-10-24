import Reveal from "./Reveal";

const items = [
  {
    mark: "10–21",
    title: "Срок, который можно поставить в календарь",
    text: "Лендинг за две недели, корпоративный сайт — около трёх. Этапы фиксируем в брифе, а не «когда дизайнер освободится»."
  },
  {
    mark: "60 с",
    title: "Бриф без созвона",
    text: "ИИ-помощник спрашивает цель, нишу и бюджет. Менеджер получает уже собранную задачу, а не пустое «нужен сайт»."
  },
  {
    mark: "1 экран",
    title: "Оффер на первом экране, а не абстрактный креатив",
    text: "Собираем структуру вокруг заявки: заголовок, доказательства, форма. Красота подчиняется продаже."
  },
  {
    mark: "90к+",
    title: "Понятный вход по бюджету",
    text: "Лендинг от 90 000 ₽, корпоративный от 180 000 ₽. Если задача шире — скажем об этом до старта, а не на середине макета."
  }
];

export default function Advantages() {
  return (
    <section className="section" id="advantages">
      <div className="shell split">
        <Reveal>
          <h2>Что отличает работу с нами</h2>
          <p className="muted">
            Мы не продаём «присутствие в интернете». Мы собираем страницу,
            с которой человеку понятно, что делать дальше.
          </p>
        </Reveal>
        <div className="advantage-list">
          {items.map((item) => (
            <Reveal key={item.title}>
              <article className="advantage-item">
                <div className="advantage-mark">{item.mark}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
