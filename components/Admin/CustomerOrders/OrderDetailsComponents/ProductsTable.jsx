import { formatPrice } from "@/utils/formatPrice";

export default function ProductsTable({ orders }) {
  return (
    <div id="table">
      <div className="bg-white rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-xs md:text-sm p-1">ÜRÜN</th>
              <th className="text-xs md:text-sm p-1">BİRİM FİYAT</th>
              <th className="text-xs md:text-sm p-1">İSK.</th>
              <th className="text-xs md:text-sm p-1">ADET</th>
              <th className="text-xs md:text-sm p-1">TOPLAM</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-b hover:bg-gray-200">
                <td className="text-xs md:text-sm text-center py-0.5 md:py-2 px-1">
                  {order.STKNAME}
                </td>
                <td className="text-xs md:text-sm text-center py-0.5 px-1">
                  {formatPrice(order.STKBIRIMFIYAT)}
                </td>
                <td className="text-xs md:text-sm text-center py-0.5 px-1">
                  %0
                </td>
                <td className="text-xs md:text-sm text-center py-0.5 px-1">
                  {order.STKADET}
                </td>
                <td className="text-xs md:text-sm text-center py-0.5 px-1">
                  {formatPrice(order.STKBIRIMFIYATTOPLAM)} ₺
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
