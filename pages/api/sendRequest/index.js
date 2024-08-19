import { updateDataByAny } from "@/services/serviceOperations";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { orderNo, talep } = req.body;

  if (!orderNo || !talep) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const result = await updateDataByAny(
      "ALLORDERS",
      { ORDERNO: orderNo },
      { TALEP: talep }
    );

    if (result.error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update order request",
        error: result.error,
      });
    }

    res.status(200).json({
      success: true,
      message: "Order request updated successfully",
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
