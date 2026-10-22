# Türkiye Maarif Vakfı Kütüphanesi — Web Sitesi

`kutuphane.turkiyemaarif.org` için yeni site. Eski Laravel 5.6 (PHP) sürümünün yerine geçer.

**Teknoloji:** Next.js 15 (React, TypeScript) · Tailwind CSS · PostgreSQL + Prisma · Tiptap editör

## Neler var

| Bölüm | Adres |
| --- | --- |
| Anasayfa: Koha katalog arama (basit/gelişmiş), duyurular, öne çıkanlar, çok okunanlar, son eklenenler | `/` |
| Hakkımızda, Kütüphane Kuralları, Kütüphane Kataloğu, Açık Erişim, Hizmet Detayları | `/hakkimizda` … |
| Haberler ve Duyurular (liste + detay) | `/haberler-duyurular` |
| Maarif Yayınları (liste + detay, PDF) | `/maarif-yayinlari` |
| Satın Alma Önerisi formu (e-posta ile gelir) | `/satin-alma-onerisi` |
| Kütüphanelerimiz (107 kütüphane, ülkelere göre) | `/dunyada-maarif` |
| İletişim | `/iletisim` |
| Yönetim paneli | `/admin` |

Yönetim panelinden içerik (haber, yayın, kitap) eklenir/düzenlenir/silinir, görsel ve PDF yüklenir,
sabit sayfalar düzenlenir ve yönetici hesapları yönetilir. Eski `.php` adresleri yeni sayfalara yönlendirilir.

## Geliştirme

```bash
cp .env.example .env          # DATABASE_URL ve SESSION_SECRET'i doldurun
pnpm install
pnpm db:migrate               # tabloları oluşturur
ADMIN_EMAIL=siz@ornek.org ADMIN_PASSWORD='en-az-10-karakter' ADMIN_NAME='Ad Soyad' pnpm db:seed
pnpm dev                      # http://localhost:3000
```

Kontroller: `pnpm lint`, `pnpm typecheck`, `pnpm build`.

Geliştirmede SMTP ayarlanmamışsa satın alma önerileri e-posta yerine konsola yazılır.

## Eski siteden veri aktarma

Eski MySQL veritabanındaki `icerik` ve `users` tablolarını, yüklenen görsel ve PDF'leri aktarır.
Eski yönetici şifreleri aynen çalışmaya devam eder. Betik tekrar çalıştırılabilir.

```bash
LEGACY_DATABASE_URL="mysql://kullanici:sifre@sunucu:3306/veritabani" \
LEGACY_PUBLIC_DIR="/eski/proje/MaarifL/public" \
pnpm import:legacy
```

### Veritabanı yedeği yoksa: yayındaki eski siteden

Sabit sayfaları, haberleri (görselleriyle) ve yayınları (PDF'leriyle) eski sitenin sayfalarından okur:

```bash
pnpm import:site     # LEGACY_SITE_URL, varsayılan https://kutuphane.turkiyemaarif.org
```

### Katalogdan kitap ekleme

Koha kaydındaki ad, yazar ve kapağı alıp anasayfa bölümlerine ekler (bağlantı katalog kaydına gider):

```bash
pnpm import:koha --bolum POPULAR 7383 7377 7375
pnpm import:koha --bolum FEATURED 8042
```

## Yayına alma (Docker)

```bash
cp .env.example .env    # SESSION_SECRET, SMTP_*, ve POSTGRES_PASSWORD=... ekleyin
docker compose up -d --build
```

İlk yönetici: eski siteden aktarım yapıldıysa eski hesaplar geçerlidir. Yoksa geliştirme
makinesinden `DATABASE_URL` sunucudaki veritabanını gösterecek şekilde `pnpm db:seed` çalıştırın.

Site 3000 portunda açılır; önüne Nginx/Caddy gibi bir ters vekil (HTTPS) konmalıdır.
Yüklenen dosyalar `uploads` biriminde, veritabanı `db-data` biriminde durur; ikisi de yedeklenmelidir.
