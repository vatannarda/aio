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
