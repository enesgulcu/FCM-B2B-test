import { create } from "zustand";

const useProductDetailStore = create((set) => ({
  productDetail: "",
  productStatus: "",
  changeProductDetail: (detail, status) =>
    set({ productDetail: detail, productStatus: status }),
}));

export default useProductDetailStore;
