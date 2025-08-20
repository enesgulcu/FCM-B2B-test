import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { carkod } = req.query;

    if (!carkod) {
      return res
        .status(400)
        .json({ error: "carkod parametresi gerekli" });
    }

    // CARKOD'u olduğu gibi kullan (boşluklarla birlikte)
    const data = await prisma.$queryRaw`
      SELECT CARKOD, CARUNVAN, CARUNVAN3
      FROM CARKART
      WHERE CARKOD = ${carkod}
    `;

    console.log("📧 CARKART query result:", data);

    // CARUNVAN3'ü EMAIL olarak döndür
    const result = data.map(item => ({
      CARKOD: item.CARKOD,
      CARUNVAN: item.CARUNVAN,
      EMAIL: item.CARUNVAN3
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ CARKART API Error:", error);
    return res.status(500).json({ error: "Veri alınamadı" });
  }
}