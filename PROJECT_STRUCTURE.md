# AIO Admin Dashboard - Proje Yapısı

## 📁 Dosya Yapısı

```
aio-admin-dashboard/
├── public/                          # Static assets
│   └── vite.svg
│
├── src/
│   ├── components/
│   │   ├── layout/                  # Layout componentleri
│   │   │   ├── Header.tsx          # Üst header (Başlık, bildirim, durum)
│   │   │   ├── Layout.tsx          # Ana layout wrapper
│   │   │   └── Sidebar.tsx         # Sol navigasyon sidebar
│   │   │
│   │   └── ui/                      # Reusable UI bileşenleri
│   │       ├── Button.tsx          # Özelleştirilebilir buton
│   │       ├── Card.tsx            # Glassmorphism kart
│   │       ├── Input.tsx           # Form input
│   │       ├── Select.tsx          # Dropdown select
│   │       ├── Slider.tsx          # Range slider
│   │       ├── StatCard.tsx        # İstatistik kartı
│   │       ├── Textarea.tsx        # Çok satırlı input
│   │       └── index.ts            # Export barrel
│   │
│   ├── pages/                       # Sayfa componentleri
│   │   ├── Inbox.tsx               # Dashboard & Gelen Kutusu
│   │   ├── AgentEditor.tsx         # Ajan Beyni & Prompt Editörü
│   │   └── WidgetConfig.tsx        # Web Chatbot Konfigüratörü
│   │
│   ├── services/
│   │   └── api.ts                  # API servis katmanı
│   │
│   ├── types/
│   │   └── index.ts                # TypeScript tip tanımları
│   │
│   ├── utils/
│   │   └── format.ts               # Yardımcı fonksiyonlar
│   │
│   ├── App.tsx                      # Ana uygulama router
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global stiller & Tailwind
│
├── .env                             # Environment variables (gitignore'da)
├── .gitignore                       # Git ignore kuralları
├── DEPLOYMENT.md                    # Deployment rehberi
├── README.md                        # Proje dokümantasyonu
├── PROJECT_STRUCTURE.md             # Bu dosya
│
├── eslint.config.js                 # ESLint yapılandırması
├── index.html                       # HTML template
├── package.json                     # NPM bağımlılıkları
├── package-lock.json                # NPM lock file
├── postcss.config.js                # PostCSS yapılandırması
├── tailwind.config.js               # Tailwind yapılandırması
├── tsconfig.json                    # TypeScript ana config
├── tsconfig.app.json                # TypeScript app config
├── tsconfig.node.json               # TypeScript node config
└── vite.config.ts                   # Vite yapılandırması
```

## 🎨 Component Hiyerarşisi

```
App (Router)
└── BrowserRouter (basename="/admin")
    └── Routes
        ├── /inbox → Inbox
        │   └── Layout
        │       ├── Sidebar (Navigasyon)
        │       ├── Header (Üst bar)
        │       └── Content
        │           ├── StatCard × 3 (İstatistikler)
        │           └── Card (Chat Tablosu)
        │
        ├── /agent-editor → AgentEditor
        │   └── Layout
        │       ├── Sidebar
        │       ├── Header
        │       └── Content
        │           └── Card
        │               ├── Select (Model seçimi)
        │               ├── Textarea (Prompt)
        │               ├── Slider (Temperature)
        │               └── Button (Kaydet)
        │
        └── /widget-config → WidgetConfig
            └── Layout
                ├── Sidebar
                ├── Header
                └── Content (Grid 2 sütun)
                    ├── Card (Ayarlar)
                    │   ├── Input × 2
                    │   ├── Color Picker
                    │   ├── Textarea
                    │   └── Button
                    └── Card (Canlı Önizleme)
```

## 🔄 Data Flow

```
Page Component
    ↓
useEffect / Event Handler
    ↓
api.ts (Service Layer)
    ↓
fetch(WEBHOOK_URL)
    ↓
N8N Webhook
    ↓
Response
    ↓
setState
    ↓
Re-render
```

## 🎯 Stil Yapısı

### Tailwind Utility Classes

```css
.glass-card          → bg-white/5 backdrop-blur-md border border-white/10 rounded-xl
.glass-header        → bg-white/5 backdrop-blur-md border-b border-white/10
.gradient-primary    → bg-gradient-to-r from-electric-blue to-neon-purple
.hover-glow          → transition-all duration-300 hover:shadow-lg hover:shadow-electric-blue/20
```

### Custom Colors

```javascript
// tailwind.config.js
colors: {
  'electric-blue': '#3b82f6',
  'neon-purple': '#8b5cf6',
}
```

## 🧩 Component Props

### Layout Components

**Layout:**
```typescript
interface LayoutProps {
  children: ReactNode
  title: string
  description?: string
}
```

**Header:**
```typescript
interface HeaderProps {
  title: string
  description?: string
}
```

### UI Components

**Button:**
```typescript
interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}
```

**Card:**
```typescript
interface CardProps {
  title?: string
  description?: string
  children: ReactNode
  actions?: ReactNode
  className?: string
}
```

**StatCard:**
```typescript
interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
}
```

## 🔌 API Endpoints

### GET Endpoints

```typescript
// Dashboard istatistikleri
GET ${WEBHOOK_URL}/stats
→ Returns: Stats { totalConversations, activeUsers, tokenConsumption }

// Chat logları
GET ${WEBHOOK_URL}/get-logs
→ Returns: ChatLog[] { id, platform, userId, lastMessage, aiResponse, timestamp }
```

### POST Endpoints

```typescript
// Ajan konfigürasyonu
POST ${WEBHOOK_URL}/update-prompt
Body: AgentConfig { model, systemPrompt, temperature }
→ Returns: { success: boolean }

// Widget ayarları
POST ${WEBHOOK_URL}/update-widget
Body: WidgetConfig { botName, primaryColor, welcomeMessage, logoUrl }
→ Returns: { success: boolean }
```

## 🛠️ Geliştirme Komutları

```bash
npm run dev        # Geliştirme sunucusu (localhost:5173)
npm run build      # Production build
npm run preview    # Build önizleme
npm run lint       # ESLint kontrolü
```

## 📦 Bağımlılıklar

### Production Dependencies
- `react` ^19.2.0
- `react-dom` ^19.2.0
- `react-router-dom` ^7.9.6
- `lucide-react` ^0.554.0
- `react-hot-toast` ^2.6.0
- `@fontsource/inter` ^5.2.8

### Development Dependencies
- `vite` ^7.2.2
- `typescript` ~5.9.3
- `tailwindcss` ^3.4.18
- `@vitejs/plugin-react` ^5.1.0
- `eslint` ^9.39.1

## 🎨 Design System

### Spacing
- Card Padding: `p-6` (24px)
- Gap Between Elements: `gap-6` (24px)
- Grid Gaps: `gap-6` (24px)

### Typography
- Heading 1: `text-2xl font-bold` (24px)
- Heading 2: `text-lg font-semibold` (18px)
- Body Text: `text-base` (16px)
- Small Text: `text-sm` (14px)
- Micro Text: `text-xs` (12px)

### Border Radius
- Cards: `rounded-xl` (12px)
- Buttons: `rounded-lg` (8px)
- Inputs: `rounded-lg` (8px)
- Images: `rounded-2xl` (16px)

### Shadows
- Cards: `shadow-lg shadow-black/20`
- Hover: `hover:shadow-lg hover:shadow-electric-blue/20`

## 🔒 Güvenlik Notları

1. `.env` dosyası Git'e commit edilmemeli (`.gitignore`'da)
2. API keys production'da environment variables olarak yönetilmeli
3. CORS ayarları backend'de yapılandırılmalı
4. HTTPS kullanılmalı (SSL sertifikası)

## 📈 Performans

- **Bundle Size:** ~260KB (gzipped: ~84KB)
- **First Paint:** < 1s
- **Time to Interactive:** < 2s
- **Lazy Loading:** React.lazy kullanılabilir (opsiyonel)
- **Code Splitting:** Vite otomatik yapar

---

**Geliştirici:** Frontend Mimarı & UI/UX Uzmanı  
**Versiyon:** 1.0.0  
**Son Güncelleme:** 2024
