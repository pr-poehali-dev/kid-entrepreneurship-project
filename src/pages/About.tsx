import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

const team = [
  { name: 'Алексей', role: 'Основатель', emoji: '👑', desc: 'Геймер с 10-летним стажем, создал магазин для таких же фанатов' },
  { name: 'Мария', role: 'Поддержка', emoji: '💬', desc: 'Отвечает на вопросы и помогает с заказами круглосуточно' },
  { name: 'Дмитрий', role: 'Технический директор', emoji: '⚙️', desc: 'Следит за стабильностью платформы и безопасностью платежей' },
];

const milestones = [
  { year: '2020', event: 'Открытие магазина', icon: '🚀' },
  { year: '2021', event: '1000 довольных клиентов', icon: '🎉' },
  { year: '2022', event: 'Запуск поддержки 24/7', icon: '💬' },
  { year: '2023', event: '10 000+ заказов', icon: '⚡' },
  { year: '2024', event: 'Новый сайт и больше игр', icon: '🎮' },
];

export default function About() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black gradient-text mb-3">О магазине</h1>
          <p className="text-gray-500">История, команда и ценности GameCoin Shop</p>
        </div>

        {/* Mission */}
        <div className="game-card neon-border-cyan rounded-3xl p-10 mb-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl" style={{ background: 'var(--neon-cyan)' }} />
          <span className="text-6xl block mb-6 float-anim">🎮</span>
          <h2 className="text-3xl font-black text-white mb-4">Наша миссия</h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Сделать покупку игровой валюты максимально простой, быстрой и безопасной для каждого геймера.
            Мы геймеры сами, поэтому понимаем, что вам нужно.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: 'Shield', title: 'Безопасность', desc: 'Все платежи защищены SSL. Мы никогда не просим данные аккаунта.', color: 'var(--neon-cyan)' },
            { icon: 'Zap', title: 'Скорость', desc: 'Автоматическая доставка в течение 5-15 минут после оплаты.', color: 'var(--neon-green)' },
            { icon: 'Heart', title: 'Честность', desc: 'Прозрачные цены, никаких скрытых комиссий и обмана.', color: 'var(--neon-purple)' },
          ].map(v => (
            <div key={v.title} className="game-card rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `rgba(${v.color === 'var(--neon-cyan)' ? '0,255,255' : v.color === 'var(--neon-green)' ? '0,255,136' : '155,89,255'},0.1)`, border: `1px solid ${v.color}30` }}>
                <Icon name={v.icon} size={24} style={{ color: v.color }} />
              </div>
              <h3 className="font-black text-white text-lg mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6 text-center">Наша команда</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map(m => (
              <div key={m.name} className="game-card rounded-2xl p-6 text-center">
                <span className="text-5xl block mb-3">{m.emoji}</span>
                <h3 className="font-black text-white text-lg">{m.name}</h3>
                <p className="text-[var(--neon-cyan)] text-sm mb-2">{m.role}</p>
                <p className="text-gray-500 text-sm">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6 text-center">Наша история</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-[rgba(0,255,255,0.2)]" />
            <div className="flex flex-col gap-6">
              {milestones.map(m => (
                <div key={m.year} className="flex items-center gap-6 pl-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 border-2 border-[var(--neon-cyan)]"
                    style={{ background: 'rgba(0,255,255,0.1)', minWidth: '2rem' }}>
                    {m.icon}
                  </div>
                  <div className="game-card rounded-xl px-5 py-3 flex-1 flex items-center justify-between">
                    <span className="text-white font-medium">{m.event}</span>
                    <span className="text-[var(--neon-cyan)] font-black">{m.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/catalog" className="btn-neon-cyan px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2">
            <Icon name="ShoppingCart" size={20} />
            Перейти в каталог
          </Link>
        </div>
      </div>
    </div>
  );
}
