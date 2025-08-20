import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// CargoKey temizleme fonksiyonu
export const cleanCargoKey = (cargoKey) => {
  const raw = (cargoKey || '').toString().toUpperCase();
  return raw
    .replace(/[-\s_]/g, '')
    .replace(/[^0-9A-Z]/g, '')       // Yalnızca A-Z ve 0-9
    .substring(0, 48) || 'ORDER' + Date.now().toString().slice(-8);
};

// PDF oluşturma ve indirme fonksiyonu
export const downloadPDF = async (labelRef, cargoKey, setIsGeneratingPDF) => {
  if (!labelRef.current) return;
  
  setIsGeneratingPDF(true);
  try {
    // HTML'i canvas'a çevir - Daha yüksek kalite ve ortalama için
    const canvas = await html2canvas(labelRef.current, {
      scale: 4, // Daha yüksek kalite için artırıldı
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: 378,  // 10cm = 378px (96 DPI)
      height: 567, // 15cm = 567px (96 DPI)
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1200,
      windowHeight: 800
    });

    // PDF oluştur
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 150] // 10cm x 15cm
    });

    // Canvas boyutlarını hesapla ve ortala
    const imgData = canvas.toDataURL('image/png', 1.0); // En yüksek kalite
    
    // PDF'de tam sayfa kaplamak için canvas'ı ortala
    const pdfWidth = 100; // 10cm
    const pdfHeight = 150; // 15cm
    
    // Canvas oranını koru ve ortala
    const canvasRatio = canvas.width / canvas.height;
    const pdfRatio = pdfWidth / pdfHeight;
    
    let imgWidth = pdfWidth;
    let imgHeight = pdfHeight;
    let xOffset = 0;
    let yOffset = 0;
    
    if (canvasRatio > pdfRatio) {
      // Canvas daha geniş - yüksekliği ayarla
      imgHeight = pdfWidth / canvasRatio;
      yOffset = (pdfHeight - imgHeight) / 2;
    } else {
      // Canvas daha uzun - genişliği ayarla
      imgWidth = pdfHeight * canvasRatio;
      xOffset = (pdfWidth - imgWidth) / 2;
    }

    // Canvas'ı PDF'e ortalanmış şekilde ekle
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

    // PDF'i indir
    const cleanKey = cleanCargoKey(cargoKey);
    pdf.save(`Yurtici_Kargo_Etiketi_${cleanKey}.pdf`);
    
  } catch (error) {
    console.error('PDF oluşturma hatası:', error);
    alert('PDF oluşturulurken bir hata oluştu!');
  } finally {
    setIsGeneratingPDF(false);
  }
};