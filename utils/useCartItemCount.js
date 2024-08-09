import { useState, useEffect } from "react";

const useCartItemCount = () => {
    const [cartItemCount, setCartItemCount] = useState(0);

    const updateCartItemCount = () => {
        const itemCount = JSON.parse(localStorage.getItem("cart"))?.length || 0;
        setCartItemCount(itemCount);
    };

    useEffect(() => {
        // İlk değeri ayarla
        updateCartItemCount();

        // Her 1 saniyede bir güncelleme yap
        const intervalId = setInterval(updateCartItemCount, 1000);

        // Temizlik yap
        return () => clearInterval(intervalId);
    }, []);

    return cartItemCount;
};

export default useCartItemCount;
