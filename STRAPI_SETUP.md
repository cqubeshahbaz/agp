# Strapi + Next.js Setup (No XAMPP)

## 1) Current architecture
- `backend/` = Strapi CMS (SQLite by default)
- `frontend/` = Next.js storefront
- No MySQL/XAMPP is required for Strapi itself.
- Auth, cart, and wishlist now use Strapi APIs directly.

## 2) Environment files

### Backend
- Copy `backend/.env.example` to `backend/.env` (or update your existing `.env`).
- Key values:
  - `PORT=1337`
  - `CLIENT_URL=http://localhost:3000`
  - `DATABASE_CLIENT=sqlite`
  - `DATABASE_FILENAME=.tmp/data.db`

### Frontend
- Copy `frontend/.env.example` to `frontend/.env.local`.
- Key values:
  - `NEXT_PUBLIC_STRAPI_URL=http://127.0.0.1:1337`
  - `STRAPI_API_TOKEN=` (optional for private server-side reads)
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
  - `STRIPE_SECRET_KEY=sk_test_...`
  - `STRIPE_WEBHOOK_SECRET=whsec_...`
  - `NEXT_PUBLIC_APP_URL=http://localhost:3000`

## 3) Start both apps

### Terminal 1 (Strapi)
```bash
cd backend
npm run develop
```

### Terminal 2 (Next.js)
```bash
cd frontend
npm run dev
```

## 4) Strapi admin setup
- Open `http://127.0.0.1:1337/admin`
- Create admin user.
- Go to **Content-Type Builder** and create content types you need (Product, Category, etc.).
- Existing single types already present:
  - `Global`
  - `About`
- Added collection types in code:
  - `Cart Item`
  - `Wishlist Item`

## 5) Make frontend read public data
- Go to **Settings -> Users & Permissions Plugin -> Roles -> Public**
- Enable `find` / `findOne` for content types you want public.

## 6) Enable authenticated permissions (required)
- Go to **Settings -> Users & Permissions Plugin -> Roles -> Authenticated**
- Enable for `Cart Item`:
  - `find`
  - `findOne`
  - `create`
  - `update`
  - `delete`
- Enable for `Wishlist Item`:
  - `find`
  - `findOne`
  - `create`
  - `update`
  - `delete`
- Enable for `Order`:
  - `find`
  - `findOne`
  - `create`
- Auth endpoints used by frontend:
  - `/api/auth/local`
  - `/api/auth/local/register`
  - `/api/auth/forgot-password`
  - `/api/auth/reset-password`
  - `/api/users/me`

## 7) API token (only if using private content)
- Go to **Settings -> API Tokens**
- Create read-only token.
- Put it in `frontend/.env.local`:
  - `STRAPI_API_TOKEN=your_token_here`

## 7.1) Stripe webhook
- In Stripe dashboard, add webhook endpoint:
  - `http://localhost:3000/api/stripe/webhook`
- Subscribe to events:
  - `checkout.session.completed`
  - `checkout.session.expired`
- Copy webhook signing secret into:
  - `STRIPE_WEBHOOK_SECRET`

## 8) What is already connected in code
- Frontend Strapi client:
  - `frontend/src/lib/strapi.ts`
  - `frontend/src/lib/strapi-content.ts`
- Frontend Strapi auth helper:
  - `frontend/src/lib/strapi-auth.ts`
- App metadata reads Strapi `global` single type:
  - `frontend/src/app/layout.tsx`
- Auth/cart/wishlist contexts use Strapi directly:
  - `frontend/src/components/auth-context.tsx`
  - `frontend/src/components/cart-context.tsx`
  - `frontend/src/components/wishlist-context.tsx`
- Backend user-scoped controllers:
  - `backend/src/api/cart-item/controllers/cart-item.ts`
  - `backend/src/api/wishlist-item/controllers/wishlist-item.ts`
- Next image allowlist includes Strapi media host:
  - `frontend/next.config.mjs`
- Backend CORS allows frontend origin:
  - `backend/config/middlewares.ts`

## 9) Cleanup done
- Removed old frontend MySQL API routes and MySQL helper files.
- Frontend no longer needs MySQL/XAMPP to run.
- Removed `mysql2` and `bcrypt` from `frontend/package.json`.
