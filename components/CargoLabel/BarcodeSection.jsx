import React, { useRef, useEffect, useMemo } from 'react';
import JsBarcode from 'jsbarcode';

const BarcodeSection = ({ cargoKey }) => {
  const barcodeRef = useRef(null);

  // 12 karakterlik referans kodu üretici
  const toFixed12 = (key) => {
    // 1) Temizle: tire/boşluk/altçizgi kaldır, sadece [A-Z0-9_], büyük harf
    let cleaned = (key || '')
      .replace(/[-\s_]/g, '')
      .replace(/[^\w]/g, '')
      .toUpperCase();

    // 2) Boşsa, 12 karakterlik yedek üret
    if (!cleaned) {
      // 'ORD' + zaman taban36 + dolgu => tam 12 karakter
      const seed = (Date.now().toString(36) + 'ORD').toUpperCase();
      cleaned = ('ORD' + seed).slice(0, 12);
    }

    // 3) 12’den uzunsa kes, kısaysa zaman+rastgele dolgu ile 12’ye tamamla
    if (cleaned.length > 12) {
      cleaned = cleaned.slice(0, 12);
    } else if (cleaned.length < 12) {
      const filler = (Date.now().toString(36) + Math.random().toString(36).slice(2)).toUpperCase();
      cleaned = (cleaned + filler).slice(0, 12);
    }

    return cleaned;
  };

  // cargoKey değişince hesapla
  const refCode = useMemo(() => toFixed12(cargoKey), [cargoKey]);

  useEffect(() => {
    if (!barcodeRef.current) return;

    try {
      // 12 karakterlik Code128 barkod
      JsBarcode(barcodeRef.current, refCode, {
        format: 'CODE128B',   // Alfanumerik için uygun
        width: 1,             // Kısa kod için biraz daha geniş çizgi
        height: 40,           // Okunabilirlik için yükseklik
        displayValue: false,  // Alt yazıyı biz göstereceğiz
        margin: 6,
        background: '#ffffff',
        lineColor: '#000000',
        valid: function (valid) {
          if (!valid) {
            // Geri dönüş: standart CODE128 dene
            JsBarcode(barcodeRef.current, refCode, {
              format: 'CODE128',
              width: 1,
              height: 40,
              displayValue: false,
              margin: 6,
              background: '#ffffff',
              lineColor: '#000000',
            });
          }
        },
      });
    } catch (err) {
      console.error('Barkod oluşturma hatası:', err);
      // Son çare geri dönüş
      JsBarcode(barcodeRef.current, refCode, {
        format: 'CODE128',
        width: 1,
        height: 40,
        displayValue: false,
        margin: 6,
        background: '#ffffff',
        lineColor: '#000000',
      });
    }
  }, [refCode]);

  return (
    <div className="text-center my-2 py-2 px-1 bg-white flex flex-col items-center justify-center">
      <svg
        ref={barcodeRef}
        className="max-w-[90%] h-auto block mx-auto"
        aria-label="Kargo Barkodu"
        role="img"
      />
      <div className="text-xs font-normal text-black mt-1.5 text-center w-full tracking-wider">
        Referans Kodu: {refCode}
      </div>
    </div>
  );
};

export default BarcodeSection;