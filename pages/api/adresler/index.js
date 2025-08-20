import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { carkod, adrKod1 } = req.query;
    const searchParam = carkod || adrKod1;

    if (!searchParam) {
      return res
        .status(400)
        .json({ error: "carkod veya adrKod1 parametresi gerekli" });
    }

    const data = await prisma.$queryRaw`
      SELECT *
      FROM ADRESLER
      WHERE ADRKOD1 = ${searchParam}
    `;

    return res.status(200).json(data);
  } catch (error) {
    console.error("Adresler API Error:", error);
    return res.status(500).json({ error: "Veri alınamadı" });
  }
}
