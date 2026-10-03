import axios from 'axios';

// В проде задайте VITE_API_URL=https://ваш-backend.onrender.com/api
// Локально переменную можно не задавать — сработает прокси из vite.config.js на /api.
const API_URL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({ baseURL: API_URL });

// Домен бэкенда без /api — нужен, чтобы правильно собирать ссылки на локально
// сохранённые изображения (/uploads/...), если фронтенд и бэкенд на разных доменах.
// Для картинок из Cloudinary (полный https-адрес) эта функция ничего не меняет.
export const resolveImage = (src) => {
  if (!src) return '';
  if (/^https?:\/\//.test(src)) return src;
  const origin = API_URL.replace(/\/api\/?$/, '');
  return `${origin}${src}`;
};

export default api;
