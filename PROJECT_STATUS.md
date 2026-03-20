# Nucular Electronics — текущий статус работ (2026-03-19)

Этот файл — краткая сводка того, что уже сделано и что делаем дальше. Нужен, чтобы при смене аккаунта/чата быстро восстановить контекст.

## 1) RetailCRM (заказы)

### Что было
- Заказы не попадали в RetailCRM, ошибки на serverless.
- В CRM появлялись позиции с ценой $0.

### Что исправлено
- Serverless /api/retailcrm/order:
  - Передача `site` (код сайта): используется `RETAILCRM_SITE=nucular`.
  - Вызов RetailCRM переведён на `application/x-www-form-urlencoded`, параметр `order` передаётся как JSON-строка (иначе CRM ругалась `order contains a non-scalar value`).
  - В запрос добавлен `&site=nucular` в query (для мультисайта).
  - Улучшена диагностика ошибок: сервер возвращает тело ответа CRM при 4xx/5xx.
- Цена в CRM:
  - В items теперь передаётся `initialPrice`, вычисляемый из данных корзины/суммы заказа (чтобы в CRM не было $0).
- Backend Express (если используется):
  - Аналогичные правки: `site` и `x-www-form-urlencoded`, `initialPrice`.

### Проверка
- Создать заказ с товаром в корзине → в RetailCRM появляется заказ со строкой товара и ценой (не $0).

## 2) Stripe / Checkout

### Что исправлено
- Зафиксирована стабильная версия Stripe API в serverless функциях.
- Добавлена защита от “пустой корзины”:
  - Checkout блокируется при `items=0` или `totalPrice<=0`, чтобы не получать `Invalid order payload`.

### Что проверить
- Оформить заказ с товаром → переход на Stripe Checkout.
- После оплаты → webhook отмечает оплату и не падает.

## 3) Supabase Auth (письма регистрации/подтверждения)

### Проблема
- Письмо подтверждения содержало ссылку на `localhost:3000` и при клике давало ошибку.
- Ссылка длинная (с токенами), пользователи путаются.

### Что исправлено в коде
- Добавлена страница `/auth/confirm`:
  - При переходе по письму показывает понятный статус и переводит в `/profile`.
- В регистрации установлен `emailRedirectTo: ${window.location.origin}/auth/confirm`.

### Что нужно сделать в Supabase (вручную)
- Authentication → URL Configuration:
  - Site URL: `https://nucularelectronics.vercel.app` (сейчас) → позже поменять на `https://nucular.tech`.
  - Additional Redirect URLs добавить:
    - `https://<домен>/auth/confirm`
    - `https://<домен>/update-password`
- Authentication → Email templates:
  - Вставить кастомный HTML шаблон с кнопкой `Verify My Account` на `{{ .ConfirmationURL }}`.
- SMTP (опционально, но желательно):
  - Включить custom SMTP, From name: `Nucular Electronics`, From email: `no-reply@nucular.tech`.

## 4) Адаптив (большие экраны)

### Что делали
- Правили контейнеры/выравнивания для больших разрешений (1920/2560+), но важно было не ломать “ваше” привычное разрешение.

### Текущее правило
- Для стандартных экранов оставлены прежние ширины (например, 1180px для News/Reviews и текущие паддинги футера).
- Для больших экранов включены расширения через media query (>=1920px) только там, где нужно.

## 5) Домен nucular.tech → Vercel

### Цель
- Перевести сайт с домена `*.vercel.app` на `https://nucular.tech` и обновить интеграции (Supabase/Stripe/почта).

### Где мы остановились
- В Vercel домен `nucular.tech` добавлен, статус “Invalid configuration” (DNS не проставлен).
- Vercel предлагает 2 варианта:
  - Добавить DNS записи у текущего провайдера (рекомендуем).
  - Или перенести nameservers на Vercel DNS (не делаем сейчас).

### Следующие шаги (завтра)
1) У провайдера домена добавить DNS A-запись для `@` на IP, который показывает Vercel (в разделе DNS Records).
2) Дождаться “Valid configuration” в Vercel.
3) Vercel env:
   - `FRONTEND_URL=https://nucular.tech`
   - при необходимости обновить CORS/allowed origins
4) Supabase:
   - Site URL → `https://nucular.tech`
   - Redirect URLs → добавить `https://nucular.tech/auth/confirm` и `https://nucular.tech/update-password`
5) Stripe:
   - Webhook endpoint → `https://nucular.tech/api/webhook`
   - Обновить `STRIPE_WEBHOOK_SECRET` в Vercel после создания нового endpoint.

## 6) Важные переменные окружения (без значений)

### Frontend (Vercel serverless)
- `RETAILCRM_URL`
- `RETAILCRM_API_KEY`
- `RETAILCRM_SITE` (нужно: `nucular`)
- `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (или `SUPABASE_SERVICE_ROLE`)
- `STRIPE_SECRET`
- `STRIPE_WEBHOOK_SECRET`
- `FRONTEND_URL`

---
Если нужно продолжить с другого аккаунта/чата: начинаем с раздела “5) Домен nucular.tech → Vercel”.

