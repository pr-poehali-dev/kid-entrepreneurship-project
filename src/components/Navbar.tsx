import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { getUser, logout } from '@/lib/auth';

interface NavbarProps {
  onAuthClick: () => void;
}

export default function Navbar({ onAuthClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const user = getUser();

  const links = [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Каталог' },
    { href: '/about', label: 'О магазине' },
    { href: '/reviews', label: 'Отзывы' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contacts', label: 'Контакты' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(0,255,255,0.15)] bg-[rgba(5,13,26,0.95)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🎮</span>
          <span className="font-black text-xl tracking-wider gradient-text">GAMECOIN</span>
          <span className="text-[var(--neon-cyan)] font-black text-xl">SHOP</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-all duration-200 hover:text-[var(--neon-cyan)] ${
                isActive(link.href)
                  ? 'text-[var(--neon-cyan)] neon-cyan'
                  : 'text-gray-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--neon-cyan)] hidden md:block">{user.username}</span>
              <button
                onClick={() => { logout(); window.location.reload(); }}
                className="btn-neon-cyan px-4 py-1.5 rounded-lg text-sm font-semibold"
              >
                Выйти
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="btn-neon-cyan px-4 py-1.5 rounded-lg text-sm font-semibold"
            >
              Войти
            </button>
          )}

          <button
            className="md:hidden text-gray-400 hover:text-[var(--neon-cyan)]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[rgba(0,255,255,0.1)] bg-[rgba(5,13,26,0.98)] px-4 py-4 flex flex-col gap-3">
          {links.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium py-2 transition-colors ${
                isActive(link.href) ? 'text-[var(--neon-cyan)]' : 'text-gray-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
