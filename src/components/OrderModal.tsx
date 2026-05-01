import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { API, apiFetch } from '@/lib/api';
import { getUser } from '@/lib/auth';

interface Product {
  id: number;
  game_name: string;
  pack_name: string;
  currency_amount: number;
  price: number;
  currency_icon: string;
}

interface OrderModalProps {
  product: Product;
  onClose: () => void;
  onAuthRequired: () => void;
}

export default function OrderModal({ product, onClose, onAuthRequired }: OrderModalProps) {
  const user = getUser();
  const [form, setForm] = useState({ game_nickname: '', server: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);

  if (!user) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
        <div className="game-card neon-border-cyan rounded-2xl p-8 w-full max-w-md mx-4 text-center" onClick={e => e.stopPropagation()}>
          <span className="text-5xl block mb-4">🔐</span>
          <h3 className="text-xl font-bold text-white mb-2">Требуется вход</h3>
          <p className="text-gray-400 mb-6">Для оформления заказа необходимо войти в аккаунт</p>
          <button onClick={() => { onClose(); onAuthRequired(); }} className="btn-neon-cyan px-6 py-3 rounded-xl font-bold">
            Войти / Зарегистрироваться
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.game_nickname.trim()) { setError('Введите игровой никнейм'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await apiFetch(API.orders, {
        method: 'POST',
        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
          game_nickname: form.game_nickname,
          server: form.server,
          quantity: 1,
        }),
      });
      if (res.error) { setError(res.error); return; }
      setOrderId(res.order.id);
      setSuccess(true);
    } catch {
      setError('Ошибка. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="game-card neon-border-cyan rounded-2xl p-8 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white">Оформить заказ</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <Icon name="X" size={22} />
          </button>
        </div>

        {success ? (
          <div className="text-center py-4">
            <span className="text-6xl block mb-4">✅</span>
            <h3 className="text-xl font-bold neon-green mb-2">Заказ #{orderId} оформлен!</h3>
            <p className="text-gray-400 text-sm mb-6">Валюта будет доставлена в течение 5-15 минут на аккаунт <b className="text-white">{form.game_nickname}</b></p>
            <button onClick={onClose} className="btn-neon-green px-6 py-3 rounded-xl font-bold">Отлично!</button>
          </div>
        ) : (
          <>
            <div className="game-card rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{product.currency_icon}</span>
                <div>
                  <p className="text-xs text-gray-400">{product.game_name}</p>
                  <p className="font-bold text-white">{product.pack_name}</p>
                  <p className="text-[var(--neon-cyan)] font-black">{product.price} ₽</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Игровой никнейм *</label>
                <input
                  required
                  value={form.game_nickname}
                  onChange={e => setForm(f => ({ ...f, game_nickname: e.target.value }))}
                  placeholder="Ваш ник в игре"
                  className="w-full bg-[rgba(0,255,255,0.05)] border border-[rgba(0,255,255,0.2)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Сервер (если есть)</label>
                <input
                  value={form.server}
                  onChange={e => setForm(f => ({ ...f, server: e.target.value }))}
                  placeholder="Например: EU, RU-1"
                  className="w-full bg-[rgba(0,255,255,0.05)] border border-[rgba(0,255,255,0.2)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-neon-purple py-3 rounded-xl font-bold text-base mt-2 disabled:opacity-50"
              >
                {loading ? 'Обработка...' : `Оплатить ${product.price} ₽`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
