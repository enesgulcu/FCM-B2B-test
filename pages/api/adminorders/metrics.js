import { getAdminOrdersMetrics } from "@/services/serviceOperations/optimizedQueries";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const {
      filterBy,
      searchCarkod,
      searchUnvan,
      rowsPerPage = "10",
    } = req.query;

    const parsedRowsPerPage = parseInt(rowsPerPage, 10);

    const metrics = await getAdminOrdersMetrics({
      filterBy,
      searchCarkod,
      searchUnvan,
      rowsPerPage: Number.isNaN(parsedRowsPerPage)
        ? undefined
        : parsedRowsPerPage,
    });

    return res.status(200).json(metrics);
  } catch (error) {
    console.error("Error fetching admin order metrics:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handler;
