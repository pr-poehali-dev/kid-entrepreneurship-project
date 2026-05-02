import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { API, apiFetch } from '@/lib/api';
import { getUser } from '@/lib/auth';

interface BsSellProps {
  onAuthRequired: () => void;
}

export default function BsSell({ onAuthRequired }: BsSellProps) {
  const user = getUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    trophies: '',
    brawlers_count: '',
    max_brawler_trophies: '',
    has_legendary: false,
    has_mythic: false,
    server: 'global',
    price: '',
    description: '',
    rare_brawlers: '',
    account_email: '',
    account_password: '',
    account_login_method: 'supercell_id',
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="game-card neon-border-cyan rounded-2xl p-10 text-center max-w-md">
          <span className="text-5xl block mb-4">🔐</span>
          <h2 className="text-2xl font-black text-white mb-3">Нужен аккаунт</h2>
          <p className="text-gray-400 mb-6">Для размещения объявления необходимо войти</p>
          <button onClick={onAuthRequired} className="btn-neon-cyan px-6 py-3 rounded-xl font-bold">
            Войти / Зарегистрироваться
          </button>
        </div>
      </div>
    );
  }

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.price || !form.trophies || !form.account_email || !form.account_password) {
      setError('Заполните все обязательные поля');
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch(`${API.bsApi}?action=create`, {
        method: 'POST',
        body: JSON.stringify({
          seller_id: user.id,
          ...form,
          trophies: parseInt(form.trophies),
          brawlers_count: parseInt(form.brawlers_count || '0'),
          max_brawler_trophies: parseInt(form.max_brawler_trophies || '0'),
          price: parseFloat(form.price),
        }),
      });
      if (res.error) { setError(res.error); return; }
      navigate('/dashboard');
    } catch {
      setError('Ошибка. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-[rgba(0,255,255,0.05)] border border-[rgba(0,255,255,0.15)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-colors";

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <Link to="/bs-market" className="text-gray-500 hover:text-white">
            <Icon name="ArrowLeft" size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black gradient-text">Продать аккаунт</h1>
            <p className="text-gray-500 text-sm">Brawl Stars • Заполни данные об аккаунте</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Basic info */}
          <div className="game-card neon-border-cyan rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="FileText" size={16} className="text-[var(--neon-cyan)]" />
              Основная информация
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Заголовок объявления *</label>
                <input className={inputCls} placeholder="Топ аккаунт 45000 кубков с легендарками"
                  value={form.title} onChange={e => set('title', e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Описание</label>
                <textarea className={inputCls} rows={3} placeholder="Расскажи подробнее об аккаунте..."
                  value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Редкие бойцы (через запятую)</label>
                <input className={inputCls} placeholder="Sandy, Amber, Crow, Leon"
                  value={form.rare_brawlers} onChange={e => set('rare_brawlers', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="game-card rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="BarChart2" size={16} className="text-[var(--neon-purple)]" />
              Характеристики аккаунта
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Кубки *</label>
                <input type="number" className={inputCls} placeholder="45000" min="0"
                  value={form.trophies} onChange={e => set('trophies', e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Количество бойцов</label>
                <input type="number" className={inputCls} placeholder="58" min="0"
                  value={form.brawlers_count} onChange={e => set('brawlers_count', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Макс. кубки бойца</label>
                <input type="number" className={inputCls} placeholder="1200" min="0"
                  value={form.max_brawler_trophies} onChange={e => set('max_brawler_trophies', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Сервер</label>
                <select className={inputCls} value={form.server} onChange={e => set('server', e.target.value)}>
                  <option value="global">Global</option>
                  <option value="ru">Россия</option>
                  <option value="eu">Европа</option>
                  <option value="us">США</option>
                </select>
              </div>
            </div>
            <div className="flex gap-6 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.has_legendary}
                  onChange={e => set('has_legendary', e.target.checked)} className="accent-yellow-400 w-4 h-4" />
                <span className="text-yellow-400 font-bold text-sm">⭐ Есть легендарные</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.has_mythic}
                  onChange={e => set('has_mythic', e.target.checked)} className="accent-purple-400 w-4 h-4" />
                <span className="text-purple-400 font-bold text-sm">💜 Есть мифические</span>
              </label>
            </div>
          </div>

          {/* Account credentials */}
          <div className="game-card neon-border-purple rounded-2xl p-6">
            <h3 className="font-bold text-white mb-1 flex items-center gap-2">
              <Icon name="Lock" size={16} className="text-[var(--neon-purple)]" />
              Данные для входа
            </h3>
            <p className="text-gray-600 text-xs mb-4">Покупатель получит их автоматически после оплаты</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Email / логин от аккаунта *</label>
                <input type="email" className={inputCls} placeholder="your@email.com"
                  value={form.account_email} onChange={e => set('account_email', e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Пароль *</label>
                <input type="text" className={inputCls} placeholder="Пароль от аккаунта"
                  value={form.account_password} onChange={e => set('account_password', e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Метод входа</label>
                <select className={inputCls} value={form.account_login_method}
                  onChange={e => set('account_login_method', e.target.value)}>
                  <option value="supercell_id">Supercell ID</option>
                  <option value="google">Google</option>
                  <option value="apple">Apple ID</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="game-card rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="Tag" size={16} className="text-[var(--neon-green)]" />
              Цена
            </h3>
            <div className="relative">
              <input type="number" className={inputCls + ' text-2xl font-black pr-12'} placeholder="1999" min="1"
                value={form.price} onChange={e => set('price', e.target.value)} required />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₽</span>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button type="submit" disabled={loading}
            className="btn-neon-green py-4 rounded-xl font-black text-lg disabled:opacity-50 flex items-center justify-center gap-2">
            <Icon name="Upload" size={20} />
            {loading ? 'Публикую...' : 'Опубликовать объявление'}
          </button>
        </form>
      </div>
    </div>
  );
}
