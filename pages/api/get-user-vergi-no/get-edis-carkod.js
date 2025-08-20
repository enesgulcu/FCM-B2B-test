import { prisma2024, prismaEdis } from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId gerekli" });

    // 1. 2024 veritabanından CARVERHESNO bul
    const result2024 = await prisma2024.$queryRaw`
      SELECT CARVERHESNO FROM CARKART WHERE CARKOD = ${userId}
    `;
    const carverhesno =
      result2024 && result2024.length > 0 ? result2024[0].CARVERHESNO : null;

    // 2. EDIS veritabanında aynı CARVERHESNO'ya sahip CARKOD'u bul
    let edisCarkod = null;
    if (carverhesno) {
      const resultEdis = await prismaEdis.$queryRaw`
        SELECT CARKOD FROM CARKART WHERE CARVERHESNO = ${carverhesno}
      `;
      edisCarkod =
        resultEdis && resultEdis.length > 0 ? resultEdis[0].CARKOD : null;
    }

    return res.status(200).json({ edisCarkod });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/*

Bu endpoint, 2024 veritabanındaki bir kullanıcı ID'sini kullanarak, önce o kullanıcının CARVERHESNO'sunu buluyor, sonra bu CARVERHESNO ile EDIS veritabanında karşılık gelen CARKOD'u buluyor.
KucukAriBillingDataTable.jsx dosyasında kullanılıyor.
*/
