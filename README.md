# Video Crop App

Bu proje, Expo kullanılarak geliştirilmiş bir React Native uygulamasıdır. Uygulama, kullanıcıların galeriden video seçip, videodan **5 saniyelik bir segment** kırparak bu kırpılmış videolara **isim ve açıklama** eklemesine ve kaydedilen videoları listelemesine olanak tanır.

---

## Özellikler

- **Video Seçme:** Kullanıcı galeriden video seçebilir.
- **Video Kırpma:** Seçilen videodan 5 saniyelik segment belirlenebilir.
- **Metadata Ekleme:** Kırpılan videoya isim ve açıklama eklenir.
- **Video Listesi:** Kırpılan videolar modern bir arayüzde listelenir.
- **Video Detay & Düzenleme:** Listedeki bir videoya tıklayarak detayına gider, düzenleme ve silme işlemleri yapılabilir.
- **Animasyonlar:** Reanimated ile video kartlarında fade-in ve slide-up animasyonları.

---

## Kurulum

1. **Projeyi İndirin veya Klonlayın:**

   ```bash
   git clone <repo-url>
   cd video-crop-app
   ```

2. **Bağımlılıkları Yükleyin:**

   ```bash
   npm install
   ```
   veya
   ```bash
   yarn install
   ```

3. **Uygulamayı Başlatın:**

   ```bash
   npx expo start
   ```
   Komutu çalıştırdıktan sonra, Expo geliştirme arayüzü açılır.  
   Android Emülatörü, iOS Simülatörü veya **Expo Go** ile uygulamayı test edebilirsiniz.

   Ayrıca, github releases sekmesinden android development build'ni indirip android emülatöre kurarak, sonrasında npx expo -> open android ile projeyi başlatabilirsiniz.

---

## Dosya Yapısı

- **app/**  
  Uygulama ekranları ve Expo Router ile dosya tabanlı yönlendirme dosyaları.

- **components/**  
  - `VideoItem.tsx`: Kırpılan videonun kart arayüzü (düzenleme ve silme butonları).
  - `CropModalContent.tsx`: Video kırpma modalı (segment seçimi).
  - `MetadataModalContent.tsx`: Kırpılan video için metadata formu (isim ve açıklama).

- **store/**  
  Global state yönetimi (Zustand) için store dosyaları.

- **hooks/**  
  Özel hook'lar (ör. `useCropVideo`).

- **assets/**  
  Görseller, videolar ve diğer medya dosyaları.

---

## Kullanım Talimatları

1. **Video Kırpma:**
   - Ana ekrandaki **"Crop Video"** butonuna basarak kırpma modalını açın.
   - Galeriden bir video seçin.
   - 5 saniyelik segmenti slider yardımıyla belirleyip, **"Next"** butonuna basın.

2. **Metadata Ekleme:**
   - Kırpılan videoya **isim** ve **açıklama** girin.
   - "Crop Video" butonuna basarak videoyu kaydedin.
   - Kırpılan video, ana ekranda listede görüntülenir.

3. **Video Düzenleme & Silme:**
   - Listedeki bir videoya dokunarak detay ekranına gidin.
   - Videonun ismini, açıklamasını güncelleyebilir veya videoyu silebilirsiniz.
   - 

---
```
