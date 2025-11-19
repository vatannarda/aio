# AIO Admin Dashboard

Modern, kurumsal ve fütüristik bir Yönetim Paneli (Admin Dashboard) projesi. AIO (Yapay Zeka Çoklu Platform Asistanı) için geliştirilmiştir.

## 🚀 Özellikler

### Teknolojiler
- ⚡ **Vite** - Ultra hızlı build tool
- ⚛️ **React 19** - Modern UI kütüphanesi
- 🔷 **TypeScript** - Tip güvenli geliştirme
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧭 **React Router DOM** - Routing çözümü
- 🎯 **Lucide React** - İkon kütüphanesi
- 🔔 **React Hot Toast** - Bildirim sistemi

### Sayfalar

#### 1. Dashboard & Gelen Kutusu (`/inbox`)
- **İstatistikler:** Toplam konuşma, aktif kullanıcılar, token tüketimi
- **Live Chat Table:** Tüm platform konuşmalarını görüntüleme (Web/WhatsApp)
- **Real-time Updates:** Canlı veri takibi

#### 2. Ajan Beyni & Prompt Editörü (`/agent-editor`)
- **Model Seçimi:** Gemini Pro, Gemini Flash, GPT-4o
- **Sistem Promptu:** AI kişiliğini özelleştirme
- **Temperature Slider:** Yanıt sıcaklığı ayarlama (0-1)

#### 3. Web Chatbot Konfigüratörü (`/widget-config`)
- **Bot Adı:** Widget başlığını özelleştir
- **Ana Renk:** Color picker ile renk seçimi
- **Karşılama Mesajı:** İlk mesajı ayarla
- **Logo URL:** Widget logosunu değiştir
- **Canlı Önizleme:** Değişiklikleri anlık görüntüleme

## 🎨 Tasarım

### Deep Space Enterprise Teması
- **Arka Plan:** Koyu lacivert/gri (#0f172a - slate-950)
- **Glassmorphism:** Yarı saydam kartlar ve blur efekti
- **Renkler:** 
  - Primary: Electric Blue (#3b82f6)
  - Secondary: Neon Purple (#8b5cf6)
  - Text: Slate-200
- **Font:** Inter

## 📂 Proje Yapısı

```
src/
├── components/
│   ├── layout/          # Layout bileşenleri
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── ui/              # Reusable UI bileşenleri
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Slider.tsx
│       ├── StatCard.tsx
│       └── Textarea.tsx
├── pages/               # Sayfa bileşenleri
│   ├── Inbox.tsx
│   ├── AgentEditor.tsx
│   └── WidgetConfig.tsx
├── services/            # API servisleri
│   └── api.ts
├── types/               # TypeScript tip tanımlamaları
│   └── index.ts
├── utils/               # Yardımcı fonksiyonlar
│   └── format.ts
├── App.tsx              # Ana uygulama
├── main.tsx             # Entry point
└── index.css            # Global stiller
```

## 🛠️ Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview
```

## 🌐 Deploy Ayarları

Bu uygulama `www.aio.web.tr/admin` altında çalışacak şekilde yapılandırılmıştır:

- **Vite Base Path:** `/admin/`
- **React Router Basename:** `/admin`
- **Package.json Homepage:** `/admin`

## 🔗 API Entegrasyonu

### Environment Variables

`.env` dosyasında:
```
VITE_N8N_WEBHOOK_URL=https://n8n.aio.web.tr/webhook-test/chat
```

### API Endpoints

```typescript
// Dashboard istatistikleri
GET ${VITE_N8N_WEBHOOK_URL}/stats

// Chat logları
GET ${VITE_N8N_WEBHOOK_URL}/get-logs

// Ajan konfigürasyonu güncelle
POST ${VITE_N8N_WEBHOOK_URL}/update-prompt

// Widget ayarları güncelle
POST ${VITE_N8N_WEBHOOK_URL}/update-widget
```

## 🎯 Özel CSS Utility Sınıfları

```css
.glass-card          /* Glassmorphism kart */
.glass-header        /* Glassmorphism header */
.gradient-primary    /* Blue-Purple gradient */
.hover-glow          /* Hover'da parlama efekti */
```

## 📱 Responsive Design

- Desktop-first yaklaşım
- Grid layout ile responsive kartlar
- Mobile uyumlu navigasyon

## 🔐 Güvenlik

- Environment variables ile hassas bilgi yönetimi
- `.gitignore` ile `.env` dosyası koruması
- TypeScript ile tip güvenliği

## 👨‍💻 Geliştirme Notları

### Kod Kalitesi
- Modüler yapı
- Reusable componentler
- Try/Catch ile hata yönetimi
- Toast bildirimleri ile kullanıcı geri bildirimi

### Best Practices
- TypeScript strict mode
- ESLint konfigürasyonu
- Clean code prensipleri
- Semantic HTML

## 📄 Lisans

Bu proje AIO (Elara Systems) için geliştirilmiştir.

---

**Geliştirici:** Frontend Mimarı & UI/UX Uzmanı  
**Versiyon:** 1.0.0  
**Son Güncelleme:** 2024
