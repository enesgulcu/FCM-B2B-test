import React from "react";
import OrderDetails from "@/components/Admin/CustomerOrders/OrderDetails";
import { orders } from "@/components/Admin/CustomerOrders/data";



function page({ params: { orderDetails } }) {
  const order = orders.find((order) => order?.id?.toString() === orderDetails);
  return <OrderDetails order={order} />;
}

export default page;
