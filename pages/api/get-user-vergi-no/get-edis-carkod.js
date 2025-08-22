import { prisma2024, prismaEdis } from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId gerekli" });

    // 1) 2024 veritabanından kullanıcının CARUNVAN3 (email) bilgisini al
    const userInfo2024 = await prisma2024.$queryRaw`
      SELECT CARUNVAN3, CARVERHESNO, CARUNVAN FROM CARKART WHERE CARKOD = ${userId}
    `;

    const emailCandidate =
      userInfo2024 && userInfo2024.length > 0 ? userInfo2024[0].CARUNVAN3 : null;
    const carverhesnoCandidate =
      userInfo2024 && userInfo2024.length > 0 ? userInfo2024[0].CARVERHESNO : null;
    const userNameCandidate =
      userInfo2024 && userInfo2024.length > 0 ? userInfo2024[0].CARUNVAN : null;

    let edisCarkod = null;
    let disambiguation = null;

    // 2) Öncelik: EDIS'te CARUNVAN3 eşleşmesi ile CARKOD bul
    if (emailCandidate) {
      const candidatesByEmail = await prismaEdis.$queryRaw`
        SELECT CARKOD, CARUNVAN FROM CARKART WHERE CARUNVAN3 = ${emailCandidate}
      `;
      if (candidatesByEmail && candidatesByEmail.length > 0) {
        // a) Adaylar arasında userId ile aynı olan varsa onu seç
        const sameAsUser = candidatesByEmail.find((r) => r.CARKOD === userId);
        if (sameAsUser) {
          edisCarkod = sameAsUser.CARKOD;
          disambiguation = "sameUserId";
        } else if (candidatesByEmail.length > 1) {
          // b) CARHAR'da en güncel hareketi olan adayı seç
          let best = null;
          for (const c of candidatesByEmail) {
            const lastMov = await prismaEdis.$queryRaw`
              SELECT TOP 1 CARHARTAR FROM CARHAR WHERE CARHARCARKOD = ${c.CARKOD} ORDER BY CARHARTAR DESC
            `;
            const lastDate = lastMov && lastMov.length > 0 ? new Date(lastMov[0].CARHARTAR) : null;
            if (!best || (lastDate && best.lastDate && lastDate > best.lastDate) || (lastDate && !best.lastDate)) {
              best = { code: c.CARKOD, lastDate };
            }
          }
          if (best && best.code) {
            edisCarkod = best.code;
            disambiguation = "latestActivity";
          } else {
            // c) Faaliyet bulunamazsa ilk adayı seç
            edisCarkod = candidatesByEmail[0].CARKOD;
            disambiguation = "firstCandidate";
          }
        } else {
          // Tek aday varsa direkt al
          edisCarkod = candidatesByEmail[0].CARKOD;
          disambiguation = "singleMatch";
        }
      }
    }

    // 3) Fallback: EDIS'te CARVERHESNO eşleşmesi ile CARKOD bul
    if (!edisCarkod && carverhesnoCandidate) {
      const resultByVNo = await prismaEdis.$queryRaw`
        SELECT TOP 1 CARKOD FROM CARKART WHERE CARVERHESNO = ${carverhesnoCandidate}
      `;
      if (resultByVNo && resultByVNo.length > 0) {
        edisCarkod = resultByVNo[0].CARKOD;
        disambiguation = disambiguation || "fallbackCarverhesno";
      }
    }

    return res.status(200).json({
      edisCarkod,
      matchedBy: edisCarkod ? (emailCandidate ? "CARUNVAN3" : "CARVERHESNO") : null,
      disambiguation,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/*

Bu endpoint, 2024 veritabanındaki bir kullanıcı ID'sinden (CARKOD) önce kullanıcının
CARUNVAN3 (email) ve CARVERHESNO değerlerini alır. EDIS tarafında öncelik email (CARUNVAN3)
eşleşmesindedir. Aynı email'e bağlı birden fazla EDIS CARKOD varsa seçim sırası:
  1) Oturumdaki userId ile aynı CARKOD
  2) CARHAR'da en güncel hareketi olan CARKOD
  3) Adaylar arasında ilk kayıt
Email ile bulunamazsa CARVERHESNO ile fallback yapılır. Response alanları: { edisCarkod, matchedBy, disambiguation }.
KucukAriBillingDataTable.jsx tarafından kullanılır.
*/
