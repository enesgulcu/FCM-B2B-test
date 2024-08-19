import React, { useState } from "react";

const Modal = ({ isOpen, onClose, onConfirm, title, content }) => {
  const [cancelReason, setCancelReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(cancelReason);
    setCancelReason("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{content}</p>
        <input
          type="text"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="İptal sebebini giriniz"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            İptal
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Onayla
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
