export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export function getUser(): User | null {
  const data = localStorage.getItem('gc_user');
  return data ? JSON.parse(data) : null;
}

export function saveUser(user: User, sessionId: string) {
  localStorage.setItem('gc_user', JSON.stringify(user));
  localStorage.setItem('gc_session', sessionId);
}

export function logout() {
  localStorage.removeItem('gc_user');
  localStorage.removeItem('gc_session');
}

export function getSessionId(): string {
  let sid = localStorage.getItem('gc_session');
  if (!sid) {
    sid = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('gc_session', sid);
  }
  return sid;
}
