import {create} from "zustand";

const useProductDetailStore = create((set)=>({
  productDetail : "1H1",// STKKOD değeri alır
  changeProductDetail : (newProductDetail)=> set({productDetail:newProductDetail}) // productDetail'i değiştirir
}))

export default useProductDetailStore;