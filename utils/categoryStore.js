import { create } from 'zustand'

const categoryStore = create((set) => ({
  categories: [
    { 
      id: 1, 
      name: "ÇALIŞKAN ARI (1-4. SINIFLAR)",
      products: [
        { id: 1, name: "1.SINIF ALTIN SET", price: "690,00", link: "https://caliskanari.com/shop/1-sinif-altin-set/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/Altin-Set-Reklam-2022-02-420x420.png.webp", status: "Stokta Yok", discount: "",stock: 10 },
        { id: 2, name: "1. SINIF AKILLI DEFTERİM", price: "210,00", link: "https://caliskanari.com/shop/1-sinif-akilli-defterim/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/X7-420x420.png.webp", status: "", discount: 20, stock: 5},
        { id: 3, name: "1. SINIF HAFTASONU EV ÖDEVİ", price: "82,50", link: "https://caliskanari.com/shop/1-sinif-haftasonu-ev-odevi/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/X8-420x420.png.webp", status: "", discount: 50, stock: 11 },
        { id: 4, name: "1. SINIF HAYAT BİLGİSİ ÖĞRENİYORUM", price: "67,50", link: "https://caliskanari.com/shop/1-sinif-hayat-bilgisi-ogreniyorum/", imagesrc: "https://caliskanari.com/wp-content/uploads/2023/11/x-02-420x420.png.webp", status: "Yeni Baskıya Hazırlanıyor", discount: "", stock: 5 },
        { id: 5, name: "1. SINIF MATEMATİK ÖĞRENİYORUM", price: "127,00", link: "https://caliskanari.com/shop/1-sinif-matematik-ogreniyorum/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/X2-420x420.png.webp", status: "", discount: "", stock: 7 },
        { id: 6, name: "1. SINIF SERBEST ETKİNLİK KİTABIM", price: "67,50", link: "https://caliskanari.com/shop/serbest-etkinlik-kitabim/", imagesrc: "https://caliskanari.com/wp-content/uploads/2023/11/x-01-420x420.png.webp", status: "", discount: "", stock: 9 },
        { id: 7, name: "1. SINIF SET", price: "567,00", link: "https://caliskanari.com/shop/1-sinif-set/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/1SET-420x420.jpeg.webp", status: "", discount: "", stock: 8 },
        { id: 8, name: "1. SINIF TATİL ARKADAŞIM", price: "100,00", link: "https://caliskanari.com/shop/1-sinif-tatil-arkadasim/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/x-27-420x420.png.webp", status: "", discount: "", stock: 4 },
        { id: 9, name: "1. SINIF TÜM DERSLER SORU BANKASI", price: "95,00", link: "https://caliskanari.com/shop/1-sinif-tum-dersler-soru-bankasi/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/1.SINIF_-1-420x420.jpeg.webp", status: "", discount: "", stock: 11 },
        { id: 10, name: "1. SINIF TÜRKÇE ÖĞRENİYORUM", price: "127,50", link: "https://caliskanari.com/shop/1-sinif-turkce-ogreniyorum/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/X4-420x420.png.webp", status: "", discount: "", stock: 12 },
        { id: 11, name: "2 .SINIF HAYAT BİLGİSİ ÖĞRENİYORUM", price: "82,50", link: "https://caliskanari.com/shop/1-sinif-turkce-ogreniyorum/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/X4-420x420.png.webp", status: "", discount: "", stock: 6 },
        { id: 12, name: "2 .SINIF TÜRKÇE ÖĞRENİYORUM", price: "180,00", link: "https://caliskanari.com/shop/2-sinif-turkce-ogreniyorum/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/x_0013_03-420x420.png.webp", status: "", discount: "", stock: 14 },
      ]
    },
    { 
      id: 2, 
      name: "KÜÇÜK ARILAR (OKUL ÖNCESİ)",
      products: [
        { id: 13, name: "1 KAVANOZ EĞİTİM SETİ", link: "https://caliskanari.com/shop/2-sinif-hayat-bilgisi-ogreniyorum/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/x_0012_Group-1-copy-420x420.png.webp", status: "", discount: "", stock: 7 },
        { id: 14, name: "BEŞ GELİŞİM ALANI ETKİNLİKLERİ", link: "https://caliskanari.com/shop/bes-gelisim-alani-etkinlikleri/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/x_0000_BES-GELISIM-420x420.png.webp", status: "", discount: "", stock: 5 },
        { id: 15, name: "ÇİZGİLERİN EĞLENCELİ DÜNYASI", link: "https://caliskanari.com/shop/cizgilerin-eglenceli-dunyasi/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/x_0004_CIZGILERIN-DUNYASI-420x420.png.webp", status: "", discount: "", stock: 9 },
        { id: 16, name: "DİKKAT GELİŞTİRME VE KODLAMA", link: "https://caliskanari.com/shop/dikkat-gelistirme-ve-kodlama/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/dikkat-kodlama-360x360.png.webp", status: "", discount: "", stock: 12 },
        { id: 17, name: "KAVRAMLARIN EĞLENCELİ DÜNYASI", link: "https://caliskanari.com/shop/kavramlarin-eglenceli-dunyasi/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/x_0003_KAVRAMLARIN-EGLENCELI-DUNYASI-420x420.png.webp", status: "", discount: "", stock: 6 },
        { id: 18, name: "KÜÇÜK ARILAR EĞİTİM SETİ", link: "https://caliskanari.com/shop/kucuk-arilar-egitim-seti/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/r-01-210x210.png.webp", status: "", discount: "", stock: 10 },
        { id: 19, name: "KÜÇÜK ARILAR SANAT AKADEMİSİ (BÜYÜK BOY)", link: "https://caliskanari.com/shop/kucuk-arilar-sanat-akademisi-buyuk-boy/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/Kucuk-Arilar-Akademisi-Kitap-Sanat-Akademisi-360x360.png.webp", status: "", discount: "", stock: 5 },
        { id: 20, name: "MATEMATİĞİN EĞLENCELİ DÜNYASI", link: "https://caliskanari.com/shop/matematigin-eglenceli-dunyasi/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/x_0002_MATEMATIGIN-DUNYASI-420x420.png.webp", status: "", discount: "", stock: 17 },
        { id: 21, name: "RENKLERİN VE ŞEKİLLERİN EĞLENCELİ DÜNYASI", link: "https://caliskanari.com/shop/renklerin-ve-sekillerin-eglenceli-dunyasi/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/x_0001_RENKLERIN-SEKILLERIN-DUNYASI-360x360.png.webp", status: "", discount: "", stock: 20 },
        { id: 22, name: "Şirin Dinozorlar Seti", link: "https://caliskanari.com/shop/sirin-dinozorlar-seti/", imagesrc: "https://caliskanari.com/wp-content/uploads/2023/09/dinozorlar-kapak-420x420.jpg.webp", status: "", discount: "", stock: 22 },
        { id: 23, name: "YENİ UFUKLAR EĞİTİM SETİ", link: "https://caliskanari.com/shop/yeni-ufuklar-egitim-seti/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/yeni-ufuklar-set-360x360.png.webp", status: "", discount: "", stock: 29 }
      ]
    },
    { 
      id: 3, 
      name: "HEYDAY ENGLİSH (İNGİLİZCE)",
      products: [
        { id: 24, name: "HEYDAY 2.SINIF", price: "200,00", link: "https://caliskanari.com/shop/heyday-2-sinif/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/Y-43-420x420.png.webp", status: "", discount: "", stock: 3 },
        { id: 25, name: "HEYDAY 2. SINIF TAM SET", price: "330,00", link: "https://caliskanari.com/shop/heyday-2-sinif-tam-set/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/heyday2-tanitim-420x420.png.webp", status: "", discount: "", stock: 2 },
        { id: 26, name: "HEYDAY 2. SINIF WORKSHEETS TEST BOOK", price: "130,00", link: "https://caliskanari.com/shop/heyday-2-sinif-worksheets-test-book/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/x-19-1-420x420.png.webp", status: "", discount: "", stock: 25 },
        { id: 27, name: "HEYDAY 3. SINIF", price: "200,00", link: "https://caliskanari.com/shop/heyday-3-sinif/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/Y-44-420x420.png.webp", status: "", discount: "", stock: 14 },
        { id: 28, name: "HEYDAY 3. SINIF TAM SET", price: "330,00", link: "https://caliskanari.com/shop/heyday-3-sinif-tam-set/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/heyday-3-tanitim-420x420.png.webp", status: "", discount: "", stock: 8 },
        { id: 29, name: "HEYDAY 3. SINIF WORKSHEETS TEST BOOK", price: "130,00", link: "https://caliskanari.com/shop/heyday-3-sinif-worksheets-test-book/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/x-26-1-420x420.png.webp", status: "", discount: "", stock: 4 },
        { id: 30, name: "HEYDAY 4. SINIF", price: "200,00", link: "https://caliskanari.com/shop/heyday-4-sinif/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/Y-45-420x420.png.webp", status: "", discount: "", stock: 40 },
        { id: 31, name: "HEYDAY 4. SINIF TAM SET", price: "330,00", link: "https://caliskanari.com/shop/heyday-4-sinif-tam-set/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/heyday-4-tanitim-420x420.png.webp", status: "", discount: "", stock: 34 },
        { id: 32, name: "HEYDAY 4. SINIF WORKSHEETS TEST BOOK", price: "130,00", link: "https://caliskanari.com/shop/heyday-4-sinif-worksheets-test-book/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/x-33-420x420.png.webp", status: "", discount: "", stock: 29 },
        { id: 33, name: "HEYDAY 5. SINIF PRACTICE BOOK", price: "190,00", link: "https://caliskanari.com/shop/heyday-5-sinif-practice-book/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/heyday5-pb-kapak-01-420x420.png.webp", status: "", discount: "", stock: 2 },
        { id: 34, name: "HEYDAY 5. SINIF SET", price: "302,50", link: "https://caliskanari.com/shop/heyday-5-sinif-set/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/5-420x420.png.webp", status: "", discount: "", stock: 24 },
        { id: 35, name: "HEYDAY 5. SINIF WORKSHEET & TEST BOOK", price: "112,50", link: "https://caliskanari.com/shop/heyday-5-sinif-worksheet-test-book/", imagesrc: "https://caliskanari.com/wp-content/uploads/2022/11/x-02-1-420x420.png.webp", status: "", discount: "", stock: 20 },
      ]
    }
  ],
}));

export default categoryStore;
