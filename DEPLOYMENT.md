# AIO Admin Dashboard - Deployment Guide

## 🚀 Deployment Adımları

### 1. Build

```bash
npm run build
```

Bu komut `dist/` klasörü içinde production-ready dosyaları oluşturur.

### 2. Deploy Path Konfigürasyonu

Uygulama `www.aio.web.tr/admin` altında çalışacak şekilde yapılandırılmıştır.

#### Yapılandırma Dosyaları:

**vite.config.ts:**
```typescript
export default defineConfig({
  base: '/admin/',
  // ...
})
```

**App.tsx:**
```typescript
<BrowserRouter basename="/admin">
```

**package.json:**
```json
{
  "homepage": "/admin"
}
```

### 3. Nginx Konfigürasyonu

```nginx
server {
    server_name www.aio.web.tr aio.web.tr;

    # Admin Dashboard
    location /admin {
        alias /var/www/aio/admin/dist;
        try_files $uri $uri/ /admin/index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # N8N Webhook Proxy (Opsiyonel)
    location /webhook/ {
        proxy_pass https://n8n.aio.web.tr/webhook/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SSL Configuration
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/aio.web.tr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aio.web.tr/privkey.pem;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name www.aio.web.tr aio.web.tr;
    return 301 https://$server_name$request_uri;
}
```

### 4. Environment Variables

Production ortamında `.env` dosyasını doğru şekilde yapılandırın:

```bash
VITE_N8N_WEBHOOK_URL=https://n8n.aio.web.tr/webhook/f523ccf7-be62-40de-9d4e-115e151dc102
```

⚠️ **Güvenlik Notu:** `.env` dosyasını Git'e commit etmeyin!

### 5. Deployment Script

```bash
#!/bin/bash

# Build the project
npm run build

# Create deployment directory
mkdir -p /var/www/aio/admin

# Copy build files
cp -r dist/* /var/www/aio/admin/

# Set proper permissions
chown -R www-data:www-data /var/www/aio/admin
chmod -R 755 /var/www/aio/admin

# Reload Nginx
sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"
```

## 📦 Alternatif Deploy Yöntemleri

### Vercel

1. Vercel'e projeyi yükleyin
2. Build ayarlarını yapılandırın:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. Environment Variables ekleyin (Vercel Dashboard)

4. `vercel.json` oluşturun:

```json
{
  "rewrites": [
    {
      "source": "/admin/(.*)",
      "destination": "/admin/index.html"
    }
  ]
}
```

### Netlify

1. Netlify'a projeyi yükleyin
2. Build ayarlarını yapılandırın:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. `netlify.toml` oluşturun:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200
```

### Docker

`Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html/admin
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

`docker-compose.yml`:

```yaml
version: '3.8'

services:
  admin-dashboard:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_N8N_WEBHOOK_URL=https://n8n.aio.web.tr/webhook/f523ccf7-be62-40de-9d4e-115e151dc102
    restart: unless-stopped
```

## 🔍 Post-Deployment Checklist

- [ ] Tüm sayfalar düzgün yükleniyor mu? (`/inbox`, `/agent-editor`, `/widget-config`)
- [ ] API endpoint'leri çalışıyor mu?
- [ ] Glassmorphism efektleri doğru görünüyor mu?
- [ ] Responsive tasarım mobilde uygun mu?
- [ ] Toast bildirimleri çalışıyor mu?
- [ ] SSL sertifikası geçerli mi?
- [ ] Environment variables doğru ayarlanmış mı?

## 🐛 Troubleshooting

### Sayfa 404 Hatası

Routing sorunu yaşıyorsanız, web sunucunuzun SPA (Single Page Application) için yapılandırıldığından emin olun.

**Çözüm:** Tüm route'lar `index.html`'e yönlendirilmeli.

### API Bağlantı Hatası

```bash
# Environment variable'ı kontrol edin
echo $VITE_N8N_WEBHOOK_URL

# CORS ayarlarını kontrol edin (n8n tarafında)
```

### Stil Sorunları

```bash
# Cache'i temizleyin
npm run build -- --force

# Tailwind CSS'in düzgün build edildiğinden emin olun
```

## 📊 Performans Optimizasyonu

- Tüm static asset'ler cache'leniyor (1 yıl)
- Gzip compression aktif
- Lazy loading uygulanmış
- Code splitting otomatik (Vite)
- Bundle size optimize edilmiş (~260KB gzipped)

## 📞 Destek

Herhangi bir sorun yaşarsanız:
- README.md dosyasını kontrol edin
- Logs'ları inceleyin: `journalctl -u nginx -f`
- Browser console'u kontrol edin

---

**Son Güncelleme:** 2024  
**Versiyon:** 1.0.0
