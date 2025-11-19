# AIO Admin Dashboard

AIO ekibi için hazırlanmış, "Deep Space" temalı modern yönetim paneli ve ziyaretçileri karşılayan landing sayfası. Proje; React 19, Vite, TypeScript ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

- ✨ **Landing Page & Chatbot**: `/` rotasında yer alan karşılama ekranı, sağ alttaki canlı chatbot ile Gemini destekli sohbet deneyimi sunar. Sohbet geçmişi tarayıcıda saklanır.
- 📊 **Dashboard & Gelen Kutusu** (`/admin/inbox`): Gerçek zamanlı metrikler, skeleton yükleyiciler ve canlı sohbet log tablosu.
- 🧠 **Ajan Beyni Editörü** (`/admin/agent-editor`): Model seçimi, sistem promptu ve sıcaklık ayarları.
- 💬 **Widget Konfigüratörü** (`/admin/widget-config`): Chat widget renkleri, mesajları ve logoları için canlı önizleme.
- ⚙️ **Tek API Servisi**: Tüm istekler `src/services/api.ts` üzerinden yönetilir, hata durumlarında kullanıcı nazikçe bilgilendirilir.

## 🎨 Tasarım

- **Tema**: Deep Space (Slate-950 arka plan, cam efekti kartlar)
- **Renkler**: Electric Blue (#3b82f6), Neon Purple (#8b5cf6), Slate-200/300 metinler
- **Tipografi**: Inter
- **Özel Utility'ler**: `glass-card`, `glass-header`, `gradient-primary`, `hover-glow`, `skeleton*` sınıfları

## 📂 Proje Yapısı

```
src/
├── components/
│   ├── Chatbot.tsx          # Landing sayfasındaki chatbot widget'ı
│   ├── layout/              # Layout, Sidebar, Header
│   └── ui/                  # Button, Card, Input, Skeleton vb.
├── pages/
│   ├── Landing.tsx          # Ana sayfa
│   ├── Inbox.tsx            # Dashboard & gelen kutusu
│   ├── AgentEditor.tsx      # AI konfigürasyonu
│   └── WidgetConfig.tsx     # Chat widget ayarları
├── services/api.ts          # Tüm API çağrıları
├── types/                   # Tip tanımları
├── utils/format.ts          # Yardımcı fonksiyonlar
├── App.tsx                  # Router tanımları
└── main.tsx / index.css     # Entry ve global stiller
```

## 🛠️ Kurulum

```bash
npm install        # Bağımlılıkları kur
npm run dev        # Geliştirme sunucusu
npm run build      # Production build
npm run preview    # Build önizleme
```

## 🌐 Deploy Ayarları

- **Vite Base Path**: `/`
- **Router**: `/` (Landing) ve `/admin/*` (panel)
- **Build**: Tek paket içinde landing + admin

## 🔗 API Entegrasyonu

```env
VITE_N8N_WEBHOOK_URL=https://n8n.aio.web.tr/webhook/admin
```

| Amaç | Metot & Endpoint |
| --- | --- |
| Dashboard istatistikleri | `GET ${VITE_N8N_WEBHOOK_URL}/stats` |
| Chat logları | `GET ${VITE_N8N_WEBHOOK_URL}/get-logs` |
| Ajan güncelleme | `POST ${VITE_N8N_WEBHOOK_URL}/update-prompt` |
| Widget güncelleme | `POST ${VITE_N8N_WEBHOOK_URL}/update-widget` |
| Landing chatbot | `POST https://n8n.aio.web.tr/webhook/chat` (Body: `{ "message": "..." }` ) |

Başarısız isteklerde `react-hot-toast` ile kullanıcı bilgilendirilir.

## 📱 Responsive & UX Notları

- Tüm bileşenler mobil uyumlu grid yapısını kullanır.
- Stat kartları ve tablolarda skeleton yükleyiciler bulunur.
- Butonlar hover'da glow/scale efekti ve odak durumlarında mavi ring gösterir.
- Chatbot popup'ı typing indicator, localStorage kalıcılığı ve temizleme fonksiyonuna sahiptir.

## 🔐 Güvenlik

- API URL'leri `.env` dosyasında tutulur ve `.gitignore` ile korunur.
- TypeScript strict modu ve reusable komponent mimarisi ile güvenilir kod yapısı.

Proje AIO ekibine özel olarak hazırlanmıştır.
