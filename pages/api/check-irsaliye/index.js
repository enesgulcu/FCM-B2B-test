import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { refNo } = req.query;

  if (!refNo) {
    return res.status(400).json({
      exists: false,
      cancellable: false,
      message: "REFNO gerekli",
    });
  }

  try {
    // IRSFIS tablosunda kayıt var mı kontrol et
    const irsfisRecord = await prisma.IRSFIS.findFirst({
      where: {
        IRSFISREFNO: parseInt(refNo),
      },
    });

    if (!irsfisRecord) {
      return res.status(200).json({
        exists: false,
        cancellable: false,
        isCancelled: false,
        message: "İrsaliye kaydı bulunamadı",
      });
    }

    // İrsaliye iptal edilmiş mi kontrol et
    const isCancelled = irsfisRecord.IRSFISIPTALFLAG === 1;

    return res.status(200).json({
      exists: true,
      cancellable: !isCancelled,
      isCancelled: isCancelled,
      message: isCancelled
        ? "İrsaliye zaten iptal edilmiş"
        : "İrsaliye kaydı aktif",
    });
  } catch (error) {
    console.error("İrsaliye kontrol hatası:", error);
    return res.status(500).json({
      exists: false,
      cancellable: false,
      message: "Sunucu hatası",
      error: error.message,
    });
  }
}
