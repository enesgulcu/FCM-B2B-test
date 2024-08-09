"use client";
import React, { useState, useEffect } from "react";
import { getAPI } from "@/services/fetchAPI";

function Ornek() {
  const [urunler, setUrunler] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAPI("/urun");
        setUrunler(data.data);
      } catch (error) {
        console.error("Veri çekme hatası: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-[1188px]">
      <h2>Ürün Listesi</h2>
      <ul>
        {urunler.map((urun) => (
          <li key={urun.STKKOD}>
            <strong>{urun.STKKOD}</strong>: {urun.STKCINSI} - {urun.STKOZKOD1} -{" "}
            {urun.STKOZKOD3}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ornek;
