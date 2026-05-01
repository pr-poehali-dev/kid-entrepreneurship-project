import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { API, apiFetch } from '@/lib/api';

interface Review {
  id: number;
  username: string;
  game_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(5.0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', game_name: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await apiFetch(API.reviews);
      setReviews(res.reviews || []);
      setAvgRating(res.avg_rating || 5.0);
      setTotal(res.total || 0);
      setLoading(false);
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await apiFetch(API.reviews, {
      method: 'POST',
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    setSubmitted(true);
    setShowForm(false);
  };

  const stars = (count: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Icon key={i} name="Star" size={14} className={i < count ? 'text-yellow-400' : 'text-gray-700'} />
    ));

  const gameIcons: Record<string, string> = { Minecraft: '💎', Roblox: '🪙', Fortnite: '⚡' };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black gradient-text mb-3">Отзывы</h1>
          <p className="text-gray-500">Что говорят наши покупатели</p>
        </div>

        {/* Stats */}
        <div className="game-card neon-border-cyan rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center">
            <div className="text-6xl font-black neon-cyan mb-2">{avgRating}</div>
            <div className="flex gap-1 justify-center mb-1">{stars(Math.round(avgRating))}</div>
            <p className="text-gray-500 text-sm">Средний рейтинг</p>
          </div>
          <div className="text-center">
            <div className="text-6xl font-black neon-green mb-2">{total}</div>
            <p className="text-gray-500 text-sm">Всего отзывов</p>
          </div>
          <div className="text-center">
            <div className="text-6xl font-black neon-purple mb-2">98%</div>
            <p className="text-gray-500 text-sm">Довольных клиентов</p>
          </div>
          <div>
            {submitted ? (
              <div className="text-[var(--neon-green)] font-bold text-center">
                <Icon name="CheckCircle" size={32} className="mx-auto mb-2" />
                Спасибо за отзыв!
              </div>
            ) : (
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-neon-purple px-6 py-3 rounded-xl font-bold"
              >
                Оставить отзыв
              </button>
            )}
          </div>
        </div>

        {/* Review form */}
        {showForm && (
          <div className="game-card neon-border-purple rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-black text-white mb-4">Новый отзыв</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Ваш никнейм</label>
                  <input
                    required
                    value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    className="w-full bg-[rgba(0,255,255,0.05)] border border-[rgba(0,255,255,0.2)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--neon-cyan)]"
                    placeholder="ProGamer"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Игра</label>
                  <select
                    value={form.game_name}
                    onChange={e => setForm(f => ({ ...f, game_name: e.target.value }))}
                    className="w-full bg-[rgba(0,255,255,0.05)] border border-[rgba(0,255,255,0.2)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--neon-cyan)]"
                  >
                    <option value="">Выберите игру</option>
                    <option value="Minecraft">Minecraft</option>
                    <option value="Roblox">Roblox</option>
                    <option value="Fortnite">Fortnite</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Оценка</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}>
                      <Icon name="Star" size={28} className={n <= form.rating ? 'text-yellow-400' : 'text-gray-700'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Ваш отзыв</label>
                <textarea
                  required
                  rows={3}
                  value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  className="w-full bg-[rgba(0,255,255,0.05)] border border-[rgba(0,255,255,0.2)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--neon-cyan)] resize-none"
                  placeholder="Расскажите о вашем опыте..."
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-neon-cyan py-3 rounded-xl font-bold disabled:opacity-50">
                {submitting ? 'Отправляю...' : 'Отправить отзыв'}
              </button>
            </form>
          </div>
        )}

        {/* Reviews list */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="game-card rounded-2xl h-40 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map(r => (
              <div key={r.id} className="game-card rounded-2xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg"
                      style={{ background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))', color: '#050d1a' }}>
                      {r.username[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white">{r.username}</p>
                      <p className="text-xs text-gray-500">
                        {r.game_name && <span>{gameIcons[r.game_name] || '🎮'} {r.game_name}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">{stars(r.rating)}</div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{r.comment}</p>
                <p className="text-gray-600 text-xs mt-3">
                  {new Date(r.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
