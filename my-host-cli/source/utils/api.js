import fetch from 'node-fetch';
import config from './config.js';

const getBaseUrl = () => config.get('apiUrl');

export async function apiPost(path, body = {}) {
  const url = `${getBaseUrl()}${path}`;
  const headers = { 'Content-Type': 'application/json' };

  const token = config.get('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`);
  }
  return data;
}

export async function apiGet(path) {
  const url = `${getBaseUrl()}${path}`;
  const headers = {};

  const token = config.get('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`);
  }
  return data;
}
