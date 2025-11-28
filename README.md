# AIO V2.0 - Admin Console & Customer Panel

Production-ready Admin and Customer dashboard for AIO Systems, featuring "Deep Space Premium" design language.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Local Development

1. **Clone & Setup**
   ```bash
   git clone <repo>
   cd aio
   cp .env.example .env
   # Edit .env with your webhook URL (optional, defaults provided)
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   # Open http://localhost:5173
   ```

### Production Deployment

1. **Build & Start**
   ```bash
   npm install --production=false
   npm run build
   npm start
   ```
   This will build the project and start a production preview server on port 5173.

2. **Persistent Execution (PM2)**
   To keep the application running in the background:
   ```bash
   npm install -g pm2
   pm2 start "npm start" --name "aio"
   pm2 save
   pm2 startup
   ```

3. **Nginx Reverse Proxy (Optional)**
   For serving on port 80/443 with a domain:
   
   Copy the example config:
   ```bash
   cp nginx.conf.example /etc/nginx/sites-available/aio
   ln -s /etc/nginx/sites-available/aio /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   ```

### Deploying to Vercel

This project is optimized for deployment on Vercel as a Single Page Application (SPA).

1. **Create New Project**: Import this repository in Vercel.
2. **Build Configuration**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Environment Variables**:
   Add the following variables in the Vercel project settings:
   - `VITE_API_BASE_URL`: Your backend API URL (e.g., `https://api.yourdomain.com`)
   - `VITE_N8N_WEBHOOK_URL`: Your n8n webhook URL (e.g., `https://n8n.yourdomain.com/webhook`)
   - `VITE_DEFAULT_TENANT_SLUG`: (Optional) Default tenant slug, e.g. `aio-default`
   - `VITE_APP_NAME`: (Optional) App name, defaults to `AIO`

The application gracefully handles missing API URLs by falling back to mock data (for the main API) or showing error messages (for chat/webhooks).

## 📂 Project Structure

```
src/
├── components/
│   ├── features/     # Complex business components (ChatWidget, StatCard)
│   ├── layout/       # Layout wrappers (AdminLayout, CustomerLayout)
│   └── ui/           # Atomic UI components (Button, Input, Slider)
├── hooks/            # Custom hooks (useChat)
├── pages/            # Page views
├── services/         # API integration
├── types/            # TypeScript definitions
└── lib/              # Utilities
```

## 🎨 Design System

**Theme:** Deep Space Premium
- **Background:** #050505
- **Primary:** Electric Blue (#3b82f6)
- **Accent:** Neon Purple (#8b5cf6)
- **Glassmorphism:** Heavy use of `backdrop-blur-2xl` and `bg-white/[0.02]`

## 🔗 API Integration

The application connects to n8n webhooks defined in `.env`:
- **Agent Config:** POST `/update-agent`
- **Chat:** POST `/chat`

Phase 3 introduces tenant-aware placeholders for the upcoming backend:
- **Tenant signup:** `POST /api/public/signup`
- **Tenant config:** `GET /api/tenant/config?slug={tenant}`
- **Tenant usage:** `GET /api/tenant/usage?tenantId={id}`
- **Billing checkout:** `POST /api/billing/checkout`

If `VITE_API_BASE_URL` is not configured, the frontend falls back to rich demo data so you can design/QA the multi-tenant flows without a running backend.

## 🏢 Tenant Context & Multi-Tenant API

- `TenantProvider` (src/context/TenantContext.tsx) boots the admin UI with a tenant slug that is read from the `tenant` query-string or `localStorage` (`aio-active-tenant`).
- `useTenant()` exposes the active `tenant`, usage/profile responses, and helpers such as `setTenant`/`switchTenant` so every admin page can react to tenant changes.
- `src/lib/tenantIdentity.ts` keeps the slug in sync between React and non-React modules so background code (like services) can read the same value without a hook.
- `src/services/api.ts` now injects `X-Tenant-Slug` into **all** requests via an Axios interceptor, so every webhook/API call automatically carries the tenant identity.
- Admin headers clearly display the tenant being managed ("Managing: <tenant>") and surface a placeholder when no tenant is selected to avoid ambiguous sessions.

### Backend expectations

The backend must read the `X-Tenant-Slug` header (or the `tenant_slug` payload fields we already send to n8n webhooks) and enforce isolation server-side. A future `/api/me` endpoint can return the default tenant slug + metadata so the frontend no longer needs query params, but the context + storage helpers are already prepared for that response.
