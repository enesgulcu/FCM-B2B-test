import { prisma, prismaEdis } from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId gerekli" });

    // 1) ADNAN (ETA_ADNAN_2025) veritabanından kullanıcının bilgilerini al
    let userInfo = await prisma.$queryRaw`
      SELECT CARUNVAN3, CARVERHESNO, CARUNVAN FROM CARKART WHERE CARKOD = ${userId}
    `;

    const emailCandidate =
      userInfo && userInfo.length > 0 ? userInfo[0].CARUNVAN3?.trim() : null;
    const carverhesnoCandidate =
      userInfo && userInfo.length > 0 ? userInfo[0].CARVERHESNO?.trim() : null;
    const userNameCandidate =
      userInfo && userInfo.length > 0 ? userInfo[0].CARUNVAN?.trim() : null;

    let edisCarkod = null;
    let disambiguation = null;
    let debugInfo = {
      adnanUserId: userId,
      adnanEmail: emailCandidate,
      adnanCarunvan: userNameCandidate,
      adnanCarverhesno: carverhesnoCandidate,
      edisMatches: []
    };

    // 2) Öncelik: EDIS'te CARUNVAN3 (email) eşleşmesi ile CARKOD bul
    if (emailCandidate) {
      const candidatesByEmail = await prismaEdis.$queryRaw`
        SELECT CARKOD, CARUNVAN, CARUNVAN3 FROM CARKART WHERE CARUNVAN3 = ${emailCandidate}
      `;
      
      debugInfo.edisMatches = candidatesByEmail?.map(c => ({
        CARKOD: c.CARKOD,
        CARUNVAN: c.CARUNVAN?.trim()
      })) || [];
      
      if (candidatesByEmail && candidatesByEmail.length > 0) {
        if (candidatesByEmail.length === 1) {
          // Tek aday varsa direkt al
          edisCarkod = candidatesByEmail[0].CARKOD;
          disambiguation = "singleMatch";
        } else {
          // Birden fazla aday varsa, CARUNVAN (firma adı) eşleşmesine bak
          // Normalize fonksiyonu: boşlukları ve özel karakterleri temizle
          const normalize = (str) => (str || "").trim().toLowerCase().replace(/\s+/g, " ");
          const normalizedUserName = normalize(userNameCandidate);
          
          const matchByName = candidatesByEmail.find(
            (r) => normalize(r.CARUNVAN) === normalizedUserName
          );
          
          // İçerme kontrolü de yap (kısmi eşleşme)
          const matchByPartialName = !matchByName ? candidatesByEmail.find(
            (r) => normalize(r.CARUNVAN).includes(normalizedUserName) || 
                   normalizedUserName.includes(normalize(r.CARUNVAN))
          ) : null;
          
          if (matchByName) {
            edisCarkod = matchByName.CARKOD;
            disambiguation = "matchedByCarunvan";
          } else if (matchByPartialName) {
            edisCarkod = matchByPartialName.CARKOD;
            disambiguation = "matchedByPartialCarunvan";
          } else {
            // CARUNVAN eşleşmesi yoksa, en güncel hareketi olan adayı seç
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
              edisCarkod = candidatesByEmail[0].CARKOD;
              disambiguation = "firstCandidate";
            }
          }
        }
      }
    }

    // 3) Fallback: EDIS'te CARVERHESNO eşleşmesi ile CARKOD bul
    if (!edisCarkod && carverhesnoCandidate) {
      const resultByVNo = await prismaEdis.$queryRaw`
        SELECT TOP 1 CARKOD, CARUNVAN FROM CARKART WHERE CARVERHESNO = ${carverhesnoCandidate}
      `;
      if (resultByVNo && resultByVNo.length > 0) {
        edisCarkod = resultByVNo[0].CARKOD;
        disambiguation = "fallbackCarverhesno";
      }
    }

    return res.status(200).json({
      edisCarkod,
      matchedBy: edisCarkod ? (emailCandidate ? "CARUNVAN3" : "CARVERHESNO") : null,
      disambiguation,
      debug: debugInfo
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
