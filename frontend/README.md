# Alıştırma Projesi - Frontend

Bu proje React ve TypeScript kullanılarak geliştirilmiş bir ev otomasyon uygulamasıdır.

## 🏗️ Proje Yapısı

```
frontend/
├── public/                 # Statik dosyalar
├── src/
│   ├── components/         # React bileşenleri
│   │   ├── Header.tsx
│   │   ├── LivingRoom.tsx
│   │   ├── Kitchen.tsx
│   │   ├── Bedroom.tsx
│   │   ├── Basement.tsx
│   │   ├── ParentRoom.tsx
│   │   ├── ChildRoom.tsx
│   │   └── Counter.tsx
│   ├── hooks/             # Custom React hooks
│   │   └── lightControl.tsx
│   ├── pages/             # Sayfa bileşenleri (gelecek için)
│   ├── services/          # API servisleri (gelecek için)
│   ├── types/             # TypeScript tip tanımları (gelecek için)
│   ├── utils/             # Yardımcı fonksiyonlar (gelecek için)
│   ├── App.tsx            # Ana uygulama bileşeni
│   ├── App.css            # Ana stil dosyası
│   ├── index.tsx          # Uygulama giriş noktası
│   └── index.css          # Global stiller
├── package.json           # Bağımlılıklar ve scriptler
├── tsconfig.json          # TypeScript konfigürasyonu
├── tailwind.config.js     # Tailwind CSS konfigürasyonu
└── postcss.config.js      # PostCSS konfigürasyonu
```

## 🚀 Özellikler

- **Giriş Sistemi**: Kullanıcı adı ile giriş yapma
- **Rol Tabanlı Erişim**: Admin, User ve Guest rolleri
- **Oda Kontrolü**: Farklı odaların aydınlatma kontrolü
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Modern UI**: Tailwind CSS ile modern arayüz

## 🛠️ Teknolojiler

- **React 19.1.0** - UI kütüphanesi
- **TypeScript 4.9.5** - Tip güvenliği
- **Tailwind CSS 3.4.17** - CSS framework
- **React Router DOM 7.6.3** - Sayfa yönlendirme
- **Axios 1.10.0** - HTTP istekleri

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm start

# Production build oluştur
npm run build

# Testleri çalıştır
npm test
```

## 👥 Kullanıcı Rolleri

### Admin
- Tüm odalara erişim
- Çocuk odası görüntüleme
- Ebeveyn odası görüntüleme
- Bodrum erişimi

### User
- Temel odalara erişim
- Ebeveyn odası görüntüleme
- Bodrum erişimi

### Guest
- Sadece temel odalara erişim
- Oturum açmadan görüntüleme

## 🎨 Bileşenler

### Oda Bileşenleri
- **LivingRoom**: Oturma odası kontrolü
- **Kitchen**: Mutfak kontrolü
- **Bedroom**: Yatak odası kontrolü
- **Basement**: Bodrum kontrolü
- **ParentRoom**: Ebeveyn odası kontrolü
- **ChildRoom**: Çocuk odası kontrolü

### Yardımcı Bileşenler
- **Header**: Sayfa başlığı
- **Counter**: Sayaç bileşeni
- **LoginStatus**: Giriş durumu gösterimi

## 🔧 Geliştirme

### Yeni Bileşen Ekleme
1. `src/components/` klasörüne yeni bileşen dosyası ekle
2. TypeScript tip tanımlarını `src/types/` klasörüne ekle
3. Gerekirse API servislerini `src/services/` klasörüne ekle

### Stil Değişiklikleri
- Global stiller: `src/index.css`
- Bileşen stilleri: `src/App.css`
- Tailwind konfigürasyonu: `tailwind.config.js`

## 📝 Notlar

- Proje TypeScript ile yazılmıştır
- Tailwind CSS kullanılmaktadır
- Responsive tasarım prensipleri uygulanmıştır
- Rol tabanlı erişim kontrolü mevcuttur
