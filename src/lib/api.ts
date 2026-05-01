import func2url from '../../func2url.json';

const URLS = func2url as Record<string, string>;

export const API = {
  auth: URLS['auth'],
  catalog: URLS['catalog'],
  orders: URLS['orders'],
  reviews: URLS['reviews'],
  chat: URLS['chat'],
};

export async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return res.json();
}
