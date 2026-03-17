import { getAllData } from "@/services/serviceOperations";

const handler = async (req, res) => {
  if (req.method === "GET") {
    // 'edis' string değeri EDIS veritabanını seçer, aksi halde yıl olarak parse edilir
    const yearParam = req.query.year;
    const yearOrDb = yearParam === 'edis' ? 'edis' : (Number(yearParam) || 2023);
    const data = await getAllData("FATFIS", yearOrDb);

    return res.status(200).json({ message: "Method GET", data });
  }
};

export default handler;
