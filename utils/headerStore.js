import { GrEdit } from "react-icons/gr";
import { LuBaby } from "react-icons/lu";
import { RiBook3Line, RiShoppingBasketFill } from "react-icons/ri";
import { create } from "zustand";

const headerStore = create((set) => ({
  header: {
    menus: [
      {
        id: 1,
        text: "Anasayfa",
        href: "/",
        subMenus: [],
        isLoginRule: false,
      },
      {
        id: 2,
        text: "Mağaza",
        href: "/shop",
        subMenus: [],
        isLoginRule: true,
      },
      {
        id: 3,
        text: "Cari Takip",
        href: "/billings",
        subMenus: [],
        isLoginRule: true,
      },
      {
        id: 4,
        text: "Siparişlerim",
        href: "/customer-orders",
        subMenus: [],
        isLoginRule: true,
      },
      {
        id: 5,
        text: "Küçük Arılar Cari Takip",
        href: "/kucuk-arilar-cari-takip",
        subMenus: [],
        isLoginRule: true,
      },
    ],
    mainMenuLogo: [
      {
        logosrc: "https://caliskanari.com/wp-content/uploads/2022/11/x-04.png",
      },
    ],
    mainMenuItems: [
      {
        id: 1,
        text: "ÇALIŞKAN ARI (1-4. SINIFLAR)",
        href: "https://caliskanari.com/urun-kategori/caliskan-ari/",
        icon: <GrEdit style={{ width: "30px", height: "30px" }} />,
        subMenus: [
          {
            id: 297,
            text: "1. Sınıf",
            href: "https://caliskanari.com/urun-kategori/caliskan-ari/1-sinif-caliskan-ari/",
            products: [
              {
                id: 401,
                name: "1.SINIF ALTIN SET",
                price: "690,00",
                link: "https://caliskanari.com/shop/1-sinif-altin-set/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/Altin-Set-Reklam-2022-02-420x420.png.webp",
                status: "Stokta Yok",
                discount: "",
                stock: 10,
              },
              {
                id: 402,
                name: "1. SINIF AKILLI DEFTERİM",
                price: "210,00",
                link: "https://caliskanari.com/shop/1-sinif-akilli-defterim/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/X7-420x420.png.webp",
                status: "",
                discount: 20,
                stock: 5,
              },
              {
                id: 403,
                name: "1. SINIF HAFTASONU EV ÖDEVİ",
                price: "82,50",
                link: "https://caliskanari.com/shop/1-sinif-haftasonu-ev-odevi/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/X8-420x420.png.webp",
                status: "",
                discount: 50,
                stock: 11,
              },
              {
                id: 404,
                name: "1. SINIF HAYAT BİLGİSİ ÖĞRENİYORUM",
                price: "67,50",
                link: "https://caliskanari.com/shop/1-sinif-hayat-bilgisi-ogreniyorum/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2023/11/x-02-420x420.png.webp",
                status: "Yeni Baskıya Hazırlanıyor",
                discount: "",
                stock: 5,
              },
              {
                id: 405,
                name: "1. SINIF MATEMATİK ÖĞRENİYORUM",
                price: "127,00",
                link: "https://caliskanari.com/shop/1-sinif-matematik-ogreniyorum/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/X2-420x420.png.webp",
                status: "",
                discount: "",
                stock: 7,
              },
              {
                id: 406,
                name: "1. SINIF SERBEST ETKİNLİK KİTABIM",
                price: "67,50",
                link: "https://caliskanari.com/shop/serbest-etkinlik-kitabim/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2023/11/x-01-420x420.png.webp",
                status: "",
                discount: "",
                stock: 9,
              },
              {
                id: 407,
                name: "1. SINIF SET",
                price: "567,00",
                link: "https://caliskanari.com/shop/1-sinif-set/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/1SET-420x420.jpeg.webp",
                status: "",
                discount: "",
                stock: 8,
              },
              {
                id: 408,
                name: "1. SINIF TATİL ARKADAŞIM",
                price: "100,00",
                link: "https://caliskanari.com/shop/1-sinif-tatil-arkadasim/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-27-420x420.png.webp",
                status: "",
                discount: "",
                stock: 4,
              },
              {
                id: 409,
                name: "1. SINIF TÜM DERSLER SORU BANKASI",
                price: "95,00",
                link: "https://caliskanari.com/shop/1-sinif-tum-dersler-soru-bankasi/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/1.SINIF_-1-420x420.jpeg.webp",
                status: "",
                discount: "",
                stock: 11,
              },
              {
                id: 410,
                name: "1. SINIF TÜRKÇE ÖĞRENİYORUM",
                price: "127,50",
                link: "https://caliskanari.com/shop/1-sinif-turkce-ogreniyorum/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/X4-420x420.png.webp",
                status: "",
                discount: "",
                stock: 12,
              },
              {
                id: 411,
                name: "ÇALIŞKAN ARI TATİL BİLGİ KVOANI 1.SINIF",
                price: "150,00",
                link: "https://caliskanari.com/shop/1-sinif-turkce-ogreniyorum/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/X4-420x420.png.webp",
                status: "",
                discount: "",
                stock: 12,
              },
            ],
          },
          {
            id: 298,
            text: "2. Sınıf",
            href: "https://caliskanari.com/urun-kategori/caliskan-ari/2-sinif-caliskan-ari/",
            products: [
              {
                id: 412,
                name: "2. SINIF HAYAT BİLGİSİ ÖĞRENİYORUM",
                price: "82,50",
                link: "https://caliskanari.com/shop/1-sinif-altin-set/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x_0012_Group-1-copy-360x360.png.webp",
                status: "Stokta Yok",
                discount: "",
                stock: 10,
              },
              {
                id: 413,
                name: "2. SINIF TÜRKÇE ÖĞRENİYORUM",
                price: "180,80",
                link: "https://caliskanari.com/shop/1-sinif-akilli-defterim/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x_0013_03-360x360.png.webp",
                status: "",
                discount: "",
                stock: 5,
              },
              {
                id: 414,
                name: "2. SINIF HAFTA SONU EV ÖDEVİ",
                price: "90,00",
                link: "https://caliskanari.com/shop/1-sinif-haftasonu-ev-odevi/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x_0011_03-360x360.png.webp",
                status: "",
                discount: "",
                stock: 11,
              },
              {
                id: 415,
                name: "2. SINIF MATEMATİK ÖĞRENİYORUM (1. DÖNEM)",
                price: "112,00",
                link: "https://caliskanari.com/shop/1-sinif-hayat-bilgisi-ogreniyorum/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x_0009_03-360x360.png.webp",
                status: "Yeni Baskıya Hazırlanıyor",
                discount: "",
                stock: 5,
              },
              {
                id: 416,
                name: "2. SINIF MATEMATİK ÖĞRENİYORUM (2. DÖNEM)",
                price: "112,00",
                link: "https://caliskanari.com/shop/1-sinif-matematik-ogreniyorum/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x_0010_03-360x360.png.webp",
                status: "",
                discount: "",
                stock: 7,
              },
              {
                id: 417,
                name: "2. SINIF NOKTA ATIŞI YENİ NESİL SORU BANKASI",
                price: "220,00",
                link: "https://caliskanari.com/shop/serbest-etkinlik-kitabim/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2024/02/X-07-420x420.png.webp",
                status: "",
                discount: "",
                stock: 9,
              },
              {
                id: 418,
                name: "2. SINIF OKUMA ANLAMA",
                price: "50,00",
                link: "https://caliskanari.com/shop/1-sinif-set/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-14-360x360.png.webp",
                status: "",
                discount: "",
                stock: 8,
              },
              {
                id: 419,
                name: "2. SINIF PROBLEM KİTABI",
                price: "50,00",
                link: "https://caliskanari.com/shop/1-sinif-tatil-arkadasim/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-23-360x360.png.webp",
                status: "",
                discount: "",
                stock: 4,
              },
              {
                id: 420,
                name: "2. SINIF SET",
                price: "577,00",
                link: "https://caliskanari.com/shop/1-sinif-tum-dersler-soru-bankasi/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/2022-REKLAM-Ogreniyoruz-02-420x420.png.webp",
                status: "",
                discount: "",
                stock: 11,
              },
              {
                id: 421,
                name: "2. SINIF SÜPER DENEME 6’LI",
                price: "112,50",
                link: "https://caliskanari.com/shop/1-sinif-turkce-ogreniyorum/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-10-360x360.png.webp",
                status: "",
                discount: "",
                stock: 12,
              },
              {
                id: 422,
                name: "2. SINIF TATİL ARKADAŞIM",
                price: "100,00",
                link: "https://caliskanari.com/shop/1-sinif-turkce-ogreniyorum/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-26-360x360.png.webp",
                status: "",
                discount: "",
                stock: 12,
              },
              {
                id: 423,
                name: "2. SINIF TÜM DERSLER SORU BANKASI",
                price: "77,00",
                link: "https://caliskanari.com/shop/1-sinif-turkce-ogreniyorum/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/2.SINIF_-360x360.jpeg.webp",
                status: "",
                discount: "",
                stock: 12,
              },
              {
                id: 424,
                name: "2.SINIF TÜM DERSLER GÜNLÜK AKIL DEFTERİM",
                price: "325,00",
                link: "https://caliskanari.com/shop/1-sinif-turkce-ogreniyorum/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2023/03/2-3-360x360.jpg.webp",
                status: "",
                discount: "",
                stock: 12,
              },
              {
                id: 425,
                name: "ÇALIŞKAN ARI TATİL BİLGİ KOVANI",
                price: "150,00",
                link: "https://caliskanari.com/shop/1-sinif-turkce-ogreniyorum/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-26-360x360.png.webp",
                status: "",
                discount: "",
                stock: 12,
              },
            ],
          },
          {
            id: 299,
            text: "3. Sınıf",
            href: "https://caliskanari.com/urun-kategori/caliskan-ari/3-sinif-caliskan-ari/",
            products: [
              {
                id: 426,
                name: "3 .SINIF FEN BİLİMLERİ ÖĞRENİYORUM",
                price: "90,00",
                link: "https://caliskanari.com/shop/3-sinif-etkinlikli-soru-bankasi/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/3.SINIF_-360x360.jpeg.webp",
                status: "",
                discount: "",
                stock: 10,
              },
              {
                id: 427,
                name: "3 .SINIF HAYAT BİLGİSİ ÖĞRENİYORUM",
                price: "82,50",
                link: "https://caliskanari.com/shop/3-sinif-hayat-bilgisi-ogreniyorum/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/YY-07-360x360.png.webp",
                status: "",
                discount: "",
                stock: 5,
              },
              {
                id: 428,
                name: "3. SINIF HAFTA SONU EV ÖDEVİ",
                price: "90,00",
                link: "https://caliskanari.com/shop/3-sinif-hafta-sonu-ev-odevi/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/YY-08-360x360.png.webp",
                status: "",
                discount: "",
                stock: 11,
              },
              {
                id: 429,
                name: "3. SINIF MATEMATİK ÖĞRENİYORUM (1. DÖNEM)",
                price: "112,50",
                link: "https://caliskanari.com/shop/3-sinif-matematik-ogreniyorum-1-donem/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x_0009_03-360x360.png.webp",
                status: "",
                discount: "",
                stock: 5,
              },
              {
                id: 430,
                name: "3. SINIF MATEMATİK ÖĞRENİYORUM (2. DÖNEM)",
                price: "112,50",
                link: "https://caliskanari.com/shop/3-sinif-matematik-ogreniyorum-1-donem/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2024/02/X-17-420x420.png.webp",
                status: "",
                discount: "",
                stock: 7,
              },
              {
                id: 431,
                name: "3. SINIF NOKTA ATIŞI YENİ NESİL SORU BANKASI",
                price: "220,00",
                link: "https://caliskanari.com/shop/3-sinif-nokta-atisi-yeni-nesil-soru-bankasi/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2024/02/X-17-420x420.png.webp",
                status: "",
                discount: "",
                stock: 9,
              },
              {
                id: 432,
                name: "3. SINIF OKUMA ANLAMA",
                price: "50,00",
                link: "https://caliskanari.com/shop/3-sinif-set/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-13-360x360.png.webp",
                status: "",
                discount: "",
                stock: 8,
              },
              {
                id: 433,
                name: "3. SINIF PROBLEM KİTABI",
                price: "50,00",
                link: "https://caliskanari.com/shop/3-sinif-problem-kitabi/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-24-360x360.png.webp",
                status: "",
                discount: "",
                stock: 4,
              },
              {
                id: 434,
                name: "3. SINIF SET",
                price: "677,00",
                link: "https://caliskanari.com/shop/3-sinif-set/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/2022-REKLAM-Ogreniyoruz-03-420x420.png.webp",
                status: "",
                discount: "",
                stock: 11,
              },
              {
                id: 435,
                name: "3. SINIF SÜPER DENEME 6’LI",
                price: "112,50",
                link: "https://caliskanari.com/shop/3-sinif-super-deneme-6li/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-11-360x360.png.webp",
                status: "",
                discount: "",
                stock: 12,
              },
              {
                id: 436,
                name: "3. SINIF TATİL ARKADAŞIM",
                price: "100,00",
                link: "https://caliskanari.com/shop/3-sinif-tatil-arkadasim/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-29-360x360.png.webp",
                status: "",
                discount: "",
                stock: 12,
              },
              {
                id: 437,
                name: "3. SINIF TÜM DERSLER SORU BANKASI",
                price: "82,50",
                link: "https://caliskanari.com/shop/3-sinif-etkinlikli-soru-bankasi/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/3.SINIF_-360x360.jpeg.webp",
                status: "",
                discount: "",
                stock: 12,
              },
              {
                id: 438,
                name: "3. SINIF TÜRKÇE ÖĞRENİYORUM",
                price: "180,00",
                link: "https://caliskanari.com/shop/3-sinif-turkce-ogreniyorum/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/YY-10-360x360.png.webp",
                status: "",
                discount: "",
                stock: 12,
              },
              {
                id: 439,
                name: "3.SINIF TÜM DERSLER GÜNLÜK AKIL DEFTERİM",
                price: "325,00",
                link: "https://caliskanari.com/shop/3-sinif-tum-dersler-gunluk-akil-defterim/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2023/03/3-360x360.jpg.webp",
                status: "",
                discount: "",
                stock: 12,
              },
              {
                id: 440,
                name: "ÇALIŞKAN ARI TATİL BİLGİ KOVANI 3.SINIF",
                price: "150,00",
                link: "https://caliskanari.com/shop/caliskan-ari-tatil-bilgi-kovani-3-sinif/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2023/04/3.SINIF_-420x420.jpg.webp",
                status: "",
                discount: "",
                stock: 12,
              },
            ],
          },
          {
            id: 300,
            text: "4. Sınıf",
            href: "https://caliskanari.com/urun-kategori/caliskan-ari/4-sinif-caliskan-ari/",
            products: [
              {
                id: 441,
                name: "4 .SINIF FEN BİLİMLERİ ÖĞRENİYORUM",
                price: "95,00",
                link: "https://caliskanari.com/shop/4-sinif-fen-bilimleri-ogreniyorum/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/Z-11-360x360.png.webp",
                status: "",
                discount: "",
                stock: 10,
              },
              {
                id: 442,
                name: "4. SINIF HAFTA SONU EV ÖDEVİ",
                price: "90,00",
                link: "https://caliskanari.com/shop/4-sinif-hafta-sonu-ev-odevi/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/Z-16-360x360.png.webp",
                status: "",
                discount: "",
                stock: 5,
              },
              {
                id: 443,
                name: "4. SINIF MATEMATİK ÖĞRENİYORUM (1. DÖNEM)",
                price: "112,50",
                link: "https://caliskanari.com/shop/4-sinif-matematik-ogreniyorum-1-donem/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/Z-12-360x360.png.webp",
                status: "",
                discount: "",
                stock: 11,
              },
              {
                id: 444,
                name: "4. SINIF MATEMATİK ÖĞRENİYORUM (2. DÖNEM)",
                price: "112,50",
                link: "https://caliskanari.com/shop/3-sinif-matematik-ogreniyorum-2-donem-2/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/Z-13-360x360.png.webp",
                status: "",
                discount: "",
                stock: 5,
              },
              {
                id: 445,
                name: "4. SINIF NOKTA ATIŞI YENİ NESİL SORU BANKASI",
                price: "220,00",
                link: "https://caliskanari.com/shop/4-sinif-nokta-atisi-yeni-nesil-soru-bankasi/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2024/02/X-27-420x420.png.webp",
                status: "",
                discount: "",
                stock: 7,
              },
              {
                id: 446,
                name: "4. SINIF OKUMA ANLAMA",
                price: "50,00",
                link: "https://caliskanari.com/shop/4-sinif-okuma-anlama/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-12-360x360.png.webp",
                status: "",
                discount: "",
                stock: 9,
              },
              {
                id: 447,
                name: "4. SINIF PROBLEM KİTABI",
                price: "50,00",
                link: "https://caliskanari.com/shop/4-sinif-problem-kitabi/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-25-210x210.png.webp",
                status: "",
                discount: "",
                stock: 8,
              },
              {
                id: 448,
                name: "4. SINIF SET",
                price: "685,00",
                link: "https://caliskanari.com/shop/4-sinif-set/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/2022-REKLAM-Ogreniyoruz-04-210x210.png.webp",
                status: "",
                discount: "",
                stock: 4,
              },
              {
                id: 449,
                name: "4. SINIF SOSYAL BİLGİLER ÖĞRENİYORUZ",
                price: "95,00",
                link: "https://caliskanari.com/shop/4-sinif-sosyal-bilgiler-ogreniyoruz/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2024/02/X-24-210x210.png.webp",
                status: "",
                discount: "",
                stock: 11,
              },
              {
                id: 450,
                name: "4. SINIF SÜPER DENEME 6’LI",
                price: "112,50",
                link: "https://caliskanari.com/shop/4-sinif-super-deneme-6li/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-09-210x210.png.webp",
                status: "",
                discount: "",
                stock: 12,
              },
              {
                id: 451,
                name: "4. SINIF TATİL ARKADAŞIM",
                price: "100,00",
                link: "https://caliskanari.com/shop/4-sinif-tatil-arkadasim/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-28-210x210.png.webp",
                status: "",
                discount: "",
                stock: 12,
              },
              {
                id: 452,
                name: "4. SINIF TÜM DERSLER SORU BANKASI",
                price: "88,00",
                link: "https://caliskanari.com/shop/4-sinif-etkinlikli-soru-bankasi/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/4.SINIF_-210x210.jpeg.webp",
                status: "",
                discount: "",
                stock: 12,
              },
              {
                id: 453,
                name: "4. SINIF TÜRKÇE ÖĞRENİYORUM",
                price: "180,00",
                link: "https://caliskanari.com/shop/4-sinif-turkce-ogreniyorum/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/Z-15-210x210.png.webp",
                status: "",
                discount: "",
                stock: 12,
              },
              {
                id: 454,
                name: "4.SINIF TÜM DERSLER GÜNLÜK AKIL DEFTERİM",
                price: "325,00",
                link: "https://caliskanari.com/shop/4-sinif-tum-dersler-gunluk-akil-defterim/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2023/03/4-360x360.jpg.webp",
                status: "",
                discount: "",
                stock: 12,
              },
              {
                id: 455,
                name: "ÇALIŞKAN ARI TATİL BİLGİ KOVANI 4.SINIF",
                price: "150,00",
                link: "https://caliskanari.com/shop/calikan-ari-tatil-bilgi-kovani-4-sinif/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2023/04/4.SINIF_-210x210.jpg.webp",
                status: "",
                discount: "",
                stock: 12,
              },
            ],
          },
        ],
      },
      {
        id: 2,
        text: "HEYDAY ENGLİSH (İNGİLİZCE)",
        href: "https://caliskanari.com/urun-kategori/heyday/",
        icon: <RiBook3Line style={{ width: "35px", height: "35px" }} />,
        subMenus: [
          {
            id: 301,
            text: "2. Sınıf",
            href: "https://caliskanari.com/urun-kategori/heyday/2-sinif-english/",
            products: [
              {
                id: 456,
                name: "HEYDAY 2. SINIF",
                price: "200,00",
                link: "https://caliskanari.com/shop/heyday-2-sinif/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/Y-43-360x360.png.webp",
                status: "",
                discount: "",
                stock: 10,
              },
              {
                id: 457,
                name: "HEYDAY 2. SINIF TAM SET",
                price: "330,00",
                link: "https://caliskanari.com/shop/heyday-2-sinif-tam-set/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/heyday2-tanitim-360x360.png.webp",
                status: "",
                discount: "",
                stock: 5,
              },
              {
                id: 458,
                name: "HEYDAY 2. SINIF WORKSHEETS TEST BOOK",
                price: "130,00",
                link: "https://caliskanari.com/shop/heyday-2-sinif-worksheets-test-book/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-19-1-360x360.png.webp",
                status: "",
                discount: "",
                stock: 11,
              },
            ],
          },
          {
            id: 302,
            text: "3. Sınıf",
            href: "https://caliskanari.com/urun-kategori/heyday/3-sinif-english/",
            products: [
              {
                id: 459,
                name: "HEYDAY 3. SINIF",
                price: "200,00",
                link: "https://caliskanari.com/shop/heyday-3-sinif/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/Y-44-360x360.png.webp",
                status: "",
                discount: "",
                stock: 10,
              },
              {
                id: 460,
                name: "HEYDAY 3. SINIF TAM SET",
                price: "330,00",
                link: "https://caliskanari.com/shop/heyday-3-sinif-tam-set/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/heyday-3-tanitim-360x360.png.webp",
                status: "",
                discount: "",
                stock: 5,
              },
              {
                id: 461,
                name: "HEYDAY 3. SINIF WORKSHEETS TEST BOOK",
                price: "130,00",
                link: "https://caliskanari.com/shop/heyday-3-sinif-worksheets-test-book/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-26-1-210x210.png.webp",
                status: "",
                discount: "",
                stock: 11,
              },
            ],
          },
          {
            id: 303,
            text: "4. Sınıf",
            href: "https://caliskanari.com/urun-kategori/heyday/4-sinif-english/",
            products: [
              {
                id: 462,
                name: "HEYDAY 4. SINIF",
                price: "200,00",
                link: "https://caliskanari.com/shop/heyday-4-sinif/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/Y-45-360x360.png.webp",
                status: "",
                discount: "",
                stock: 10,
              },
              {
                id: 463,
                name: "HEYDAY 4. SINIF TAM SET",
                price: "330,00",
                link: "https://caliskanari.com/shop/heyday-4-sinif-tam-set/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/heyday-4-tanitim-360x360.png.webp",
                status: "",
                discount: "",
                stock: 5,
              },
              {
                id: 464,
                name: "HEYDAY 4. SINIF WORKSHEETS TEST BOOK",
                price: "130,00",
                link: "https://caliskanari.com/shop/heyday-4-sinif-worksheets-test-book/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-33-360x360.png.webp",
                status: "",
                discount: "",
                stock: 11,
              },
            ],
          },
          {
            id: 304,
            text: "5. Sınıf",
            href: "https://caliskanari.com/urun-kategori/heyday/5-sinif-english/",
            products: [
              {
                id: 465,
                name: "HEYDAY 5. SINIF PRACTICE BOOK",
                price: "190,00",
                link: "https://caliskanari.com/shop/heyday-5-sinif-practice-book/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/heyday5-pb-kapak-01-360x360.png.webp",
                status: "",
                discount: "",
                stock: 10,
              },
              {
                id: 466,
                name: "HEYDAY 5. SINIF SET",
                price: "302,50",
                link: "https://caliskanari.com/shop/heyday-5-sinif-set/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/5-360x360.png.webp",
                status: "",
                discount: "",
                stock: 5,
              },
              {
                id: 467,
                name: "HEYDAY 5. SINIF WORKSHEETS TEST BOOK",
                price: "112,50",
                link: "https://caliskanari.com/shop/heyday-5-sinif-worksheet-test-book/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-02-1-360x360.png.webp",
                status: "",
                discount: "",
                stock: 11,
              },
            ],
          },
          {
            id: 305,
            text: "6. Sınıf",
            href: "https://caliskanari.com/urun-kategori/heyday/6-sinif-english/",
            products: [
              {
                id: 468,
                name: "HEYDAY 6. SINIF PRACTICE BOOK",
                price: "190,00",
                link: "https://caliskanari.com/shop/heyday-6-sinif-practice-book/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-01-1-360x360.png.webp",
                status: "",
                discount: "",
                stock: 10,
              },
              {
                id: 469,
                name: "HEYDAY 6. SINIF TAM SET",
                price: "302,50",
                link: "https://caliskanari.com/shop/heyday-6-sinif-set/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/heyday6-1-360x360.png.webp",
                status: "",
                discount: "",
                stock: 5,
              },
              {
                id: 470,
                name: "HEYDAY 6. SINIF WORKSHEETS TEST BOOK",
                price: "112,50",
                link: "https://caliskanari.com/shop/heyday-6-sinif-worksheet-test-book/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-09-1-360x360.png.webp",
                status: "",
                discount: "",
                stock: 11,
              },
            ],
          },
          {
            id: 306,
            text: "7. Sınıf",
            href: "https://caliskanari.com/urun-kategori/heyday/7-sinif-english/",
            products: [
              {
                id: 471,
                name: "HEYDAY 7. SINIF PRACTICE BOOK",
                price: "190,00",
                link: "https://caliskanari.com/shop/heyday-7-sinif-practice-book/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-08-360x360.png.webp",
                status: "",
                discount: "",
                stock: 10,
              },
              {
                id: 472,
                name: "HEYDAY 7. SINIF TAM SET",
                price: "302,50",
                link: "https://caliskanari.com/shop/heyday-7-sinif-set/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/heyday7-1-360x360.png.webp",
                status: "",
                discount: "",
                stock: 5,
              },
              {
                id: 473,
                name: "HEYDAY 7. SINIF WORKSHEETS TEST BOOK",
                price: "112,50",
                link: "https://caliskanari.com/shop/heyday-7-sinif-worksheet-test-book/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-07-360x360.png.webp",
                status: "",
                discount: "",
                stock: 11,
              },
            ],
          },
          {
            id: 307,
            text: "8. Sınıf",
            href: "https://caliskanari.com/urun-kategori/heyday/8-sinif-english/",
            products: [
              {
                id: 474,
                name: "HEYDAY 8. SINIF LGS DENEME YENİ NESİL SORULAR",
                price: "75,00",
                link: "https://caliskanari.com/shop/heyday-8-sinif-lgs-deneme-yeni-nesil-sorular/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-06-360x360.png.webp",
                status: "",
                discount: "",
                stock: 10,
              },
              {
                id: 475,
                name: "HEYDAY 8. SINIF PRACTICE BOOK",
                price: "190,00",
                link: "https://caliskanari.com/shop/heyday-8-sinif-practice-book/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-05-1-360x360.png.webp",
                status: "",
                discount: "",
                stock: 5,
              },
              {
                id: 476,
                name: "HEYDAY 8. SINIF SET",
                price: "465,00",
                link: "https://caliskanari.com/shop/heyday-8-sinif-set/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/heyday8-360x360.png.webp",
                status: "",
                discount: "",
                stock: 11,
              },
              {
                id: 477,
                name: "HEYDAY 8. SINIF TEST BOOK",
                price: "200,00",
                link: "https://caliskanari.com/shop/heyday-8-sinif-test-book/",
                imagesrc:
                  "https://caliskanari.com/wp-content/uploads/2022/11/x-04-1-360x360.png.webp",
                status: "",
                discount: "",
                stock: 11,
              },
            ],
          },
        ],
      },
      {
        id: 3,
        text: "KÜÇÜK ARILAR (OKUL ÖNCESİ)",
        href: "https://caliskanari.com/urun-kategori/heyday/",
        icon: <LuBaby style={{ width: "40px", height: "40px" }} />,
        subMenus: [],
      },
    ],
    mainMenuButtons: [
      {
        id: 1,
        href: "https://caliskanari.com/cart/",
        icon: (
          <RiShoppingBasketFill style={{ width: "25px", height: "25px" }} />
        ),
      },
    ],
  },
  footer: {
    copyright: "Tüm hakları saklıdır. Caliskanari © 2024",
  },
  // Yeni menü eklemek için
  addMenu: (newMenu) =>
    set((state) => ({
      header: {
        ...state.header,
        menus: [...state.header.menus, newMenu],
      },
    })),
  // Menüyü kaldırmak için
  removeMenu: (index) =>
    set((state) => ({
      header: {
        ...state.header,
        menus: state.header.menus.filter((menu, i) => i !== index),
      },
    })),
  // Menü metnini güncellemek için
  setMenuText: (index, newText) =>
    set((state) => ({
      header: {
        ...state.header,
        menus: state.header.menus.map((menu, i) =>
          i === index ? { ...menu, text: newText } : menu
        ),
      },
    })),
  // Menü href'ini güncellemek için
  setMenuHref: (index, newHref) =>
    set((state) => ({
      header: {
        ...state.header,
        menus: state.header.menus.map((menu, i) =>
          i === index ? { ...menu, href: newHref } : menu
        ),
      },
    })),
  // Alt menü eklemek için
  addSubMenu: (menuIndex, newSubMenu) =>
    set((state) => ({
      header: {
        ...state.header,
        menus: state.header.menus.map((menu, i) => {
          if (i === menuIndex) {
            return {
              ...menu,
              subMenus: [...menu.subMenus, newSubMenu],
            };
          }
          return menu;
        }),
      },
    })),
  // Alt menüyü kaldırmak için
  removeSubMenu: (menuIndex, subMenuIndex) =>
    set((state) => ({
      header: {
        ...state.header,
        menus: state.header.menus.map((menu, i) => {
          if (i === menuIndex) {
            return {
              ...menu,
              subMenus: menu.subMenus.filter(
                (subMenu, j) => j !== subMenuIndex
              ),
            };
          }
          return menu;
        }),
      },
    })),
  // Alt menü metnini güncellemek için
  setSubMenuText: (menuIndex, subMenuIndex, newText) =>
    set((state) => ({
      header: {
        ...state.header,
        menus: state.header.menus.map((menu, i) => {
          if (i === menuIndex) {
            return {
              ...menu,
              subMenus: menu.subMenus.map((subMenu, j) =>
                j === subMenuIndex ? { ...subMenu, text: newText } : subMenu
              ),
            };
          }
          return menu;
        }),
      },
    })),
  // Alt menü href'ini güncellemek için
  setSubMenuHref: (menuIndex, subMenuIndex, newHref) =>
    set((state) => ({
      header: {
        ...state.header,
        menus: state.header.menus.map((menu, i) => {
          if (i === menuIndex) {
            return {
              ...menu,
              subMenus: menu.subMenus.map((subMenu, j) =>
                j === subMenuIndex ? { ...subMenu, href: newHref } : subMenu
              ),
            };
          }
          return menu;
        }),
      },
    })),
  // Menülerin sırasını değiştirmek için
  reorderMenus: (startIndex, endIndex) =>
    set((state) => {
      const menus = Array.from(state.header.menus);
      const [removed] = menus.splice(startIndex, 1);
      menus.splice(endIndex, 0, removed);

      return {
        header: {
          ...state.header,
          menus,
        },
      };
    }),

  // Admin logo fotoğrafını değiştirmek için
  setAdminLogo: (newLogoSrc) =>
    set((state) => ({
      header: {
        ...state.header,
        mainMenuLogo: [{ logosrc: newLogoSrc }],
      },
    })),
}));

export default headerStore;
