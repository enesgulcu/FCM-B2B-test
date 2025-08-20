import { orders } from "@/components/CustomerOrders/data";
import OrderDetails from "@/components/CustomerOrders/OrderDetails";

export default async function Page({ params }) {
  const { orderDetails } = await params;
  const order = orders.find((order) => order?.id?.toString() === orderDetails);
  return <OrderDetails order={order} />;
}
