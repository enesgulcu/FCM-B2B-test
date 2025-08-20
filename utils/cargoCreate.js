// utils/cargoCreate.js
import axios from 'axios';

export const SHIPPING_WSDL = process.env.YKARGO_SHIPPING_PRD_URL || 'https://ws.yurticikargo.com/KOPSWebServices/ShippingOrderDispatcherServices';
export const soapConfig = {
    username: process.env.YKARGO_USERNAME || 'YKTEST',
    password: process.env.YKARGO_PASSWORD || 'YK',
    language: 'TR'
};

export const createSoapClient = async (params) => {
    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:ship="http://yurticikargo.com.tr/ShippingOrderDispatcherServices">
  <soapenv:Body>
    <ship:createShipment>
      <userLanguage>${params.userLanguage}</userLanguage>
      <wsUserName>${params.wsUserName}</wsUserName>
      <wsPassword>${params.wsPassword}</wsPassword>
      <ShippingOrderVO>
        <cargoKey>${params.ShippingOrderVO.cargoKey}</cargoKey>
        <invoiceKey>${params.ShippingOrderVO.invoiceKey}</invoiceKey>
        <receiverCustName>${params.ShippingOrderVO.receiverCustName}</receiverCustName>
        <receiverAddress>${params.ShippingOrderVO.receiverAddress}</receiverAddress>
        <receiverPhone1>${params.ShippingOrderVO.receiverPhone1}</receiverPhone1>
        <emailAddress>${params.ShippingOrderVO.emailAddress}</emailAddress>
        <cityName>${params.ShippingOrderVO.cityName}</cityName>
        <townName>${params.ShippingOrderVO.townName}</townName>
        <cargoCount>${params.ShippingOrderVO.cargoCount}</cargoCount>
        <specialField1>${params.ShippingOrderVO.specialField1}</specialField1>
      </ShippingOrderVO>
    </ship:createShipment>
  </soapenv:Body>
</soapenv:Envelope>`;

    try {
        console.log('🚀 Kargo oluşturma isteği başlatılıyor...');
        console.log('📦 Cargo Key:', params.ShippingOrderVO.cargoKey);
        console.log('🎯 Special Field1:', params.ShippingOrderVO.specialField1);

        const response = await axios.post(SHIPPING_WSDL, soapEnvelope, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': '',
                'User-Agent': 'YurticiKargo-Create/1.0'
            },
            timeout: 30000,
            httpsAgent: new (require('https').Agent)({
                rejectUnauthorized: false
            })
        });

        console.log('✅ Kargo oluşturma başarılı!');
        console.log('📥 Response Status:', response.status);
        console.log('📄 Response Data:', response.data);

        return response.data;

    } catch (error) {
        console.error('❌ Kargo oluşturma hatası:', error.message);
        
        if (error.response) {
            console.error('📄 Error Response Data:', error.response.data);
            console.error('📊 Error Response Status:', error.response.status);
        }

        throw error;
    }
};

// SOAP yanıtını parse eden yardımcı fonksiyon
export const parseCreateResponse = (soapResponse) => {
    try {
        // outFlag ve outResult'u çıkar
        const outFlagMatch = soapResponse.match(/<outFlag>(.*?)<\/outFlag>/);
        const outResultMatch = soapResponse.match(/<outResult>(.*?)<\/outResult>/);
        
        const outFlag = outFlagMatch ? outFlagMatch[1] : '';
        const outResult = outResultMatch ? outResultMatch[1] : '';

        // Hata detayları için
        const errCodeMatch = soapResponse.match(/<errCode>(.*?)<\/errCode>/);
        const errMessageMatch = soapResponse.match(/<errMessage>(.*?)<\/errMessage>/);

        // Daha detaylı bilgiler için
        const cargoKeyMatch = soapResponse.match(/<cargoKey>(.*?)<\/cargoKey>/);
        const invoiceKeyMatch = soapResponse.match(/<invoiceKey>(.*?)<\/invoiceKey>/);

        return {
            success: outFlag === '0',
            outFlag,
            outResult,
            errorCode: errCodeMatch ? errCodeMatch[1] : null,
            errorMessage: errMessageMatch ? errMessageMatch[1] : null,
            cargoKey: cargoKeyMatch ? cargoKeyMatch[1] : null,
            invoiceKey: invoiceKeyMatch ? invoiceKeyMatch[1] : null,
            rawResponse: soapResponse
        };
    } catch (parseError) {
        console.error('❌ SOAP response parse hatası:', parseError);
        return {
            success: false,
            outFlag: '999',
            outResult: 'Yanıt parse edilemedi',
            rawResponse: soapResponse
        };
    }
}; 