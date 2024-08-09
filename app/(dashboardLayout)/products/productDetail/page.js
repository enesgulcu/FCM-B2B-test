"use client";
import ProductDetail from "@/components/ProductList/ProdcutDetail";
import React, { useEffect, useState } from "react";
import { getAPI } from "@/services/fetchAPI";
import Loading from "@/components/Loading";
import useProductDetailStore from "@/utils/productDetailStore";

function Page() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [img, setImg] = useState(""); // resim path'i
  const {productDetail} = useProductDetailStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAPI("/products");//ürünleri al
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err);
        setLoading(false);
      }

      try {
        const imageResponse = await fetch("/data.json");// resimleri al
        const imageData = await imageResponse.json();

        // productDetail/stkkod' in resmini bul
        const matchedImage = imageData.find(
          (item) => item.stkkod === productDetail
        );
        if (matchedImage) {
          setImg(matchedImage.path); // bulduğunda resmi ekle
        }
      } catch (err) {
        console.error("Resimler yüklenirken hata oluştu:", err);
        setError(err);
      }
    };

    fetchData();
  }, [productDetail]); 

  if (loading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  const product = products.find(
    (product) => product.STKKOD.toString() === productDetail
  );

  return <ProductDetail product={product} img={img} />; // resmi prop olarak ver
}

export default Page;
