import CustomerOrdersContainer from "@/containers/CustomerOrders";
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
