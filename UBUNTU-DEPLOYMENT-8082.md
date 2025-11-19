# 🚀 AIO Admin Dashboard - Ubuntu Deployment Guide (Port 8082)

Bu dokümantasyon, AIO Admin Dashboard'u Ubuntu sunucusuna 8082 portunda yayımlamak için A'dan Z'ye tüm adımları içerir.

## 📋 Ön Gereksinimler

- Ubuntu 20.04+ sunucu
- Root veya sudo yetkisi
- Domain: www.aio.web.tr veya aio.web.tr
- Port 8082 açık olmalı

---

## 1️⃣ Sunucu Güncellemeleri

```bash
# Sistem paketlerini güncelle
sudo apt update && sudo apt upgrade -y

# Temel araçları yükle
sudo apt install -y curl wget git build-essential
```

---

## 2️⃣ Node.js Kurulumu

```bash
# NodeSource repository ekle (Node.js 20.x)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js ve npm'i yükle
sudo apt install -y nodejs

# Kurulumu doğrula
node --version  # v20.x.x olmalı
npm --version   # 10.x.x olmalı
```

---

## 3️⃣ Proje Dosyalarını Sunucuya Aktarma

### Seçenek A: Git ile

```bash
# Proje dizinine git
cd /var/www

# Repository'yi klonla (eğer Git kullanıyorsanız)
sudo git clone <REPOSITORY_URL> aio-admin

# Dizine gir
cd aio-admin

# Branch'i kontrol et (gerekirse)
sudo git checkout main
```

### Seçenek B: SCP/SFTP ile

```bash
# Yerel makinenizden (kendi bilgisayarınızdan)
scp -r /path/to/aio-admin-dashboard root@sunucu-ip:/var/www/aio-admin

# VEYA SFTP client (FileZilla, WinSCP) kullanabilirsiniz
# Dosyaları /var/www/aio-admin dizinine yükleyin
```

---

## 4️⃣ Proje Bağımlılıklarını Yükleme

```bash
# Proje dizinine git
cd /var/www/aio-admin

# Bağımlılıkları yükle
sudo npm install

# Kurulum tamamlandığında node_modules klasörü oluşacak
```

---

## 5️⃣ Environment Variables Ayarlama

```bash
# .env dosyası oluştur
sudo nano /var/www/aio-admin/.env

# Aşağıdaki içeriği yapıştır:
VITE_N8N_WEBHOOK_URL=https://n8n.aio.web.tr/webhook-test/chat

# Kaydet ve çık (Ctrl+O, Enter, Ctrl+X)
```

---

## 6️⃣ Production Build

```bash
# Proje dizininde build komutu çalıştır
cd /var/www/aio-admin
sudo npm run build

# Build başarılı olursa 'dist' klasörü oluşacak
ls -la dist/  # Dosyaları kontrol et
```

---

## 7️⃣ PM2 ile Production Server Kurulumu

PM2, Node.js uygulamalarını production'da çalıştırmak için kullanılan process manager'dır.

```bash
# PM2'yi global olarak yükle
sudo npm install -g pm2

# Serve package'i yükle (static file serving için)
sudo npm install -g serve

# PM2 ile uygulamayı 8082 portunda başlat
cd /var/www/aio-admin
pm2 serve dist 8082 --name aio-admin --spa

# PM2 durumunu kontrol et
pm2 status

# PM2'yi sistem başlangıcında otomatik başlatmak için
pm2 startup
# Komutu çalıştırınca çıkan komutu kopyalayıp çalıştırın

pm2 save
```

### PM2 Komutları (Yönetim)

```bash
# Uygulamayı yeniden başlat
pm2 restart aio-admin

# Uygulamayı durdur
pm2 stop aio-admin

# Logları izle
pm2 logs aio-admin

# Uygulamayı kaldır
pm2 delete aio-admin

# Tüm PM2 uygulamalarını listele
pm2 list
```

---

## 8️⃣ Nginx Kurulumu ve Konfigürasyonu

```bash
# Nginx'i yükle
sudo apt install -y nginx

# Nginx'in çalıştığını doğrula
sudo systemctl status nginx

# Nginx'i başlat ve aktif et
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Nginx Konfigürasyonu

```bash
# Nginx konfigürasyon dosyası oluştur
sudo nano /etc/nginx/sites-available/aio-admin

# Aşağıdaki konfigürasyonu yapıştır:
```

```nginx
server {
    listen 80;
    server_name www.aio.web.tr aio.web.tr;

    # Admin Dashboard (Port 8082'den proxy)
    location /admin {
        proxy_pass http://localhost:8082/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets için cache
    location ~* /admin/.*\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:8082;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # N8N Webhook Proxy (Opsiyonel - CORS sorunları için)
    location /webhook-test/ {
        proxy_pass https://n8n.aio.web.tr/webhook-test/;
        proxy_set_header Host n8n.aio.web.tr;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_server_name on;
    }
}
```

```bash
# Konfigürasyonu kaydet ve çık (Ctrl+O, Enter, Ctrl+X)

# Symbolic link oluştur
sudo ln -s /etc/nginx/sites-available/aio-admin /etc/nginx/sites-enabled/

# Default site'ı kaldır (opsiyonel)
sudo rm /etc/nginx/sites-enabled/default

# Nginx konfigürasyonunu test et
sudo nginx -t

# Nginx'i yeniden yükle
sudo systemctl reload nginx
```

---

## 9️⃣ SSL Sertifikası (Let's Encrypt)

```bash
# Certbot'u yükle
sudo apt install -y certbot python3-certbot-nginx

# SSL sertifikası al (domain'inizle değiştirin)
sudo certbot --nginx -d www.aio.web.tr -d aio.web.tr

# Sertifika otomatik yenilenecek, test için:
sudo certbot renew --dry-run
```

Certbot otomatik olarak Nginx konfigürasyonunu güncelleyecek ve HTTPS'i aktif edecektir.

---

## 🔟 Güvenlik Duvarı (UFW) Ayarları

```bash
# UFW'yi yükle (zaten yüklü olabilir)
sudo apt install -y ufw

# Port 22 (SSH) açık olmalı
sudo ufw allow 22/tcp

# HTTP ve HTTPS portlarını aç
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Port 8082'yi localhost'a kısıtla (dışarıdan erişim engellensin)
# Bu adım opsiyonel - Nginx üzerinden proxy yapıyorsak dışarıya açmaya gerek yok

# UFW'yi aktif et
sudo ufw enable

# Durumu kontrol et
sudo ufw status
```

---

## 1️⃣1️⃣ Deployment Script Oluşturma (Otomatik Deploy)

```bash
# Deploy script oluştur
sudo nano /var/www/aio-admin/deploy.sh

# Aşağıdaki içeriği yapıştır:
```

```bash
#!/bin/bash

# AIO Admin Dashboard Deployment Script

echo "🚀 Starting deployment..."

# Proje dizinine git
cd /var/www/aio-admin

# Git'ten son değişiklikleri çek (opsiyonel)
# sudo git pull origin main

# Bağımlılıkları güncelle
echo "📦 Installing dependencies..."
sudo npm install

# Production build
echo "🔨 Building project..."
sudo npm run build

# PM2'yi yeniden başlat
echo "♻️ Restarting PM2..."
pm2 restart aio-admin

# Nginx'i reload et
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"
echo "🌐 Site is live at: https://www.aio.web.tr/admin"
```

```bash
# Script'i kaydet ve çık (Ctrl+O, Enter, Ctrl+X)

# Çalıştırma izni ver
sudo chmod +x /var/www/aio-admin/deploy.sh

# Script'i çalıştır
sudo /var/www/aio-admin/deploy.sh
```

---

## 1️⃣2️⃣ Test ve Doğrulama

```bash
# Uygulama 8082 portunda çalışıyor mu kontrol et
curl http://localhost:8082/admin

# PM2 durumu
pm2 status

# Nginx durumu
sudo systemctl status nginx

# Nginx loglarını kontrol et
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PM2 loglarını izle
pm2 logs aio-admin
```

### Tarayıcıda Test:

1. **HTTP Test:** http://www.aio.web.tr/admin (HTTPS'e yönlendirilecek)
2. **HTTPS Test:** https://www.aio.web.tr/admin
3. **Sayfalar:**
   - Dashboard: https://www.aio.web.tr/admin/inbox
   - Ajan Editörü: https://www.aio.web.tr/admin/agent-editor
   - Widget Config: https://www.aio.web.tr/admin/widget-config

---

## 🔍 Troubleshooting (Sorun Giderme)

### Sorun 1: Port 8082'de uygulama çalışmıyor

```bash
# PM2 durumunu kontrol et
pm2 status

# PM2 loglarını kontrol et
pm2 logs aio-admin

# PM2'yi yeniden başlat
pm2 restart aio-admin

# 8082 portunu kontrol et
sudo lsof -i :8082
```

### Sorun 2: Nginx 502 Bad Gateway

```bash
# Nginx loglarını kontrol et
sudo tail -f /var/log/nginx/error.log

# PM2 uygulamasının çalıştığından emin ol
pm2 status

# Nginx konfigürasyonunu test et
sudo nginx -t

# Nginx'i yeniden başlat
sudo systemctl restart nginx
```

### Sorun 3: SSL Sertifikası Hatası

```bash
# Certbot durumunu kontrol et
sudo certbot certificates

# Sertifikayı yenile
sudo certbot renew

# Nginx'i yeniden yükle
sudo systemctl reload nginx
```

### Sorun 4: API Bağlantı Hatası

```bash
# .env dosyasını kontrol et
cat /var/www/aio-admin/.env

# Webhook URL'in doğru olduğundan emin ol
# VITE_N8N_WEBHOOK_URL=https://n8n.aio.web.tr/webhook-test/chat

# Build'i yeniden yap
cd /var/www/aio-admin
sudo npm run build
pm2 restart aio-admin
```

### Sorun 5: Sayfalar 404 Veriyor

```bash
# PM2'de --spa flag'i var mı kontrol et
pm2 describe aio-admin

# Yoksa yeniden başlat
pm2 delete aio-admin
pm2 serve dist 8082 --name aio-admin --spa
pm2 save
```

---

## 📊 Performans ve Monitoring

```bash
# PM2 monitoring dashboard
pm2 monit

# Sunucu kaynaklarını izle
htop  # veya top

# Disk kullanımı
df -h

# Memory kullanımı
free -m

# Nginx erişim logları
sudo tail -f /var/log/nginx/access.log

# PM2 logs
pm2 logs aio-admin --lines 100
```

---

## 🔄 Güncelleme İşlemleri (Update)

Yeni bir versiyon deploy etmek için:

```bash
# 1. Proje dizinine git
cd /var/www/aio-admin

# 2. Git'ten çek (eğer kullanıyorsanız)
sudo git pull origin main

# 3. Veya dosyaları manuel yükle (SCP/SFTP)

# 4. Deploy script'i çalıştır
sudo ./deploy.sh

# Manuel adımlar:
# sudo npm install
# sudo npm run build
# pm2 restart aio-admin
# sudo systemctl reload nginx
```

---

## 🗑️ Uygulama Silme (Uninstall)

```bash
# PM2'den kaldır
pm2 delete aio-admin
pm2 save

# Nginx konfigürasyonunu kaldır
sudo rm /etc/nginx/sites-enabled/aio-admin
sudo rm /etc/nginx/sites-available/aio-admin
sudo systemctl reload nginx

# Proje dosyalarını sil
sudo rm -rf /var/www/aio-admin

# SSL sertifikasını iptal et (opsiyonel)
sudo certbot delete --cert-name www.aio.web.tr
```

---

## 📞 Destek ve İletişim

- **Dokümantasyon:** README.md, PROJECT_STRUCTURE.md
- **Logs:** `/var/log/nginx/` ve `pm2 logs`
- **PM2 Dashboard:** `pm2 monit`

---

## ✅ Checklist - Deployment Tamamlandı mı?

- [ ] Node.js kuruldu (v20+)
- [ ] PM2 kuruldu ve uygulamaya 8082 portunda çalışıyor
- [ ] Nginx kuruldu ve yapılandırıldı
- [ ] SSL sertifikası alındı (Let's Encrypt)
- [ ] UFW güvenlik duvarı yapılandırıldı
- [ ] .env dosyası oluşturuldu ve webhook URL ayarlandı
- [ ] Production build başarılı (`npm run build`)
- [ ] PM2 otomatik başlatma aktif (`pm2 startup`, `pm2 save`)
- [ ] Deploy script oluşturuldu ve test edildi
- [ ] Tarayıcıda tüm sayfalar test edildi
- [ ] API endpoint'leri çalışıyor
- [ ] Responsive tasarım mobilde test edildi
- [ ] SSL sertifikası tarayıcıda geçerli
- [ ] Nginx ve PM2 logları temiz

---

**🎉 Deployment Tamamlandı!**

Siteniz artık canlıda: **https://www.aio.web.tr/admin**

**Son Güncelleme:** 2024  
**Port:** 8082  
**Webhook URL:** https://n8n.aio.web.tr/webhook-test/chat
