import CustomerOrdersList from "@/components/CustomerOrders/CustomerOrdersList";
import React from "react";
const CustomerOrdersContainer = () => {
  return (
    <div className="py-5 px-5 bg-BaseLight text-DarkBlue min-h-screen">
      <CustomerOrdersList />
    </div>
  );
};

export default CustomerOrdersContainer;
