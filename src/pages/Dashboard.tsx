import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { API, apiFetch } from '@/lib/api';
import { getUser, logout } from '@/lib/auth';

interface MyListing {
  id: number; title: string; trophies: number; brawlers_count: number;
  price: number; status: string; created_at: string;
  account_email: string; account_password: string; account_login_method: string;
}

interface MyPurchase {
  purchase_id: number; title: string; trophies: number; brawlers_count: number;
  account_email: string; account_password: string; account_login_method: string;
  price: number; purchased_at: string;
}

interface DashboardProps {
  onAuthRequired: () => void;
}

export default function Dashboard({ onAuthRequired }: DashboardProps) {
  const user = getUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'purchases' | 'listings'>('purchases');
  const [listings, setListings] = useState<MyListing[]>([]);
  const [purchases, setPurchases] = useState<MyPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [reveal, setReveal] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!user) { onAuthRequired(); return; }
    const load = async () => {
      setLoading(true);
      const [l, p] = await Promise.all([
        apiFetch(`${API.bsApi}?action=my_listings&seller_id=${user.id}`),
        apiFetch(`${API.bsApi}?action=my_purchases&buyer_id=${user.id}`),
      ]);
      setListings(l.listings || []);
      setPurchases(p.purchases || []);
      setLoading(false);
    };
    load();
  }, []);

  if (!user) return null;

  const statusLabel: Record<string, { text: string; cls: string }> = {
    active: { text: 'Активно', cls: 'text-[var(--neon-green)] bg-[rgba(0,255,136,0.1)] border-[rgba(0,255,136,0.2)]' },
    sold: { text: 'Продано', cls: 'text-gray-400 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]' },
  };

  const loginLabel: Record<string, string> = {
    supercell_id: 'Supercell ID', google: 'Google', apple: 'Apple ID', email: 'Email',
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Profile header */}
        <div className="game-card neon-border-cyan rounded-2xl p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black"
              style={{ background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))', color: '#050d1a' }}>
              {user.username[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{user.username}</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/bs-sell" className="btn-neon-green px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
              <Icon name="Plus" size={16} />
              Продать
            </Link>
            <button
              onClick={() => { logout(); navigate('/'); window.location.reload(); }}
              className="text-gray-500 hover:text-white px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.1)] text-sm"
            >
              Выйти
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {([
            { key: 'purchases', label: 'Мои покупки', icon: 'ShoppingBag', count: purchases.length },
            { key: 'listings', label: 'Мои объявления', icon: 'Tag', count: listings.length },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                tab === t.key ? 'btn-neon-cyan' : 'border border-[rgba(255,255,255,0.1)] text-gray-400 hover:text-white'
              }`}
            >
              <Icon name={t.icon} size={16} />
              {t.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tab === t.key ? 'bg-[rgba(0,0,0,0.3)]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="game-card rounded-2xl h-28 animate-pulse" />)}
          </div>
        ) : tab === 'purchases' ? (
          purchases.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl block mb-4">🛒</span>
              <p className="text-gray-400 mb-4">Покупок пока нет</p>
              <Link to="/bs-market" className="btn-neon-cyan px-6 py-3 rounded-xl font-bold">Перейти в маркетплейс</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {purchases.map(p => (
                <div key={p.purchase_id} className="game-card rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white">{p.title}</h3>
                      <p className="text-gray-500 text-xs mt-0.5">
                        🏆 {p.trophies.toLocaleString()} кубков • 🥊 {p.brawlers_count} бойцов
                      </p>
                    </div>
                    <span className="text-[var(--neon-cyan)] font-black">{p.price.toLocaleString()} ₽</span>
                  </div>

                  <div className="border-t border-[rgba(255,255,255,0.05)] pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Данные аккаунта</p>
                      <button
                        onClick={() => setReveal(r => ({ ...r, [p.purchase_id]: !r[p.purchase_id] }))}
                        className="text-xs text-[var(--neon-cyan)] hover:underline flex items-center gap-1"
                      >
                        <Icon name={reveal[p.purchase_id] ? 'EyeOff' : 'Eye'} size={12} />
                        {reveal[p.purchase_id] ? 'Скрыть' : 'Показать'}
                      </button>
                    </div>
                    {reveal[p.purchase_id] ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.15)] rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <p className="text-white font-mono text-sm break-all">{p.account_email}</p>
                        </div>
                        <div className="bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.15)] rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Пароль</p>
                          <p className="text-white font-mono text-sm break-all">{p.account_password}</p>
                        </div>
                        <div className="bg-[rgba(255,255,255,0.03)] rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Метод входа</p>
                          <p className="text-[var(--neon-cyan)] text-sm font-bold">{loginLabel[p.account_login_method] || p.account_login_method}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[rgba(255,255,255,0.02)] rounded-lg p-3 flex items-center gap-2">
                        <Icon name="Lock" size={14} className="text-gray-600" />
                        <span className="text-gray-600 text-sm">•••••••••••• / ••••••••</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          listings.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl block mb-4">📋</span>
              <p className="text-gray-400 mb-4">Объявлений пока нет</p>
              <Link to="/bs-sell" className="btn-neon-green px-6 py-3 rounded-xl font-bold">Создать объявление</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {listings.map(l => (
                <div key={l.id} className="game-card rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white truncate">{l.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${statusLabel[l.status]?.cls || ''}`}>
                        {statusLabel[l.status]?.text || l.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      🏆 {l.trophies.toLocaleString()} • 🥊 {l.brawlers_count} бойцов
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-black text-lg">{l.price.toLocaleString()} ₽</p>
                    <Link to={`/bs-account/${l.id}`} className="text-[var(--neon-cyan)] text-xs hover:underline">
                      Смотреть
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
