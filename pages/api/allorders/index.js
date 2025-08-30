import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getAllDataCombined, getDataByManyCombined } from "@/services/serviceOperations";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let orders;

    try {
      if (session.user.role === "Admin") {
        // Admin için 2025 + 2024 tüm siparişleri getir
        orders = await getAllDataCombined("ALLORDERS");
      } else {
        // Normal kullanıcı için sadece kendi siparişlerini getir (2025 + 2024)
        orders = await getDataByManyCombined("ALLORDERS", { CARKOD: session.user.id });
      }

      if (orders.error) {
        throw new Error(orders.error);
      }
    } catch (dataError) {
      console.error("Data Fetch Error:", dataError);
      return res
        .status(500)
        .json({ message: "Error fetching orders", error: dataError.message });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("API Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
