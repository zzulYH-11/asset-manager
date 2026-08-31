const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const MEMBER_ID = '1';

const getHeaders = () => ({
  'Accept': 'application/json',
  'X-Member-Id': MEMBER_ID
});

export const fetchStocksApi = () => fetch(`${API_BASE}/api/stocks`, { headers: getHeaders() }).then(r => r.json());
export const addStockApi = (data) => fetch(`${API_BASE}/api/stocks`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Member-Id': MEMBER_ID }, body: JSON.stringify(data) }).then(r => r.json());
export const deleteStockApi = (id) => fetch(`${API_BASE}/api/stocks/${id}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json());
export const fetchNewsApi = (keyword) => {
  const q = encodeURIComponent(keyword);
  return fetch(`${API_BASE}/api/news?keyWord=${q}`, { headers: getHeaders() }).then(r => r.json());
};
export const fetchIndicatorsApi = () => fetch(`${API_BASE}/api/indicators`, { headers: getHeaders() }).then(r => r.json());
