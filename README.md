Go Live : caliskanaribayi.com

## 2026 Veri Tabanı Devir Geçiş Raporu

Bu güncelleme, muhasebe programının yıl sonu devir süreci sonrası B2B uygulamasının aktif veri tabanını yeni yıl veri tabanına yönlendirmek için yapıldı.

### Geçiş Mantığı

Önceki yapı:

- Aktif/yazma veri tabanı: `ETA_ADNAN_2025`
- Geçmiş yıl okuma veri tabanı: `ETA_ADNAN_2024`
- EDIS okuma veri tabanı: `ETA_EDIS_2025`

Yeni yapı:

- Aktif/yazma veri tabanı: `ETA_ADNAN_2026`
- Geçmiş yıl okuma veri tabanı: `ETA_ADNAN_2025`
- `ETA_ADNAN_2024` aktif uygulama akışından çıkarıldı.
- EDIS okuma veri tabanı aynı kaldı: `ETA_EDIS_2025`

Yeni sipariş kayıtları, şifre güncellemeleri, sipariş iptal/güncelleme işlemleri, kargo durum güncellemeleri ve talep güncellemeleri artık `ETA_ADNAN_2026` veri tabanına yazılır.

### Ortam Değişkenleri

Uygulamanın çalışması için ortam değişkenlerinde yeni aktif veri tabanı bağlantısı tanımlı olmalıdır:

```env
DATABASE_URL_2026="sqlserver://...;database=ETA_ADNAN_2026;..."
DATABASE_URL_2025="sqlserver://...;database=ETA_ADNAN_2025;..."
DATABASE_URL_EDIS="sqlserver://...;database=ETA_EDIS_2025;..."
```

Not: Bağlantı bilgileri hassas olduğu için gerçek kullanıcı/parola değerleri README içinde tutulmaz. Local `.env` ve Vercel environment değişkenleri ayrıca güncellenmelidir.

### Değiştirilen Dosyalar

- `lib/prisma/index.js`
  - Ana `prisma` client `DATABASE_URL_2026` kullanacak şekilde güncellendi.
  - Eski `prisma2024` client kaldırıldı.
  - Geçmiş yıl okuma için `prisma2025` client eklendi ve `DATABASE_URL_2025` kullanacak şekilde ayarlandı.
  - Log mesajları aktif/geçmiş veri tabanı adlarını gösterecek şekilde düzenlendi.

- `prisma/schema.prisma`
  - Prisma default datasource `DATABASE_URL_2025` yerine `DATABASE_URL_2026` olarak güncellendi.

- `services/serviceOperations/index.jsx`
  - Default yıl `2026` yapıldı.
  - `2025` parametresi geçmiş yıl okuma için `prisma2025` client'a yönlendirildi.
  - Birleşik okuma helper'ları artık `2026 + 2025` verisini birlikte döndürür.
  - `2024` yönlendirmesi kaldırıldı.

- `services/serviceOperations/optimizedQueries.jsx`
  - Admin sipariş listesi ve metrik sorguları `2026 + 2025` kaynaklarını okuyacak şekilde güncellendi.
  - `prisma2024` kullanımı `prisma2025` ile değiştirildi.

- `pages/api/auth/login/index.jsx`
  - Login sırasında kullanıcı araması artık aktif yıl olan `2026` veri tabanından yapılır.
  - Şifre oluşturma/güncelleme akışı zaten ana `prisma` client üzerinden çalıştığı için `ETA_ADNAN_2026` üzerine yazar.

- `pages/api/billings/index.js`
- `pages/api/detailed-billings/index.js`
- `pages/api/fatfis/index.js`
- `pages/api/table-cart/index.js`
  - Yıl parametresi verilmediğinde default okuma yılı `2026` olarak güncellendi.

- `pages/api/allorders/index.js`
  - Açıklama metinleri `2026 + 2025` birleşik sipariş okumasını yansıtacak şekilde güncellendi.

- `pages/api/products/index.js`
- `pages/api/get-user-vergi-no/get-edis-carkod.js`
- `lib/getEdisCarkodByUserId.js`
- `app/(dashboardLayout)/test/page.jsx`
  - Eski yıl ifadeleri ve açıklamalar aktif ADNAN veri tabanı mantığına göre temizlendi.

### Yapılan Kontroller

Aşağıdaki kontroller başarılı geçti:

```bash
npx prisma generate
npm run lint
npm run build
```

Build çıktısında beklenen veri tabanı yönlendirmesi doğrulandı:

```txt
Aktif DB (2026): ETA_ADNAN_2026
Geçmiş DB (2025): ETA_ADNAN_2025
EDIS DB: ETA_EDIS_2025
```

### Dikkat Edilecekler

- Vercel Production environment içinde `DATABASE_URL_2026` mutlaka tanımlanmalıdır.
- Local `.env` dosyasında `DATABASE_URL_2026` tanımlı olmalıdır.
- `ETA_ADNAN_2026` içindeki tablo yapıları mevcut Prisma schema ile aynı olmalıdır.
- `ETA_ADNAN_2024` artık uygulamanın aktif okuma/yazma akışında kullanılmaz.

SQL Script:

## ALLORDERS

CREATE TABLE ALLORDERS (
ID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
DATE DATETIME NOT NULL DEFAULT GETDATE(),
ORDERNO VARCHAR(250) COLLATE Turkish_BIN NOT NULL,
CARKOD VARCHAR(250) COLLATE Turkish_BIN NOT NULL,
CARUNVAN VARCHAR(250) COLLATE Turkish_BIN NOT NULL,
STKKOD VARCHAR(250) COLLATE Turkish_BIN NOT NULL,
STKNAME VARCHAR(250) COLLATE Turkish_BIN NULL,
STKCINSI VARCHAR(250) COLLATE Turkish_BIN NULL,
STKADET INT NOT NULL,
STKBIRIMFIYAT FLOAT NOT NULL,
STKBIRIMFIYATTOPLAM FLOAT NOT NULL,
ORDERFIYATTOPLAM FLOAT NOT NULL,
ACIKLAMA VARCHAR(250) COLLATE Turkish_BIN NULL,
CIKISFISEVRNO INT NOT NULL,
SATISIRSEVRNO INT NOT NULL,
HARREFDEGER1 INT NOT NULL,
STKFISREFNO INT NOT NULL,
ORDERYIL INT NOT NULL,
ORDERAY INT NOT NULL,
ORDERGUN INT NOT NULL,
ORDERSAAT VARCHAR(250) COLLATE Turkish_BIN NOT NULL,
STKFISEVRAKNO1 VARCHAR(250) COLLATE Turkish_BIN NULL,
STKFISEVRAKNO2 VARCHAR(250) COLLATE Turkish_BIN NULL,
ORDERSTATUS VARCHAR(250) COLLATE Turkish_BIN NULL,
TALEP VARCHAR(MAX) COLLATE Turkish_BIN NULL,
CEVAP VARCHAR(MAX) COLLATE Turkish_BIN NULL,
REFNO INT NULL,
EKXTRA5 INT NULL,
EKXTRA6 INT NULL,
EKXTRA7 FLOAT NULL,
EKXTRA8 FLOAT NULL,
EKXTRA9 FLOAT NULL
);

## STKMIZDEGERYEDEK

CREATE TABLE STKMIZDEGERYEDEK (
ID INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
DATE DATETIME DEFAULT GETDATE() NOT NULL,
STKKOD VARCHAR(60) NOT NULL,
STKYIL INT NOT NULL,
STKAY INT NOT NULL,
STKRAKTIP INT NOT NULL,
STKDOVKOD VARCHAR(40) NOT NULL,
STKBORC NUMERIC(28, 9) NOT NULL,
STKALACAK NUMERIC(28, 9) NOT NULL,
STKDEPO VARCHAR(40) NOT NULL
);

## CARKART Admin bilgilerini kaydetme

INSERT INTO CARKART (CARKOD, CARUNVAN, CARUNVAN3, CARYETKILI, CAROZKOD1, CAROZKOD3, CAROZKOD5)
VALUES (
7034922,
'ÇALIŞKAN ARI YAYINLARI',
'caliskanariyayinlari@gmail.com',
'Admin',
'A',
'B2',
'$2y$10$qdByGVE4u0N8OYiWvt36Ce4'
);

## CARKART Varchar değeri değiştirme

ALTER TABLE CARKART
ALTER COLUMN CAROZKOD5 VARCHAR(250);

## ÜRÜNLERİN STKOZKOD1'i EĞER "A" İSE AKTİF, "2" İSE ÜRÜN BASIM AŞAMASINDA OLDUĞUNU SİMGELER.

VERİ BİLGİSİ STKKART TABLOSUNDAN ÇEKİLİR. STKOZKOD1, ÜRÜNÜN DURUMUNU TEMSİL EDER. ÖRN. AKTİF, BASIMDA VE STOK DURUMU OLACAK ŞEKİLDE.

## IPTAL EDILEN IRSALIYE NASIL GERI ALINIR?

ÖNCE ALLORDERS'TA İLGİLİ SİPARİŞİN "ORDERSTATUS" DEĞERİNİ DEĞİŞTİRMELİYİZ. ARDINDAN, IRSFIS'TE IRSFISIPTALFLAG DEĞERİNİ 0 YAPACAĞIZ, AYNI ŞEKİLDE IRSHAR TABLOSUNDAKİ IRSHARIPTALFLAG DEĞERİNİ DE 0 YAPACAĞIZ. BU 3 TABLONUN ORTAK NOKTASI, ALLORDERS'TA "REFNO", IRSFIS TABLOSUNDA "IRSFISREFNO", IRSHAR TABLOSUNDA "IRSHARREFNO". BU 3 DEĞER BU TABLOLARDA ORTAKTIR.
