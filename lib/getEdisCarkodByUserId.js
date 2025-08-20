// lib/getEdisCarkodByUserId.js
import { prisma2024, prismaEdis } from "@/lib/prisma";

export async function getEdisCarkodByUserId(userId) {
  // 1. 2024 veritabanından CARVERHESNO bul
  const result2024 = await prisma2024.$queryRaw`
    SELECT CARKOD, CARUNVAN, CARVERHESNO
    FROM CARKART
    WHERE CARKOD = ${userId}
  `;
  const carverhesno =
    result2024 && result2024.length > 0 ? result2024[0].CARVERHESNO : null;

  // 2. EDIS veritabanında aynı CARVERHESNO'ya sahip CARKOD'u bul
  let edisCarkod = null;
  if (carverhesno) {
    const resultEdis = await prismaEdis.$queryRaw`
      SELECT CARKOD, CARUNVAN, CARVERHESNO
      FROM CARKART
      WHERE CARVERHESNO = ${carverhesno}
    `;
    edisCarkod =
      resultEdis && resultEdis.length > 0 ? resultEdis[0].CARKOD : null;
  }

  return edisCarkod;
}
