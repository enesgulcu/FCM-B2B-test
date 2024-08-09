import { getAllData, getDataByMany } from "@/services/serviceOperations";

const handler = async (req, res) => {
  if (req.method === "POST") {
    return res.status(200).json({ message: "Method POST" });
  }
  if (req.method === "GET") {
    const data = await getDataByMany("STKKART", { STKOZKOD1: "A" });
    // console.log("data: ", data);

    return res.status(200).json({ message: "Method GET", data });
  }
};

export default handler;
