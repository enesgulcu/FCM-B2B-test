import { createSoapClient, parseCreateResponse, soapConfig } from '../../../utils/cargoCreate';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    cargoKey,
    invoiceKey,
    receiverCustName,
    receiverAddress,
    receiverPhone1,
    emailAddress,
    cityName,
    townName,
    cargoCount
  } = req.body;

  // Gerekli alanları kontrol et
  if (!cargoKey || !receiverCustName || !receiverAddress) {
    return res.status(400).json({ 
      error: 'Gerekli alanlar eksik',
      required: ['cargoKey', 'receiverCustName', 'receiverAddress']
    });
  }

  try {
    console.log("🚀 Kargo oluşturma isteği alındı:");
    console.log("📦 Cargo Key:", cargoKey);
    console.log("📋 Receiver:", receiverCustName);
    console.log("📍 Address:", receiverAddress);

    // Parametreleri hazırla
    const params = {
      wsUserName: soapConfig.username,
      wsPassword: soapConfig.password,
      userLanguage: soapConfig.language,
      ShippingOrderVO: {
        cargoKey: cargoKey,
        invoiceKey: invoiceKey || cargoKey,
        receiverCustName: receiverCustName,
        receiverAddress: receiverAddress,
        receiverPhone1: receiverPhone1 || "Telefon bilgisi eksik",
        emailAddress: emailAddress || "E-posta bilgisi eksik",
        cityName: cityName || "İl bilgisi eksik",
        townName: townName || "İlçe bilgisi eksik",
        cargoCount: cargoCount || 1,
        specialField1: `14$${cargoKey}#` // Sipariş numarası referansı
      }
    };

    console.log("📤 Sending params:", params);

    // Kargo oluşturma isteği yap
    const soapResponse = await createSoapClient(params);
    
    // Yanıtı parse et
    const parsedResponse = parseCreateResponse(soapResponse);

    console.log("📊 Parsed Response:", parsedResponse);

    res.status(200).json(parsedResponse);

  } catch (error) {
    console.error("❌ Create API Error:", error);
    
    res.status(500).json({
      error: 'Kargo oluşturma hatası',
      message: error.message,
      details: error.response?.data || null
    });
  }
}
