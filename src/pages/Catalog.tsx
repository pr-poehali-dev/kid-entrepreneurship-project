import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { API, apiFetch } from '@/lib/api';
import OrderModal from '@/components/OrderModal';

interface Product {
  id: number;
  game_name: string;
  pack_name: string;
  currency_amount: number;
  price: number;
  old_price: number | null;
  discount: number | null;
  currency_icon: string;
  badge: string | null;
  description: string;
  in_stock: boolean;
}

interface CatalogProps {
  onAuthRequired: () => void;
}

export default function Catalog({ onAuthRequired }: CatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [games, setGames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeGame = searchParams.get('game') || '';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const url = activeGame ? `${API.catalog}?game=${encodeURIComponent(activeGame)}` : API.catalog;
      const res = await apiFetch(url);
      setProducts(res.products || []);
      setGames(res.games || []);
      setLoading(false);
    };
    load();
  }, [activeGame]);

  const badgeColor: Record<string, string> = {
    'ХИИТ': 'badge-popular',
    'ПОПУЛЯРНЫЙ': 'badge-popular',
    'СКИДКА': 'badge-sale',
    'ВЫГОДА': 'badge-sale',
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black gradient-text mb-3">Каталог</h1>
          <p className="text-gray-500">Выбери игровую валюту для своей игры</p>
        </div>

        {/* Game filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <button
            onClick={() => setSearchParams({})}
            className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${
              !activeGame ? 'btn-neon-cyan' : 'border border-[rgba(255,255,255,0.1)] text-gray-400 hover:border-[rgba(0,255,255,0.3)] hover:text-white'
            }`}
          >
            Все игры
          </button>
          {games.map(game => (
            <button
              key={game}
              onClick={() => setSearchParams({ game })}
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${
                activeGame === game ? 'btn-neon-cyan' : 'border border-[rgba(255,255,255,0.1)] text-gray-400 hover:border-[rgba(0,255,255,0.3)] hover:text-white'
              }`}
            >
              {game}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="game-card rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {activeGame && (
              <div className="mb-6 text-center text-gray-400 text-sm">
                Показано <span className="text-[var(--neon-cyan)] font-bold">{products.length}</span> пакетов для {activeGame}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(p => (
                <div key={p.id} className="game-card rounded-2xl p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{p.game_name}</p>
                      <div className="text-4xl">{p.currency_icon}</div>
                    </div>
                    {p.badge && (
                      <span className={badgeColor[p.badge] || 'badge-popular'}>
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-lg mb-1">{p.pack_name}</h3>
                  <p className="text-[var(--neon-cyan)] font-bold text-sm mb-1">
                    {p.currency_amount.toLocaleString()} {p.currency_icon}
                  </p>
                  <p className="text-gray-500 text-xs mb-4 flex-1">{p.description}</p>

                  <div className="mt-auto">
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-2xl font-black text-white">{p.price} ₽</span>
                      {p.old_price && (
                        <>
                          <span className="text-gray-600 text-sm line-through">{p.old_price} ₽</span>
                          <span className="text-[var(--neon-green)] text-xs font-bold">-{p.discount}%</span>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="btn-neon-purple w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <Icon name="ShoppingCart" size={16} />
                      Купить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAuthRequired={onAuthRequired}
        />
      )}
    </div>
  );
}
