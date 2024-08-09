import { getAllData } from "@/services/serviceOperations";

const handler = async (req, res) => {
  if (req.method === "POST") {
    return res.status(200).json({ message: "Method POST" });
  }
  if (req.method === "GET") {
    const data = await getAllData("CARKART");
    // console.log("data: ",data)

    return res.status(200).json({ message: "Method GET", data });
  }
};

export default handler;
