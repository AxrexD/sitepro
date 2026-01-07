# Vercel'e Deploy Etme Rehberi

## Yöntem 1: Vercel Web Arayüzü (Önerilen)

1. **GitHub'a Push Edin**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
   git push -u origin main
   ```

2. **Vercel'e Giriş Yapın**
   - [vercel.com](https://vercel.com) adresine gidin
   - GitHub hesabınızla giriş yapın

3. **Yeni Proje Oluşturun**
   - "Add New..." → "Project" butonuna tıklayın
   - GitHub repository'nizi seçin
   - Vercel otomatik olarak Next.js projesini algılayacak

4. **Deploy Ayarları**
   - Framework Preset: **Next.js** (otomatik algılanır)
   - Root Directory: `./` (varsayılan)
   - Build Command: `npm run build` (otomatik)
   - Output Directory: `.next` (otomatik)
   - Install Command: `npm install` (otomatik)

5. **Deploy Butonuna Tıklayın**
   - Vercel otomatik olarak build edip deploy edecek
   - Deploy tamamlandığında size bir URL verecek

## Yöntem 2: Vercel CLI

1. **Vercel CLI'yi Yükleyin**
   ```bash
   npm i -g vercel
   ```

2. **Vercel'e Giriş Yapın**
   ```bash
   vercel login
   ```

3. **Projeyi Deploy Edin**
   ```bash
   vercel
   ```
   
   İlk deploy için sorular soracak:
   - Set up and deploy? → **Y**
   - Which scope? → Hesabınızı seçin
   - Link to existing project? → **N** (ilk kez)
   - Project name? → Proje adınızı girin
   - Directory? → **./** (Enter)
   - Override settings? → **N**

4. **Production Deploy**
   ```bash
   vercel --prod
   ```

## Önemli Notlar

### Environment Variables (Gerekirse)
Eğer API key'ler veya secret'lar varsa:
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Gerekli değişkenleri ekleyin

### Build Ayarları
Vercel otomatik olarak Next.js'i algılar, ancak manuel ayar gerekirse:
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Dosya Yapısı
Şu dosyaların olduğundan emin olun:
- ✅ `package.json`
- ✅ `next.config.js`
- ✅ `tsconfig.json`
- ✅ `app/` klasörü
- ✅ `public/` klasörü (video ve müzik dosyaları için)

### Public Klasörü
`public/` klasöründeki dosyalar otomatik olarak deploy edilir:
- `/public/1.mp4` → `https://your-site.vercel.app/1.mp4`
- `/public/y.mp3` → `https://your-site.vercel.app/y.mp3`

## Sorun Giderme

### Build Hatası
```bash
# Lokal olarak test edin
npm run build
```

### TypeScript Hataları
```bash
# Type check yapın
npx tsc --noEmit
```

### Deploy Sonrası Kontrol
1. Vercel Dashboard'da deploy loglarını kontrol edin
2. Build başarılı mı kontrol edin
3. Runtime hataları varsa Functions loglarını kontrol edin

## Otomatik Deploy
GitHub'a her push yaptığınızda Vercel otomatik olarak yeni bir deploy yapacak!

