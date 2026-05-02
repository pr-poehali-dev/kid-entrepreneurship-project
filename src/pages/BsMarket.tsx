import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { API, apiFetch } from '@/lib/api';

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
  created_at: string;
  seller_name: string;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Новые' },
  { value: 'price_asc', label: 'Цена ↑' },
  { value: 'price_desc', label: 'Цена ↓' },
  { value: 'trophies', label: 'Кубки ↓' },
];

export default function BsMarket() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [filters, setFilters] = useState({ has_legendary: false, has_mythic: false, max_price: '' });

  const load = async () => {
    setLoading(true);
    const q = new URLSearchParams({ action: 'listings', sort });
    if (filters.has_legendary) q.set('has_legendary', 'true');
    if (filters.has_mythic) q.set('has_mythic', 'true');
    if (filters.max_price) q.set('max_price', filters.max_price);
    const res = await apiFetch(`${API.bsApi}?${q}`);
    setListings(res.listings || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [sort, filters]);

  const trophyColor = (t: number) => {
    if (t >= 50000) return 'text-yellow-400';
    if (t >= 20000) return 'text-purple-400';
    if (t >= 8000) return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">🏆</span>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-black gradient-text leading-tight">Brawl Stars</h1>
              <p className="text-[var(--neon-cyan)] font-bold">Маркетплейс аккаунтов</p>
            </div>
          </div>
          <p className="text-gray-500 max-w-xl mx-auto">Покупай и продавай прокачанные аккаунты. Данные приходят автоматически после покупки.</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link to="/bs-sell" className="btn-neon-green px-5 py-2.5 rounded-xl font-bold flex items-center gap-2">
            <Icon name="Plus" size={18} />
            Продать аккаунт
          </Link>
          <Link to="/dashboard" className="btn-neon-cyan px-5 py-2.5 rounded-xl font-bold flex items-center gap-2">
            <Icon name="User" size={18} />
            Мой кабинет
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <div className="lg:w-60 flex-shrink-0">
            <div className="game-card neon-border-cyan rounded-2xl p-5 sticky top-20">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="SlidersHorizontal" size={16} className="text-[var(--neon-cyan)]" />
                Фильтры
              </h3>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Сортировка</label>
                  {SORT_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      onClick={() => setSort(o.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                        sort === o.value
                          ? 'bg-[rgba(0,255,255,0.15)] text-[var(--neon-cyan)]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>

                <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
                  <label className="text-xs text-gray-400 mb-3 block">Редкость</label>
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={filters.has_legendary}
                      onChange={e => setFilters(f => ({ ...f, has_legendary: e.target.checked }))}
                      className="accent-yellow-400"
                    />
                    <span className="text-yellow-400 text-sm font-bold">⭐ Есть легендарные</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.has_mythic}
                      onChange={e => setFilters(f => ({ ...f, has_mythic: e.target.checked }))}
                      className="accent-purple-400"
                    />
                    <span className="text-purple-400 text-sm font-bold">💜 Есть мифические</span>
                  </label>
                </div>

                <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
                  <label className="text-xs text-gray-400 mb-2 block">Макс. цена (₽)</label>
                  <input
                    type="number"
                    placeholder="Любая"
                    value={filters.max_price}
                    onChange={e => setFilters(f => ({ ...f, max_price: e.target.value }))}
                    className="w-full bg-[rgba(0,255,255,0.05)] border border-[rgba(0,255,255,0.15)] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--neon-cyan)]"
                  />
                </div>

                <button
                  onClick={() => { setFilters({ has_legendary: false, has_mythic: false, max_price: '' }); setSort('newest'); }}
                  className="text-gray-500 text-xs hover:text-white text-center"
                >
                  Сбросить фильтры
                </button>
              </div>
            </div>
          </div>

          {/* Listings grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <div key={i} className="game-card rounded-2xl h-64 animate-pulse" />)}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-6xl block mb-4">🔍</span>
                <p className="text-gray-400 text-lg">Объявлений не найдено</p>
                <p className="text-gray-600 text-sm mt-2">Попробуй изменить фильтры</p>
              </div>
            ) : (
              <>
                <p className="text-gray-500 text-sm mb-4">Найдено: <span className="text-white font-bold">{listings.length}</span> аккаунтов</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {listings.map(l => (
                    <Link key={l.id} to={`/bs-account/${l.id}`}>
                      <div className="game-card rounded-2xl p-5 cursor-pointer h-full flex flex-col">
                        {/* Top badges */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex gap-1 flex-wrap">
                            {l.has_legendary && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-bold">
                                ⭐ Легенда
                              </span>
                            )}
                            {l.has_mythic && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold">
                                💜 Мифик
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-600">{l.seller_name}</span>
                        </div>

                        <h3 className="font-bold text-white text-base mb-3 leading-tight">{l.title}</h3>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-[rgba(255,255,255,0.03)] rounded-lg p-2 text-center">
                            <div className={`text-lg font-black ${trophyColor(l.trophies)}`}>
                              🏆 {l.trophies.toLocaleString()}
                            </div>
                            <div className="text-gray-600 text-xs">кубков</div>
                          </div>
                          <div className="bg-[rgba(255,255,255,0.03)] rounded-lg p-2 text-center">
                            <div className="text-lg font-black text-[var(--neon-cyan)]">
                              🥊 {l.brawlers_count}
                            </div>
                            <div className="text-gray-600 text-xs">бойцов</div>
                          </div>
                        </div>

                        {/* Rare brawlers */}
                        {l.rare_brawlers && (
                          <p className="text-gray-500 text-xs mb-3 leading-relaxed flex-1">
                            <span className="text-gray-400">Редкие: </span>{l.rare_brawlers}
                          </p>
                        )}

                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-2xl font-black text-white">{l.price.toLocaleString()} ₽</span>
                          <span className="btn-neon-purple px-4 py-1.5 rounded-lg text-sm font-bold">
                            Купить
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
