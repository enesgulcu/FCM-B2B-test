const soap = require("soap");
const https = require("https");

const url =
  "https://testws.yurticikargo.com/KOPSWebServices/ShippingOrderDispatcherServices?wsdl";

const agent = new https.Agent({ rejectUnauthorized: false });

soap.createClient(
  url,
  { wsdl_options: { timeout: 10000, agent } },
  (err, client) => {
    if (err) {
      console.error("❌ SOAP bağlantı hatası:", err);
      return;
    }
    console.log("✅ SOAP client oluşturuldu:", Object.keys(client.describe()));
  }
);
