import { getAllData } from "@/services/serviceOperations";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const data = await getAllData("ALLORDERS");
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export default handler;
