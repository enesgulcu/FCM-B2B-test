import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Sadece POST isteği desteklenir." });
  }

  const { ORDERNO, REFNO } = req.body;

  if (!ORDERNO || !REFNO) {
    return res
      .status(400)
      .json({ success: false, message: "Eksik sipariş bilgisi." });
  }

  try {
    const order = await prisma.aLLORDERS.findFirst({
      where: {
        ORDERNO: ORDERNO,
        REFNO: REFNO,
      },
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Sipariş bulunamadı." });
    }

    if (order.ORDERSTATUS === "Fiş Çıkartıldı") {
      return res.status(400).json({
        success: false,
        message: "Bu siparişin fişi çıkartıldığı için iptal edilemez.",
      });
    }

    if (order.ORDERSTATUS === "İptal") {
      return res.status(400).json({
        success: false,
        message: "Bu sipariş zaten iptal edilmiş.",
      });
    }

    await prisma.aLLORDERS.updateMany({
      where: {
        ORDERNO: ORDERNO,
        REFNO: REFNO,
      },
      data: {
        ORDERSTATUS: "İptal",
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "Sipariş başarıyla iptal edildi." });
  } catch (error) {
    console.error("Sipariş iptal hatası:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Sunucu hatası.",
        error: error.message,
      });
  }
}
