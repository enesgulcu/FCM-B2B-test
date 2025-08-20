import { PrismaClient } from "@prisma/client";

let prisma; // 2025 veritabanı için (tüm işlemler)
let prisma2024; // 2024 veritabanı için (sadece okuma)
let prismaEdis; // EDIS veritabanı için (sadece okuma)

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_2025,
  });

  prisma2024 = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_2024,
  });

  prismaEdis = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_EDIS,
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL_2025,
    });
  }
  prisma = global.prisma;

  if (!global.prisma2024) {
    global.prisma2024 = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL_2024,
    });
  }
  prisma2024 = global.prisma2024;

  if (!global.prismaEdis) {
    global.prismaEdis = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL_EDIS,
    });
  }
  prismaEdis = global.prismaEdis;
}

// Debug için bağlantıları kontrol edelim
console.log("2025 DB URL:", process.env.DATABASE_URL_2025);
console.log("2023 DB URL:", process.env.DATABASE_URL_2023);
console.log("2024 DB URL:", process.env.DATABASE_URL_2024);
console.log("EDIS DB URL:", process.env.DATABASE_URL_EDIS);

// Prisma client'ların bağlantılarını kontrol edelim
prisma
  .$connect()
  .then(() => {
    console.log("2025 DB bağlantısı başarılı (tüm işlemler)");
  })
  .catch((err) => {
    console.error("2025 DB bağlantı hatası:", err);
  });

prisma2024
  .$connect()
  .then(() => {
    console.log("2024 DB bağlantısı başarılı (sadece okuma)");
  })
  .catch((err) => {
    console.error("2024 DB bağlantı hatası:", err);
  });

prismaEdis
  .$connect()
  .then(() => {
    console.log("EDIS DB bağlantısı başarılı (sadece okuma)");
  })
  .catch((err) => {
    console.error("EDIS DB bağlantı hatası:", err);
  });

export { prisma, prisma2024, prismaEdis };
