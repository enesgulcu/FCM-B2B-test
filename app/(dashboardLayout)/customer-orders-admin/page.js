import CustomerOrdersContainer from "@/containers/AdminCustomerOrders";
import React, { Suspense } from "react";
import Loading from "@/components/Loading";

function page() {
  return (
    <Suspense fallback={<Loading />}>
      <CustomerOrdersContainer />
    </Suspense>
  );
}

export default page;
