import { getAllData, getDataByMany } from "@/services/serviceOperations";

const handler = async (req, res) => {
  if (req.method === "POST") {
    return res.status(200).json({ message: "Method POST" });
  }
  if (req.method === "GET") {
    try {
      const dataA = await getDataByMany("STKKART", { STKOZKOD1: "A" });
      const data2 = await getDataByMany("STKKART", { STKOZKOD1: "2" });

      const combinedData = [...dataA, ...data2];

      return res
        .status(200)
        .json({ message: "Method GET", data: combinedData });
    } catch (error) {
      console.error("Error fetching data:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
};

export default handler;
