import { getAllData } from "@/services/serviceOperations";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const year = Number(req.query.year) || 2023;
    const data = await getAllData("FATFIS", year);

    return res.status(200).json({ message: "Method GET", data });
  }
};

export default handler;
