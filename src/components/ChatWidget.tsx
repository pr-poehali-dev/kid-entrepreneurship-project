import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { API, apiFetch } from '@/lib/api';
import { getUser, getSessionId } from '@/lib/auth';

interface Message {
  id: number;
  user_name: string;
  message: string;
  is_support: boolean;
  created_at: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const user = getUser();
  const sessionId = getSessionId();

  const userName = user ? user.username : 'Гость';

  const loadMessages = async () => {
    const res = await apiFetch(`${API.chat}?session_id=${sessionId}`);
    if (res.messages) {
      setMessages(res.messages);
    }
  };

  useEffect(() => {
    if (open) {
      loadMessages();
      setUnread(0);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    setLoading(true);

    const tempMsg: Message = {
      id: Date.now(),
      user_name: userName,
      message: text,
      is_support: false,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const res = await apiFetch(API.chat, {
        method: 'POST',
        body: JSON.stringify({ session_id: sessionId, user_name: userName, message: text }),
      });
      if (res.auto_reply) {
        const supportMsg: Message = {
          id: Date.now() + 1,
          user_name: 'Поддержка',
          message: res.auto_reply,
          is_support: true,
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, supportMsg]);
        if (!open) setUnread(u => u + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-window shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,255,255,0.15)]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--neon-green)] pulse-neon" />
              <span className="text-sm font-bold text-white">Поддержка онлайн</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white">
              <Icon name="X" size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ maxHeight: '280px', minHeight: '280px' }}>
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-8">
                <span className="text-2xl block mb-2">💬</span>
                Напишите нам — ответим быстро!
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.is_support ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  msg.is_support
                    ? 'bg-[rgba(0,255,255,0.1)] border border-[rgba(0,255,255,0.2)] text-white'
                    : 'bg-[rgba(155,89,255,0.2)] border border-[rgba(155,89,255,0.3)] text-white'
                }`}>
                  {msg.is_support && (
                    <p className="text-[var(--neon-cyan)] text-xs font-bold mb-1">{msg.user_name}</p>
                  )}
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-[rgba(0,255,255,0.1)] flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Написать сообщение..."
              className="flex-1 bg-[rgba(0,255,255,0.05)] border border-[rgba(0,255,255,0.15)] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] placeholder-gray-600"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="btn-neon-cyan px-3 py-2 rounded-lg disabled:opacity-40"
            >
              <Icon name="Send" size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center relative shadow-lg transition-transform hover:scale-105"
        style={{ background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))', boxShadow: '0 0 20px rgba(0,255,255,0.4)' }}
      >
        <Icon name={open ? 'X' : 'MessageCircle'} size={24} />
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--neon-pink)] rounded-full flex items-center justify-center text-xs font-bold text-white">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
