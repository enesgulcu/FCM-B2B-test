import { prisma } from "@/lib/prisma";
import { updateOrderStatus } from "@/services/serviceOperations";

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

    // ✅ YENİ: İrsaliye tablosunda kayıt kontrolü
    const irsfisRecord = await prisma.IRSFIS.findFirst({
      where: {
        IRSFISREFNO: REFNO,
      },
    });

    if (!irsfisRecord) {
      return res.status(400).json({
        success: false,
        message:
          "Bu sipariş için irsaliye kaydı bulunamadı. İptal işlemi yapılamaz.",
      });
    }

    // İrsaliye kaydı silinmiş veya iptal edilmiş mi kontrol et
    if (irsfisRecord.IRSFISIPTALFLAG === 1) {
      return res.status(400).json({
        success: false,
        message:
          "Bu siparişin irsaliyesi zaten iptal edilmiş. İptal işlemi yapılamaz.",
      });
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

    // Admin akışı ile aynı: ALLORDERS durumunu "İptal" yap ve ilişkili tabloları güncelle
    const result = await updateOrderStatus(
      "ALLORDERS",
      { ORDERNO: ORDERNO, REFNO: REFNO },
      "İptal"
    );

    if (result?.error) {
      return res.status(500).json({ success: false, message: result.error });
    }

    return res
      .status(200)
      .json({ success: true, message: "Sipariş başarıyla iptal edildi." });
  } catch (error) {
    console.error("Sipariş iptal hatası:", error);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası.",
      error: error.message,
    });
  }
}
