import Icon from '@/components/ui/icon';

const contacts = [
  {
    icon: 'Mail',
    title: 'Email',
    value: 'support@gamecoin.shop',
    desc: 'Отвечаем в течение 2-4 часов',
    href: 'mailto:support@gamecoin.shop',
    color: 'var(--neon-cyan)',
  },
  {
    icon: 'MessageCircle',
    title: 'Онлайн-чат',
    value: 'Открыть чат',
    desc: 'Ответ за 5-15 минут, 24/7',
    href: '#chat',
    color: 'var(--neon-green)',
  },
  {
    icon: 'Send',
    title: 'Telegram',
    value: '@gamecoin_shop',
    desc: 'Пишите напрямую в мессенджер',
    href: 'https://t.me/gamecoin_shop',
    color: 'var(--neon-purple)',
  },
];

export default function Contacts() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black gradient-text mb-3">Контакты</h1>
          <p className="text-gray-500">Мы всегда на связи — выбери удобный способ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contacts.map(c => (
            <a key={c.title} href={c.href} className="game-card rounded-2xl p-6 text-center group hover:scale-105 transition-transform cursor-pointer block">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `rgba(0,0,0,0.3)`, border: `2px solid ${c.color}50` }}>
                <Icon name={c.icon} size={28} style={{ color: c.color }} />
              </div>
              <h3 className="font-black text-white text-lg mb-1">{c.title}</h3>
              <p style={{ color: c.color }} className="font-bold mb-1">{c.value}</p>
              <p className="text-gray-500 text-sm">{c.desc}</p>
            </a>
          ))}
        </div>

        {/* Working hours */}
        <div className="game-card neon-border-cyan rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-[var(--neon-green)] pulse-neon" />
            <h2 className="text-xl font-black text-white">Режим работы</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { period: 'Онлайн-чат', time: 'Круглосуточно, 24/7', online: true },
              { period: 'Email поддержка', time: 'Пн–Вс, 9:00–23:00', online: true },
              { period: 'Доставка заказов', time: 'Автоматически, 24/7', online: true },
              { period: 'Разрешение споров', time: 'Пн–Пт, 10:00–20:00', online: false },
            ].map(item => (
              <div key={item.period} className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.05)]">
                <span className="text-gray-400">{item.period}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.online ? 'bg-[var(--neon-green)] pulse-neon' : 'bg-yellow-500'}`} />
                  <span className="text-white text-sm font-medium">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick questions */}
        <div className="game-card rounded-2xl p-8 text-center">
          <span className="text-4xl block mb-4">💬</span>
          <h2 className="text-2xl font-black text-white mb-3">Быстрый вопрос?</h2>
          <p className="text-gray-400 mb-6">Используй чат прямо сейчас — кнопка в правом нижнем углу экрана</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Где мой заказ?', 'Как оплатить?', 'Возврат средств', 'Другой вопрос'].map(q => (
              <span key={q} className="px-4 py-2 rounded-full border border-[rgba(0,255,255,0.2)] text-gray-400 text-sm hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] cursor-pointer transition-colors">
                {q}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
