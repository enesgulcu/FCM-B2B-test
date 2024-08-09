"use client";
import React, { useState, useEffect } from "react";
import ProductsFilter from "./ProductsFilter";
import ProductsTable from "./ProdcutsTable";
import { getAPI } from "../../services/fetchAPI/index";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageMap, setImageMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAPI("/products");
        if (!response) {
          throw new Error("API error");
        }
        const allProducts = response.data;
        const filteredProducts = allProducts.filter(
          (product) => product.STKOZKOD1 === "A"
        );
        setProducts(filteredProducts);
        setFilteredProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        console.error("Data fetching error: ", error);
      }
    };
    const fetchImages = async () => {
      try {
        const imageResponse = await fetch("/data.json");
        const imageData = await imageResponse.json();
  
        // Resim eşleştirmelerini oluştur
        const imgMap = {};
        imageData.forEach((item) => {
          imgMap[item.stkkod] = item.path;
        });
        setImageMap(imgMap);        
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    fetchImages();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = products
      .filter((product) => product?.STKOZKOD1 === "A")
      .filter(
        (product) =>
          product.STKCINSI?.toLowerCase().includes(term) ||
          product.STKKOD?.toLowerCase().includes(term) ||
          product.STOK?.toLowerCase().includes(term) ||
          product.FIYAT?.toString().includes(term) ||
          product.STKOZKOD3?.toLowerCase().includes(term) ||
          product.CARGRADE?.toString().includes(term)
      );

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <>
      <div className="justify-between flex flex-wrap md:flex-nowrap space-y-4 md:space-y-0">
        <div className="text-3xl">Ürünler</div>
        <div className="flex w-72">
          <form action="" className="flex gap-2">
            <input
              type="text"
              className="p-2 border rounded-md w-72"
              placeholder="Ürün Ara..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </form>
        </div>
      </div>
      <ProductsFilter
        filteredProducts={filteredProducts}
        setFilteredProducts={setFilteredProducts}
        paginate={paginate}
        currentPage={currentPage}
        productsPerPage={productsPerPage}
        products={products}
        setLoading={setLoading}
        setCurrentPage={setCurrentPage}
        setProducts={setProducts}
      />
      <ProductsTable currentProducts={currentProducts} loading={loading} img={imageMap} />
    </>
  );
}

export default ProductList;
