import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(0,255,255,0.1)] mt-16 py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎮</span>
            <span className="font-black text-xl gradient-text">GAMECOIN</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Надёжный магазин игровой валюты с быстрой доставкой и круглосуточной поддержкой.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Навигация</h4>
          <div className="flex flex-col gap-2">
            {[['/', 'Главная'], ['/catalog', 'Каталог'], ['/about', 'О магазине'], ['/reviews', 'Отзывы']].map(([href, label]) => (
              <Link key={href} to={href} className="text-gray-500 text-sm hover:text-[var(--neon-cyan)] transition-colors">{label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Поддержка</h4>
          <div className="flex flex-col gap-2">
            {[['/faq', 'FAQ'], ['/contacts', 'Контакты']].map(([href, label]) => (
              <Link key={href} to={href} className="text-gray-500 text-sm hover:text-[var(--neon-cyan)] transition-colors">{label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Игры</h4>
          <div className="flex flex-col gap-2">
            {['Minecraft', 'Roblox', 'Fortnite'].map(game => (
              <Link key={game} to={`/catalog?game=${game}`} className="text-gray-500 text-sm hover:text-[var(--neon-cyan)] transition-colors">{game}</Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-600 text-xs">© 2024 GameCoin Shop. Все права защищены.</p>
        <div className="flex gap-4">
          <span className="text-gray-600 text-xs">Быстрая доставка</span>
          <span className="text-gray-600 text-xs">•</span>
          <span className="text-gray-600 text-xs">Безопасная оплата</span>
          <span className="text-gray-600 text-xs">•</span>
          <span className="text-gray-600 text-xs">Поддержка 24/7</span>
        </div>
      </div>
    </footer>
  );
}
