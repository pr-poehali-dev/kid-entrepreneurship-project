import { useState } from 'react';
import Icon from '@/components/ui/icon';

const faqs = [
  {
    q: 'Как быстро придёт валюта после оплаты?',
    a: 'Доставка занимает от 5 до 15 минут. В редких случаях — до 30 минут. Если прошло больше времени — напишите в поддержку, решим быстро!'
  },
  {
    q: 'Безопасно ли покупать у вас?',
    a: 'Абсолютно безопасно. Мы не запрашиваем пароль от вашего игрового аккаунта. Всё что нам нужно — ваш никнейм в игре. Платежи защищены SSL.'
  },
  {
    q: 'Какие способы оплаты доступны?',
    a: 'Принимаем банковские карты (Visa, MasterCard, МИР), СБП (Система быстрых платежей), ЮMoney и другие электронные кошельки.'
  },
  {
    q: 'Можно ли вернуть деньги?',
    a: 'Возврат возможен если валюта не была доставлена. Для возврата напишите на support@gamecoin.shop с номером заказа. Рассматриваем заявки в течение 24 часов.'
  },
  {
    q: 'Для каких игр есть валюта?',
    a: 'Сейчас поддерживаем Minecraft (Diamonds), Roblox (Robux) и Fortnite (V-Bucks). Список игр постоянно расширяется!'
  },
  {
    q: 'Что такое "сервер" в форме заказа?',
    a: 'Некоторые игры имеют разные серверы (EU, RU, Asia). Укажите сервер вашего аккаунта для быстрой доставки. Если не знаете — оставьте поле пустым.'
  },
  {
    q: 'Могу ли я купить валюту в подарок?',
    a: 'Конечно! Укажите никнейм получателя в форме заказа. Валюта придёт на его аккаунт.'
  },
  {
    q: 'Есть ли скидки для постоянных клиентов?',
    a: 'Да! Мы регулярно проводим акции и делаем специальные предложения. Следите за разделом "Каталог" — там всегда актуальные скидки.'
  },
  {
    q: 'Что делать если возникла проблема с заказом?',
    a: 'Напишите в наш онлайн-чат (кнопка в правом нижнем углу) или на email support@gamecoin.shop. Отвечаем круглосуточно, обычно в течение 15 минут.'
  },
  {
    q: 'Нужно ли регистрироваться для покупки?',
    a: 'Да, нужна простая регистрация — она позволяет отслеживать заказы и сохранять историю покупок. Регистрация бесплатная и занимает 30 секунд.'
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black gradient-text mb-3">FAQ</h1>
          <p className="text-gray-500">Часто задаваемые вопросы</p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`game-card rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === i ? 'neon-border-cyan' : ''
              }`}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-semibold text-white pr-4">{faq.q}</span>
                <Icon
                  name="ChevronDown"
                  size={20}
                  className={`text-[var(--neon-cyan)] flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6">
                  <div className="h-px bg-[rgba(0,255,255,0.1)] mb-4" />
                  <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 game-card neon-border-purple rounded-2xl p-6 text-center">
          <p className="text-gray-400 mb-4">Не нашли ответ на свой вопрос?</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="mailto:support@gamecoin.shop" className="btn-neon-cyan px-5 py-2.5 rounded-xl font-bold text-sm inline-flex items-center gap-2">
              <Icon name="Mail" size={16} />
              Написать на email
            </a>
            <button className="btn-neon-purple px-5 py-2.5 rounded-xl font-bold text-sm inline-flex items-center gap-2">
              <Icon name="MessageCircle" size={16} />
              Открыть чат
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
