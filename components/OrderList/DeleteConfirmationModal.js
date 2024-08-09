import React from "react";

const DeleteConfirmationModal = ({
  isOpen,
  setIsOpen,
  handleDelete,
  order,
}) => {
  if (!isOpen) return null;
  // console.log(order);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-50 absolute inset-0"></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-10">
        <h2 className="text-xl mb-4">
          <span className="border  p-2 rounded-md bg-LightBlue/40 cursor-not-allowed">
            {order.orderNumber}
          </span>{" "}
          numaralı siparişi silmek istiyor musunuz?
        </h2>
        <div className="flex justify-end space-x-3">
          <button
            className="bg-gray-300 p-2 rounded-lg hover:bg-gray-400"
            onClick={() => setIsOpen(false)}
          >
            İptal
          </button>
          <button
            className="bg-red-400 p-2 text-white rounded-lg hover:bg-red-500"
            onClick={() => {
              handleDelete(order);
              setIsOpen(false);
            }}
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
