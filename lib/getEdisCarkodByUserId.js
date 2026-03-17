// lib/getEdisCarkodByUserId.js
import { prisma, prismaEdis } from "@/lib/prisma";

export async function getEdisCarkodByUserId(userId) {
  // 1. ADNAN (ETA_ADNAN_2025) veritabanından kullanıcının bilgilerini al
  const resultAdnan = await prisma.$queryRaw`
    SELECT CARKOD, CARUNVAN, CARUNVAN3, CARVERHESNO
    FROM CARKART
    WHERE CARKOD = ${userId}
  `;
  
  const email = resultAdnan && resultAdnan.length > 0 ? resultAdnan[0].CARUNVAN3 : null;
  const carunvan = resultAdnan && resultAdnan.length > 0 ? resultAdnan[0].CARUNVAN : null;
  const carverhesno = resultAdnan && resultAdnan.length > 0 ? resultAdnan[0].CARVERHESNO : null;

  // Normalize fonksiyonu
  const normalize = (str) => (str || "").trim().toLowerCase().replace(/\s+/g, " ");

  let edisCarkod = null;

  // 2. Öncelik: EDIS veritabanında CARUNVAN3 (email) eşleşmesi ile CARKOD bul
  if (email && email.trim() !== "") {
    const resultByEmail = await prismaEdis.$queryRaw`
      SELECT CARKOD, CARUNVAN, CARUNVAN3
      FROM CARKART
      WHERE CARUNVAN3 = ${email}
    `;
    if (resultByEmail && resultByEmail.length > 0) {
      if (resultByEmail.length === 1) {
        edisCarkod = resultByEmail[0].CARKOD;
      } else {
        // Birden fazla aday varsa, CARUNVAN (firma adı) eşleşmesine bak
        const normalizedUserName = normalize(carunvan);
        const matchByName = resultByEmail.find(
          (r) => normalize(r.CARUNVAN) === normalizedUserName
        );
        edisCarkod = matchByName ? matchByName.CARKOD : resultByEmail[0].CARKOD;
      }
    }
  }

  // 3. Fallback: Email ile bulunamazsa CARVERHESNO ile dene
  if (!edisCarkod && carverhesno && carverhesno.trim() !== "") {
    const resultByVNo = await prismaEdis.$queryRaw`
      SELECT CARKOD, CARUNVAN, CARVERHESNO
      FROM CARKART
      WHERE CARVERHESNO = ${carverhesno}
    `;
    edisCarkod = resultByVNo && resultByVNo.length > 0 ? resultByVNo[0].CARKOD : null;
  }

  return edisCarkod;
}
