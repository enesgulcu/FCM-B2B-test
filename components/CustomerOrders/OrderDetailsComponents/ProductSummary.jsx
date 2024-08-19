import ProductsTable from "./ProductsTable";

export default function ProductSummary({ orders }) {
  return (
    <>
      <div id="product-summary" className="mt-4 rounded-xl shadow-md">
        <div
          id="title-section"
          className="flex justify-between px-2 gap-1 items-center md:py-2"
        >
          <h1 className="text-sm md:text-base text-center font-bold">
            Ürün Özeti
          </h1>
        </div>
        <div className="w-full mb-12">
          <ProductsTable orders={orders} />
        </div>
      </div>
    </>
  );
}
