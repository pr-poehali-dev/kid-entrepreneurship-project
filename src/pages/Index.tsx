import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const stats = [
  { icon: '⚡', value: '5 мин', label: 'Средняя доставка' },
  { icon: '🛡️', value: '100%', label: 'Безопасно' },
  { icon: '👥', value: '10 000+', label: 'Клиентов' },
  { icon: '🎮', value: '3+', label: 'Игры' },
];

const games = [
  { name: 'Minecraft', icon: '💎', color: 'var(--neon-green)', desc: 'Diamonds & Emeralds' },
  { name: 'Roblox', icon: '🪙', color: 'var(--neon-cyan)', desc: 'Robux пакеты' },
  { name: 'Fortnite', icon: '⚡', color: 'var(--neon-purple)', desc: 'V-Bucks паки' },
];

const features = [
  { icon: 'Zap', title: 'Моментальная доставка', desc: 'Валюта приходит в течение 5-15 минут после оплаты. Работаем 24/7.' },
  { icon: 'Shield', title: 'Безопасные транзакции', desc: 'Все платежи защищены. Никаких рисков для вашего аккаунта.' },
  { icon: 'HeadphonesIcon', title: 'Поддержка 24/7', desc: 'Живой чат и email. Решим любую проблему быстро.' },
  { icon: 'Tag', title: 'Лучшие цены', desc: 'Регулярные скидки и акции для постоянных клиентов.' },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative grid-bg min-h-[90vh] flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: 'var(--neon-cyan)' }} />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: 'var(--neon-purple)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 blur-3xl" style={{ background: 'var(--neon-green)' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,255,255,0.3)] bg-[rgba(0,255,255,0.05)] mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--neon-green)] pulse-neon" />
            <span className="text-[var(--neon-cyan)] text-sm font-medium">Магазин онлайн • Быстрая доставка</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="glitch neon-cyan">GAME</span>
            <span className="gradient-text">COIN</span>
            <br />
            <span className="text-white">SHOP</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Покупай игровую валюту быстро и безопасно. Minecraft, Roblox, Fortnite и другие игры.
            Доставка за <span className="text-[var(--neon-green)]">5 минут</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog" className="btn-neon-cyan px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 justify-center">
              <Icon name="ShoppingCart" size={20} />
              Перейти в каталог
            </Link>
            <Link to="/about" className="btn-neon-purple px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 justify-center">
              <Icon name="Info" size={20} />
              Узнать больше
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="game-card rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl font-black neon-cyan">{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Games */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black gradient-text mb-3">Доступные игры</h2>
          <p className="text-gray-500">Выбери свою игру и получи валюту мгновенно</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link key={game.name} to={`/catalog?game=${game.name}`}>
              <div className="game-card rounded-2xl p-8 text-center cursor-pointer group">
                <div className="text-6xl mb-4 float-anim">{game.icon}</div>
                <h3 className="text-2xl font-black text-white mb-2">{game.name}</h3>
                <p className="text-sm mb-4" style={{ color: game.color }}>{game.desc}</p>
                <span className="btn-neon-cyan px-5 py-2 rounded-lg text-sm font-bold inline-block">
                  Смотреть цены
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 mt-20 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black gradient-text mb-3">Почему мы?</h2>
          <p className="text-gray-500">Тысячи довольных геймеров доверяют нам</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="game-card rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.2)' }}>
                <Icon name={f.icon} size={22} className="text-[var(--neon-cyan)]" />
              </div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="game-card neon-border-cyan rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl" style={{ background: 'var(--neon-purple)' }} />
          </div>
          <h2 className="text-3xl font-black text-white mb-3 relative z-10">Готов начать?</h2>
          <p className="text-gray-400 mb-8 relative z-10">Более 10 000 геймеров уже выбрали нас. Присоединяйся!</p>
          <Link to="/catalog" className="btn-neon-cyan px-10 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2 relative z-10">
            <Icon name="Rocket" size={20} />
            Купить валюту
          </Link>
        </div>
      </section>
    </div>
  );
}