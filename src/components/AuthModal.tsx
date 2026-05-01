import { useState } from 'react';
import { API, apiFetch } from '@/lib/api';
import { saveUser } from '@/lib/auth';
import Icon from '@/components/ui/icon';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiFetch(API.auth, {
        method: 'POST',
        body: JSON.stringify({ action: mode, ...form }),
      });
      if (res.error) { setError(res.error); return; }
      saveUser(res.user, res.session_id);
      onSuccess();
      onClose();
    } catch {
      setError('Ошибка соединения. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="game-card neon-border-cyan rounded-2xl p-8 w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black gradient-text">
            {mode === 'login' ? 'Вход' : 'Регистрация'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <Icon name="X" size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Никнейм</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                className="w-full bg-[rgba(0,255,255,0.05)] border border-[rgba(0,255,255,0.2)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                placeholder="ProGamer123"
              />
            </div>
          )}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full bg-[rgba(0,255,255,0.05)] border border-[rgba(0,255,255,0.2)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
              placeholder="gamer@email.com"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Пароль</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full bg-[rgba(0,255,255,0.05)] border border-[rgba(0,255,255,0.2)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-neon-cyan py-3 rounded-xl font-bold text-base mt-2 disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-500">
          {mode === 'login' ? (
            <>Нет аккаунта?{' '}
              <button onClick={() => setMode('register')} className="text-[var(--neon-cyan)] hover:underline">
                Зарегистрироваться
              </button>
            </>
          ) : (
            <>Уже есть аккаунт?{' '}
              <button onClick={() => setMode('login')} className="text-[var(--neon-cyan)] hover:underline">
                Войти
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
