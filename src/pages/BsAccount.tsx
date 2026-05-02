import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { API, apiFetch } from '@/lib/api';
import { getUser } from '@/lib/auth';

interface Listing {
  id: number;
  title: string;
  trophies: number;
  brawlers_count: number;
  max_brawler_trophies: number;
  has_legendary: boolean;
  has_mythic: boolean;
  server: string;
  price: number;
  description: string;
  rare_brawlers: string;
  status: string;
  account_login_method: string;
  seller_name: string;
  seller_id: number;
}

interface BsAccountProps {
  onAuthRequired: () => void;
}

export default function BsAccount({ onAuthRequired }: BsAccountProps) {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [accountData, setAccountData] = useState<{ email: string; password: string; login_method: string } | null>(null);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const user = getUser();

  useEffect(() => {
    const load = async () => {
      const res = await apiFetch(`${API.bsApi}?action=detail&id=${id}`);
      setListing(res);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleBuy = async () => {
    if (!user) { onAuthRequired(); return; }
    setBuying(true);
    setError('');
    try {
      const res = await apiFetch(`${API.bsApi}?action=buy`, {
        method: 'POST',
        body: JSON.stringify({ listing_id: Number(id), buyer_id: user.id }),
      });
      if (res.error) { setError(res.error); return; }
      setPurchased(true);
      setAccountData(res.account);
      setShowConfirm(false);
    } catch {
      setError('Ошибка при покупке. Попробуйте позже.');
    } finally {
      setBuying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-[var(--neon-cyan)] border-t-transparent animate-spin" />
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <span className="text-6xl block mb-4">😕</span>
        <p className="text-white text-xl mb-4">Объявление не найдено</p>
        <Link to="/bs-market" className="btn-neon-cyan px-6 py-3 rounded-xl font-bold">Вернуться</Link>
      </div>
    </div>
  );

  const loginMethodLabel: Record<string, string> = {
    supercell_id: 'Supercell ID',
    google: 'Google аккаунт',
    apple: 'Apple ID',
    email: 'Email',
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/bs-market" className="hover:text-[var(--neon-cyan)]">Маркетплейс</Link>
          <Icon name="ChevronRight" size={14} />
          <span className="text-white">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="game-card neon-border-cyan rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex gap-2 mb-2">
                    {listing.has_legendary && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-bold">⭐ Легендарные бойцы</span>
                    )}
                    {listing.has_mythic && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold">💜 Мифические бойцы</span>
                    )}
                    {listing.status === 'sold' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold">ПРОДАН</span>
                    )}
                  </div>
                  <h1 className="text-2xl font-black text-white">{listing.title}</h1>
                  <p className="text-gray-500 text-sm mt-1">Продавец: <span className="text-[var(--neon-cyan)]">{listing.seller_name}</span></p>
                </div>
                <span className="text-4xl">🏆</span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {[
                  { icon: '🏆', val: listing.trophies.toLocaleString(), label: 'Кубков' },
                  { icon: '🥊', val: String(listing.brawlers_count), label: 'Бойцов' },
                  { icon: '⭐', val: String(listing.max_brawler_trophies), label: 'Макс. кубки бойца' },
                  { icon: '🌍', val: listing.server === 'global' ? 'Global' : listing.server, label: 'Сервер' },
                ].map(s => (
                  <div key={s.label} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl p-3 text-center">
                    <div className="text-xl mb-1">{s.icon}</div>
                    <div className="font-black text-white text-lg">{s.val}</div>
                    <div className="text-gray-600 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Rare brawlers */}
              {listing.rare_brawlers && (
                <div className="mb-5">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Редкие бойцы</p>
                  <div className="flex flex-wrap gap-2">
                    {listing.rare_brawlers.split(',').map(b => b.trim()).filter(Boolean).map(b => (
                      <span key={b} className="px-3 py-1 rounded-full bg-[rgba(155,89,255,0.15)] border border-[rgba(155,89,255,0.3)] text-purple-300 text-sm">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {listing.description && (
                <div>
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Описание</p>
                  <p className="text-gray-300 leading-relaxed">{listing.description}</p>
                </div>
              )}
            </div>

            {/* How it works */}
            <div className="game-card rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="Info" size={16} className="text-[var(--neon-cyan)]" />
                Как работает покупка
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { n: '1', t: 'Нажми "Купить"', d: 'Аккаунт сразу резервируется для тебя' },
                  { n: '2', t: 'Получи данные', d: 'Email и пароль появятся на этой странице' },
                  { n: '3', t: 'Войди в игру', d: `Используй ${loginMethodLabel[listing.account_login_method] || 'Supercell ID'} для входа` },
                  { n: '4', t: 'Смени пароль', d: 'Обязательно смени пароль после входа' },
                ].map(s => (
                  <div key={s.n} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))', color: '#050d1a' }}>
                      {s.n}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{s.t}</p>
                      <p className="text-gray-500 text-xs">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Purchase panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              {purchased && accountData ? (
                <div className="game-card neon-border-green rounded-2xl p-6">
                  <div className="text-center mb-5">
                    <span className="text-5xl block mb-3">✅</span>
                    <h3 className="text-xl font-black neon-green">Аккаунт куплен!</h3>
                    <p className="text-gray-400 text-sm mt-1">Сохрани данные</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.2)] rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Email / логин</p>
                      <p className="text-white font-mono font-bold break-all">{accountData.email}</p>
                    </div>
                    <div className="bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.2)] rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Пароль</p>
                      <p className="text-white font-mono font-bold break-all">{accountData.password}</p>
                    </div>
                    <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Метод входа</p>
                      <p className="text-[var(--neon-cyan)] font-bold text-sm">
                        {loginMethodLabel[accountData.login_method] || accountData.login_method}
                      </p>
                    </div>
                  </div>
                  <p className="text-yellow-400 text-xs mt-4 text-center">⚠️ Сразу смени пароль после входа!</p>
                  <Link to="/bs-market" className="btn-neon-cyan w-full py-3 rounded-xl font-bold text-sm text-center block mt-4">
                    Найти ещё аккаунты
                  </Link>
                </div>
              ) : (
                <div className="game-card neon-border-purple rounded-2xl p-6">
                  <div className="text-center mb-5">
                    <div className="text-4xl font-black text-white mb-1">{listing.price.toLocaleString()} ₽</div>
                    <p className="text-gray-500 text-sm">Разовая покупка</p>
                  </div>

                  <div className="flex flex-col gap-2 mb-5 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Icon name="Zap" size={14} className="text-[var(--neon-green)]" />
                      Данные сразу после покупки
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Icon name="Shield" size={14} className="text-[var(--neon-cyan)]" />
                      Безопасная сделка
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Icon name="RefreshCw" size={14} className="text-[var(--neon-purple)]" />
                      Аккаунт резервируется
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}

                  {listing.status === 'sold' ? (
                    <div className="text-center py-3 text-red-400 font-bold">Аккаунт уже продан</div>
                  ) : !showConfirm ? (
                    <button
                      onClick={() => user ? setShowConfirm(true) : onAuthRequired()}
                      className="btn-neon-purple w-full py-3 rounded-xl font-bold text-base"
                    >
                      Купить за {listing.price.toLocaleString()} ₽
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-center text-yellow-400 text-sm mb-2">Подтверди покупку</p>
                      <button
                        onClick={handleBuy}
                        disabled={buying}
                        className="btn-neon-green w-full py-3 rounded-xl font-bold disabled:opacity-50"
                      >
                        {buying ? 'Обработка...' : '✓ Подтвердить'}
                      </button>
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="text-gray-500 text-sm hover:text-white text-center py-2"
                      >
                        Отмена
                      </button>
                    </div>
                  )}

                  {!user && (
                    <p className="text-gray-600 text-xs text-center mt-3">
                      Для покупки необходимо <button onClick={onAuthRequired} className="text-[var(--neon-cyan)] hover:underline">войти</button>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
