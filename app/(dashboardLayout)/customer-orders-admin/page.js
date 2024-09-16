import CustomerOrdersContainer from "@/containers/AdminCustomerOrders";
import React from "react";

function page() {
  return (
    <Suspense fallback={<Loading />}>
      <CustomerOrdersContainer />
    </Suspense>
  );
}

export default page;
