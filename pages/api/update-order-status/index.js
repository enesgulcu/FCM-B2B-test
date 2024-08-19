import { updateOrderStatus } from "@/services/serviceOperations";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { ORDERNO, newStatus, REFNO } = req.body;

  // Her bir alan için ayrı kontrol yapalım
  if (!ORDERNO) {
    return res
      .status(400)
      .json({ success: false, message: "ORDERNO is missing" });
  }
  if (!newStatus) {
    return res
      .status(400)
      .json({ success: false, message: "newStatus is missing" });
  }
  if (!REFNO) {
    return res
      .status(400)
      .json({ success: false, message: "REFNO is missing" });
  }

  try {
    const result = await updateOrderStatus(
      "ALLORDERS",
      { ORDERNO, REFNO },
      newStatus
    );

    if (result.error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update order status",
        error: result.error,
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
