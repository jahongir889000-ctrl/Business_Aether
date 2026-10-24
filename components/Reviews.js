import Reveal from "./Reveal";

export default function Reviews() {
  return (
    <section className="section" id="reviews">
      <div className="shell">
        <Reveal>
          <h2>Клиенты, которые уже принимают заявки с нового сайта</h2>
        </Reveal>
        <div className="reviews" style={{ marginTop: 40 }}>
          <Reveal className="review tall">
            <p>
              «Раньше заявки ловили в директ. После лендинга форма стала первым
              касанием: за месяц 37 заявок, из них 11 дошли до договора.»
            </p>
            <div className="who">Марина Соколова, школа французского</div>
          </Reveal>
          <Reveal className="review">
            <p>
              «Бриф занял вечер в чате. На созвон пришли уже с прототипом, а не
              с пустым Zoom.»
            </p>
            <div className="who">Илья Петров, клиника на Арбате</div>
          </Reveal>
          <Reveal className="review">
            <p>
              «Магазин собрали за три недели. Корзина не пугает, а менеджер видит
              заказ в Telegram сразу.»
            </p>
            <div className="who">Андрей Ким, свет и мебель</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
