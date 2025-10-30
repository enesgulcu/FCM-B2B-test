import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getDataByManyCombined } from "@/services/serviceOperations";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Query parametreden orderno'yu al
    const { orderno } = req.query;

    if (!orderno) {
      return res.status(400).json({ message: "Order number is required" });
    }

    // Backend'de filtreleme yap - sadece istenen sipariş
    const orders = await getDataByManyCombined("ALLORDERS", {
      ORDERNO: orderno,
    });

    if (orders.error) {
      throw new Error(orders.error);
    }

    // Cache kontrol et
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.status(200).json(orders);
  } catch (error) {
    console.error("API Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
