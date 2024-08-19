import { updateOrderStatus } from "@/services/serviceOperations";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { orderNo, cancelReason } = req.body;

  if (!orderNo) {
    return res.status(400).json({ message: "Order number is required" });
  }

  try {
    const result = await updateOrderStatus(
      "ALLORDERS",
      { ORDERNO: orderNo },
      "İptal",
      cancelReason
    );

    if (result.error) {
      throw new Error(result.error);
    }

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res
      .status(500)
      .json({ message: "An error occurred while cancelling the order" });
  }
}
