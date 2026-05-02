export const API = {
  auth: 'https://functions.poehali.dev/ab0e05d3-1016-4d88-b166-df4c225fab1f',
  catalog: 'https://functions.poehali.dev/57ee5c82-d92a-44eb-abf0-dcac637792c7',
  orders: 'https://functions.poehali.dev/acf63207-6025-4170-80dd-e9b7de84a4ff',
  reviews: 'https://functions.poehali.dev/892f5d1c-1c97-4257-9d36-107b8f6921f6',
  chat: 'https://functions.poehali.dev/d3250bc1-9475-43bf-8900-d49256b9443a',
};

export async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return res.json();
}