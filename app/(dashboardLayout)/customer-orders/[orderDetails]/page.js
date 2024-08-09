import React from 'react'
import OrderDetails from '@/components/CustomerOrders/OrderDetails'
import { orders } from '@/components/CustomerOrders/data'

console.log(orders);

function page({params:{orderDetails}}) {
  const order = orders.find((order) => order?.id?.toString() === orderDetails)
  return (
   <OrderDetails order={order}/>
  )
}



export default page