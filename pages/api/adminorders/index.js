import { getAdminOrdersOptimized } from "@/services/serviceOperations/optimizedQueries";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const {
        page = "1",
        filterBy,
        includeStatusCounts = "false",
        searchCarkod,
        searchUnvan,
      } = req.query;
      const pageNumber = parseInt(page, 10);
      const rowsPerPage = 10;
      const shouldIncludeStatusCounts = includeStatusCounts === "true";

      // Optimize edilmiş sorgu ile veriyi al
      const result = await getAdminOrdersOptimized({
        page: pageNumber,
        rowsPerPage,
        filterBy,
        includeStatusCounts: shouldIncludeStatusCounts,
        searchCarkod,
        searchUnvan,
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export default handler;
