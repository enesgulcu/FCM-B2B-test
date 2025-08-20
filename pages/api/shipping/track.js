import { trackShipment, parseTrackingResponse } from '../../../utils/cargoTrack';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cargoKey, invCustId, senderCustId, receiverCustId } = req.body;

  if (!cargoKey) {
    return res.status(400).json({ error: 'cargoKey (sipariş numarası) gerekli' });
  }

  try {
    console.log("🔍 Kargo takip isteği alındı:");
    console.log("👥 Müşteri Parametreleri:", { invCustId, senderCustId, receiverCustId });

    // Müşteri parametrelerini hazırla
    const custParams = {
      invCustId: invCustId || '',
      senderCustId:
        senderCustId || process.env.YKARGO_CUSTOMER_CODE || '312852446',
      receiverCustId: receiverCustId || ''
    };

    // Kargo takip sorgusu yap
    const soapResponse = await trackShipment(cargoKey, custParams);
    
    // Yanıtı parse et
    const parsedResponse = parseTrackingResponse(soapResponse);

    console.log("📊 Parsed Response:", parsedResponse);

    res.status(200).json(parsedResponse);

  } catch (error) {
    console.error("❌ Track API Error:", error);
    
    res.status(500).json({
      error: 'Kargo takip hatası',
      message: error.message,
      details: error.response?.data || null
    });
  }
}
