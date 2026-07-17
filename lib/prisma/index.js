import { PrismaClient } from "@prisma/client";

let prisma; // 2026 veritabanı için (tüm yazma ve güncel okuma işlemleri)
let prisma2025; // 2025 veritabanı için (sadece geçmiş yıl okuma)
let prismaEdis; // EDIS veritabanı için (sadece okuma)

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_2026,
  });

  prisma2025 = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_2025,
  });

  prismaEdis = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_EDIS,
  });
} else {
  if (!global.prisma2026) {
    global.prisma2026 = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL_2026,
    });
  }
  prisma = global.prisma2026;

  if (!global.prisma2025) {
    global.prisma2025 = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL_2025,
    });
  }
  prisma2025 = global.prisma2025;

  if (!global.prismaEdis) {
    global.prismaEdis = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL_EDIS,
    });
  }
  prismaEdis = global.prismaEdis;
}

const getDatabaseName = (url) =>
  url?.match(/database=([^;]+)/)?.[1] || "tanımsız";

// Debug için bağlantıları kontrol edelim
console.log("Aktif DB (2026):", getDatabaseName(process.env.DATABASE_URL_2026));
console.log("Geçmiş DB (2025):", getDatabaseName(process.env.DATABASE_URL_2025));
console.log("EDIS DB:", getDatabaseName(process.env.DATABASE_URL_EDIS));

// Prisma client'ların bağlantılarını kontrol edelim
prisma
  .$connect()
  .then(() => {
    console.log("2026 DB bağlantısı başarılı (tüm işlemler)");
  })
  .catch((err) => {
    console.error("2026 DB bağlantı hatası:", err);
  });

prisma2025
  .$connect()
  .then(() => {
    console.log("2025 DB bağlantısı başarılı (sadece okuma)");
  })
  .catch((err) => {
    console.error("2025 DB bağlantı hatası:", err);
  });

prismaEdis
  .$connect()
  .then(() => {
    console.log("EDIS DB bağlantısı başarılı (sadece okuma)");
  })
  .catch((err) => {
    console.error("EDIS DB bağlantı hatası:", err);
  });

export { prisma, prisma2025, prismaEdis };
