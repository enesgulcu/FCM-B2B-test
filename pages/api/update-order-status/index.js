import { updateOrderStatus } from "@/services/serviceOperations";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { ORDERNO, newStatus } = req.body;

  if (!ORDERNO || !newStatus) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const result = await updateOrderStatus("ALLORDERS", { ORDERNO }, newStatus);

    if (result.error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to update order status",
          error: result.error,
        });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Order status updated successfully",
        data: result,
      });
  } catch (error) {
    console.error("Server error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
}
