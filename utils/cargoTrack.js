// utils/cargoTrack.js
import fixieAgent from '@/lib/fixieClient';
import axios from 'axios';

export const TRACKING_WSDL = process.env.YKARGO_TRACK_PRD_URL || 'https://ws.yurticikargo.com/KOPSWebServices/WsReportWithReferenceServices?wsdl';
export const soapConfig = {
    username: process.env.YKARGO_USERNAME || 'YKTEST',
    password: process.env.YKARGO_PASSWORD || 'YK',
    language: 'TR'
};

export const trackShipment = async (cargoKey, custParams = {}) => {
    // Varsayılan müşteri parametreleri - en az birinin dolu olması gerekiyor
    const {
        invCustId = '',
        senderCustId = process.env.YKARGO_CUSTOMER_CODE || '312852446', // Gerçek müşteri kodu (canlı ortam) 
        receiverCustId = ''
    } = custParams;

    // En az bir müşteri ID'si zorunlu
    if (!invCustId && !senderCustId && !receiverCustId) {
        throw new Error('invCustId, senderCustId veya receiverCustId alanlarından en az biri dolu olmalıdır.');
    }

    // fieldName 14 için fieldValueArray zorunlu
    if (!cargoKey || cargoKey.trim() === '') {
        throw new Error('cargoKey (fieldValueArray) alanı zorunludur.');
    }

    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:tns="http://yurticikargo.com.tr/sswIntegrationServices">
  <soapenv:Body>
    <tns:listInvDocumentInterfaceByReference>
      <userName>${soapConfig.username}</userName>
      <password>${soapConfig.password}</password>
      <language>${soapConfig.language}</language>
      <custParamsVO>
      </custParamsVO>
      <fieldName>14</fieldName>
      <fieldValueArray>${cargoKey}</fieldValueArray>
      <withCargoLifecycle>0</withCargoLifecycle>
    </tns:listInvDocumentInterfaceByReference>
  </soapenv:Body>
</soapenv:Envelope>`;

    try {
        console.log('🔍 Kargo takip sorgusu başlatılıyor...');
        console.log('📦 CargoKey:', cargoKey);
        console.log('👥 Müşteri Parametreleri:', { invCustId, senderCustId, receiverCustId });

        const response = await axios.post(TRACKING_WSDL, soapEnvelope, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': '',
                'User-Agent': 'YurticiKargo-Track/1.0'
            },
            timeout: 30000,
            httpsAgent: fixieAgent
        });

        console.log('✅ Takip sorgusu başarılı!');
        console.log('📥 Response Status:', response.status);
        console.log('📄 Response Data:', response.data);

        return response.data;

    } catch (error) {
        console.error('❌ Kargo takip sorgusu hatası:', error.message);
        
        if (error.response) {
            console.error('📄 Error Response Data:', error.response.data);
            console.error('📊 Error Response Status:', error.response.status);
        }

        const errorDetail = error.response?.data || error.message;
        
        if (errorDetail.includes('Endpoint') || errorDetail.includes('ENOTFOUND')) {
            throw new Error('Yurtiçi Kargo servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.');
        } else if (errorDetail.includes('NumberFormatException')) {
            throw new Error('Müşteri kodu formatı hatalı. Lütfen müşteri kodlarını kontrol edin.');
        } else {
            throw error;
        }
    }
};

// SOAP yanıtını parse eden yardımcı fonksiyon
export const parseTrackingResponse = (soapResponse) => {
    try {
        // outFlag ve outResult'u çıkar
        const outFlagMatch = soapResponse.match(/<outFlag>(.*?)<\/outFlag>/);
        const outResultMatch = soapResponse.match(/<outResult>(.*?)<\/outResult>/);
        
        const outFlag = outFlagMatch ? outFlagMatch[1] : '';
        const outResult = outResultMatch ? outResultMatch[1] : '';

        // Temel bilgileri çıkar
        const docIdMatch = soapResponse.match(/<docId>(.*?)<\/docId>/);
        const trackingUrlMatch = soapResponse.match(/<trackingUrl>(.*?)<\/trackingUrl>/);
        const cargoEventExplanationMatch = soapResponse.match(/<cargoEventExplanation>(.*?)<\/cargoEventExplanation>/);
        const deliveryDateMatch = soapResponse.match(/<deliveryDate>(.*?)<\/deliveryDate>/);
        const receiverCustNameMatch = soapResponse.match(/<receiverCustName>(.*?)<\/receiverCustName>/);

        return {
            success: outFlag === '0',
            outFlag,
            outResult,
            docId: docIdMatch ? docIdMatch[1] : null,
            trackingUrl: trackingUrlMatch ? trackingUrlMatch[1] : null,
            status: cargoEventExplanationMatch ? cargoEventExplanationMatch[1] : 'Durum bilgisi bulunamadı',
            deliveryDate: deliveryDateMatch ? deliveryDateMatch[1] : null,
            receiverName: receiverCustNameMatch ? receiverCustNameMatch[1] : null,
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
