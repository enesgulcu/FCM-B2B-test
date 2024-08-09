import React, { useState } from "react";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { FaEye } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import RequestModal from "./RequestModal";
import OrderCancellation from "./OrderCancallation";
import Link from "next/link";

const CustomerOrdersListTable = ({ orders, products }) => {
  const [isChecked, setIsChecked] = useState(orders.map(() => false));
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isOpenReqModal, setIsOpenReqModal] = useState(false);
  const [isOpenOrderCanModal, setIsOpenOrderCanModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // statu Renkleri
  const statusColors = {
    Beklemede: "bg-[#e5e5e5] text-[#80808b]",
    Hazırlanıyor: "bg-[#c7d8e2] text-[#324356]",
    "Ödeme Bekleniyor": "bg-[#f8dda5] text-[#876b17]",
    "Sipariş Oluşturuldu": "bg-[#f8dda5] text-[#876b17]",
    Tamamlandı: "bg-[#c7e1c7] text-[#5d7b45]",
    İptal: "bg-[#e3e5e3] text-[#7a7a7c]",
    Başarısız: "bg-[#eaa4a4] text-[#762024]",
  };

  // single check process for inputs
  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...isChecked];
    newCheckedItems[index] = !newCheckedItems[index];
    setIsChecked(newCheckedItems);

    const allChecked = newCheckedItems.every((item) => item);
    setIsAllChecked(allChecked);
  };
  // all check process for "select all" input
  const handleAllCheck = () => {
    const newAllCheckState = !isAllChecked;
    setIsAllChecked(newAllCheckState);

    const newCheckedElements = orders.map(() => newAllCheckState);
    return setIsChecked(newCheckedElements);
  };

  // const handleSelectAllCheckboxChange = (event) => {
  //   const { checked } = event.target;
  //   setSelectAllChecked(checked);

  //   const updatedSelectedOrderCheckboxes = {};
  //   orders.forEach((order) => {
  //     updatedSelectedOrderCheckboxes[order.id] = checked;
  //   });
  //   setSelectedOrderCheckboxes(updatedSelectedOrderCheckboxes);
  // };

  // const handleSingleCheckboxChange = (orderId) => {
  //   setSelectedOrderCheckboxes((prevSelectedOrderCheckboxes) => ({
  //     ...prevSelectedOrderCheckboxes,
  //     [orderId]: !prevSelectedOrderCheckboxes[orderId],
  //   }));
  // };
  const handleOpenRequestModal = (order) => {
    setSelectedOrder(order);
    setIsOpenReqModal(true);
  };

  const handleOrderCancellation = (order) => {
    setSelectedOrder(order);
    setIsOpenOrderCanModal(true);
  };

  return (
    <>
      <div className="overflow-x-auto overflow-y-hidden border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-NavyBlue text-white ">
            <tr className="text-center">
              <th className="px-6 py-3 text-center text-base font-medium  ">
                Sipariş No
              </th>

              <th className="px-6 py-3  text-base font-medium  text-center">
                Tarih
              </th>
              <th className="px-6 py-3  text-base font-medium">Durum</th>
              <th className="px-6 py-3  text-base font-medium">Ürün Adedi</th>
              <th className="px-6 py-3  text-base font-medium">Toplam</th>
              <th className="px-6 py-3 text-left text-base font-medium">
                Eylemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 ">
            {orders.map(
              (order, index) => (
                console.log(order),
                (
                  <tr
                    key={order.ID}
                    className={`${
                      index % 2 === 1 ? "bg-white" : "bg-gray-50"
                    } text-center`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap hover:scale-105 transition-all ">
                      <Link
                        href={{
                          pathname: `/customer-orders/${order.ID}`,
                          query: {
                            orderno: order.ORDERNO,
                          },
                        }}
                      >
                        <div className="bg-gray-100 p-2 rounded">
                          <div>{order.ORDERNO}</div>
                          <div className="text-LightBlue font-bold">
                            {order.STKNAME}
                          </div>
                        </div>
                      </Link>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap ">
                      <div className="flex flex-col justify-center items-center">
                        <div>
                          {order.ORDERGUN}.{order.ORDERAY}.{order.ORDERYIL}
                        </div>
                        <div className="bg-gray-200 rounded px-2">
                          {order.ORDERSAAT && order.ORDERSAAT.substring(0, 5)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-block rounded-sm px-2 py-1  ${
                          statusColors[order.ORDERSTATUS]
                        }`}
                      >
                        {order.ORDERSTATUS}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Intl.NumberFormat("tr-TR", {
                        style: "decimal",
                      }).format(order.STKADET)}{" "}
                      Adet
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Intl.NumberFormat("tr-TR", {
                        style: "decimal",
                      }).format(order.STKBIRIMFIYATTOPLAM)}
                      ₺
                    </td>
                    <td className="px-6 py-4 flex justify-center whitespace-nowrap flex-col  gap-2 ">
                      <button
                        className="bg-NavyBlue/75 p-2 rounded-md hover:bg-NavyBlue text-white flex items-center w-36 justify-center"
                        onClick={() => handleOpenRequestModal(order)}
                      >
                        <HiOutlineDocumentAdd /> <span>Talep oluştur</span>
                      </button>

                      <Link
                        href={{
                          pathname: `/customer-orders/${order.ID}`,
                          query: {
                            orderno: order.ORDERNO,
                          },
                        }}
                      >
                        <button className="bg-gray-300 p-2 rounded-md hover:bg-gray-400 flex items-center w-36">
                          <FaEye /> <span>Sipariş İncele</span>
                        </button>
                      </Link>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
      {isOpenReqModal && (
        <RequestModal
          isOpen={isOpenReqModal}
          setIsOpen={setIsOpenReqModal}
          order={selectedOrder}
        />
      )}
      {isOpenOrderCanModal && (
        <OrderCancellation
          isOpen={isOpenOrderCanModal}
          setIsOpen={setIsOpenOrderCanModal}
          order={selectedOrder}
        />
      )}
    </>
  );
};

export default CustomerOrdersListTable;
