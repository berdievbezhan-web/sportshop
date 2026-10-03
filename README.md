# SPORTFORM — мужской интернет-магазин спортивной одежды

Стек: **Node.js/Express + MongoDB** (backend) и **React (Vite) + Tailwind** (frontend).
Готов к деплою на бесплатных облачных сервисах: **MongoDB Atlas + Render/Railway + Vercel + Cloudinary**.

## Возможности
- Каталог: футболки, спортивки, шорты, брюки/бриджи
- Регистрация и вход покупателя **по номеру телефона**
- Выбор размера с учётом остатков на складе
- Корзина и оформление заказа (нужен вход)
- Если нужного товара/размера нет — форма **«Оставить заявку»**
- **Админ-панель** (`/admin`): добавление товаров с фото и размерами/остатками из готовых категорий, управление заказами и заявками
- Загрузка изображений: локально на диск (для разработки) или в **Cloudinary** (для прода — фото не теряются при перезапуске сервера)

## Структура
```
sportshop/
  backend/   — Express API + MongoDB (Mongoose)
  frontend/  — React (Vite) + Tailwind CSS
```

---

## 1. Локальный запуск (для разработки)

### MongoDB
Нужна локальная MongoDB (`mongodb://localhost:27017`) — или сразу создайте бесплатный кластер на [Atlas](https://www.mongodb.com/atlas) и используйте его строку подключения даже локально.

### Backend
```bash
cd backend
cp .env.example .env
# заполните MONGO_URI, JWT_SECRET, ADMIN_PHONE, ADMIN_PASSWORD
# Cloudinary-переменные можно оставить пустыми — фото будут сохраняться в backend/uploads
npm install
npm run seed:admin   # создаёт администратора
npm run dev           # http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env   # VITE_API_URL оставьте пустым
npm install
npm run dev             # http://localhost:5173
```
Войдите под телефоном/паролем администратора — попадёте в `/admin`.

---

## 2. Бесплатный облачный деплой — пошагово

### Шаг 1. MongoDB Atlas (база данных)
1. Зарегистрируйтесь на [mongodb.com/atlas](https://www.mongodb.com/atlas) → создайте бесплатный кластер (M0).
2. Database Access → создайте пользователя с паролем.
3. Network Access → Add IP Address → **Allow access from anywhere** (0.0.0.0/0) — проще всего для старта.
4. Database → Connect → Drivers → скопируйте строку вида
   `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/sportshop?retryWrites=true&w=majority`
   Это и есть ваш `MONGO_URI`.

### Шаг 2. Cloudinary (хранилище фото)
1. Зарегистрируйтесь на [cloudinary.com](https://cloudinary.com/users/register/free) (бесплатный тариф).
2. На Dashboard скопируйте **Cloud name**, **API Key**, **API Secret**.

### Шаг 3. GitHub
```bash
cd sportshop
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/<ваш-логин>/<репозиторий>.git
git push -u origin main
```

### Шаг 4. Backend на Render (или Railway — процесс аналогичен)
1. [render.com](https://render.com) → New → Web Service → подключите ваш GitHub-репозиторий.
2. **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. В разделе Environment добавьте переменные (те же, что в `backend/.env.example`):
   - `MONGO_URI` — из Atlas
   - `JWT_SECRET` — любая длинная случайная строка
   - `ADMIN_PHONE`, `ADMIN_PASSWORD` — данные вашего админ-аккаунта
   - `CLIENT_URL` — заполните после шага 5 (адрес фронтенда на Vercel)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — из Cloudinary
6. Deploy. После первого успешного деплоя откройте Shell на Render (или Railway) и один раз выполните:
   ```bash
   npm run seed:admin
   ```
   Это создаст вашего администратора в базе.
7. Скопируйте адрес backend (например `https://sportshop-backend.onrender.com`) — он понадобится фронтенду.

### Шаг 5. Frontend на Vercel
1. [vercel.com](https://vercel.com) → New Project → тот же GitHub-репозиторий.
2. **Root Directory**: `frontend`
3. Framework Preset определится как Vite автоматически. Build Command: `npm run build`, Output: `dist`.
4. Environment Variables → добавьте:
   - `VITE_API_URL` = `https://sportshop-backend.onrender.com/api` (адрес backend из шага 4 + `/api`)
5. Deploy. Получите домен вида `https://your-shop.vercel.app`.
6. Вернитесь в Render/Railway и обновите переменную `CLIENT_URL` на этот домен (нужно для CORS) → передеплойте backend.

Готово — сайт работает полностью в облаке, все регистрации и заказы реальных пользователей пишутся в Atlas.

### Примечание про бесплатные тарифы
Render/Railway free-тариф "засыпает" backend после периода бездействия — первый запрос после паузы может занять до ~30-50 секунд. Для реального магазина без задержек рекомендуется платный план (от $5-7/мес) или VPS.

---

## Что можно добавить дальше
- SMS-подтверждение номера телефона (сейчас — просто телефон + пароль)
- Оплата онлайн
- Отзывы и рейтинги товаров
- Email/SMS-уведомления о смене статуса заказа
