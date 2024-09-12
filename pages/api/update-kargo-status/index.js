import { updateKargoStatus } from "@/services/serviceOperations";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { ORDERNO, KARGO, KARGOTAKIPNO, ORDERSTATUS } = req.body;

  if (!ORDERNO || !ORDERSTATUS) {
    return res
      .status(400)
      .json({
        success: false,
        message: "ORDERNO and ORDERSTATUS are required",
      });
  }

  try {
    const result = await updateKargoStatus(
      "ALLORDERS",
      { ORDERNO: ORDERNO },
      { KARGO, KARGOTAKIPNO, ORDERSTATUS }
    );

    if (result.error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update kargo status",
        error: result.error,
      });
    }

    res.status(200).json({
      success: true,
      message: "Kargo status updated successfully",
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
