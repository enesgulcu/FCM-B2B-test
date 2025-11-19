import {
  createNewData,
  getAllData,
  getDataByUnique,
  getDataByUniqueSingle,
  updateDataByAny,
} from "@/services/serviceOperations";
import { generateDeterministic12CharKey } from "@/utils/generateCargoKey";
import { parsePrice } from "@/utils/formatPrice";

const now = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);

const generateOrderNo = (userId) => {
  const day = now.getUTCDate().toString().padStart(2, "0");
  const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = now.getUTCFullYear().toString();
  const hour = now.getUTCHours().toString().padStart(2, "0");

  const minute = now.getUTCMinutes().toString().padStart(2, "0");
  const randomLetters =
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
    String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const randomNumber = Math.floor(Math.random() * 89) + 10;
  return `${day}-${month}-${year}-${hour}-${minute}-${userId}-${randomLetters}-${randomNumber}`;
};

// Sipariş içerisindeki tüm ürünlerin bilgisi ve kaydı burada tutulur. (orderItems)
const prepareOrderData = (
  cartItems,
  totalPrice,
  userId,
  userName,
  harRefDeger,
  cikisFisEvrNo,
  satisIrsaliyesiEvrNo
) => {
  const orderNo = generateOrderNo(userId);
  // Tüm sipariş kalemleri için aynı kısa cargo key üret
  const shortCargoKey = generateDeterministic12CharKey(orderNo);
  const orderHour = now.getUTCHours().toString().padStart(2, "0");
  const orderMinutes = now.getUTCMinutes().toString().padStart(2, "0");
  const orderSeconds = now.getUTCSeconds().toString().padStart(2, "0");
  const ORDERSAAT = `${orderHour}:${orderMinutes}:${orderSeconds}`;

  const baseOrderData = {
    ORDERNO: orderNo,
    CARKOD: userId,
    CARUNVAN: userName,
    ORDERFIYATTOPLAM: totalPrice,
    ORDERYIL: now.getUTCFullYear(),
    ORDERAY: now.getUTCMonth() + 1,
    ORDERGUN: now.getUTCDate(),
    ORDERSAAT: ORDERSAAT,
  };

  const orderItems = cartItems.map((item) => ({
    ...baseOrderData,
    KARGOTAKIPNO: shortCargoKey,
    STKKOD: item.STKKOD,
    STKNAME: item.STKCINSI || null,
    STKCINSI: item.STKCINSI || null,
    STKADET: parseInt(item.quantity),
    // STKBIRIMFIYAT: parseFloat(item.STKOZKOD5) || 0,
    STKBIRIMFIYAT: parsePrice(item.STKOZKOD5),
    // STKBIRIMFIYATTOPLAM: (parseFloat(item.STKOZKOD5) || 0) * item.quantity,
    STKBIRIMFIYATTOPLAM: parsePrice(item.STKOZKOD5) * item.quantity,
    CIKISFISEVRNO: cikisFisEvrNo,
    SATISIRSEVRNO: satisIrsaliyesiEvrNo,
    HARREFDEGER1: harRefDeger,
    // EKXTRA7 artık kullanılmıyor; anahtar KARGOTAKIPNO'da tutulur
    EKXTRA7: null,
    EKXTRA8: null,
    EKXTRA9: null,
  }));
  return orderItems;
};

const getAndUpdateReferences = async () => {
  try {
    // Bağımsız sorguları paralel olarak çalıştırıyoruz
    const [
      harrefModule6,
      harrefModule1,
      cikisFisEvrako,
      satisIrsaliyesiEvrako,
    ] = await Promise.all([
      getDataByUnique("HARREFNO", { HARREFMODUL: 6 }),
      getDataByUnique("HARREFNO", { HARREFMODUL: 1 }),
      getDataByUnique("EVRAKNO", { EVRACIKLAMA: "Çıkış Fişleri" }),
      getDataByUnique("EVRAKNO", { EVRACIKLAMA: "Satış İrsaliyeleri" }),
    ]);

    //console.log('harrefModule6:', harrefModule6);
    //console.log('harrefModule1:', harrefModule1);
    //console.log('cikisFisEvrako:', cikisFisEvrako);
    //console.log('satisIrsaliyesiEvrako:', satisIrsaliyesiEvrako);

    // Değerleri hesaplıyoruz
    const newHarRefDeger = harrefModule6 ? harrefModule6.HARREFDEGER + 1 : 1;
    const newHarRefDeger1 = harrefModule1 ? harrefModule1.HARREFDEGER + 1 : 1;
    const newCikisFisEvrNo = cikisFisEvrako ? cikisFisEvrako.EVRNO + 1 : 1;
    const newSatisIrsaliyesiEvrNo = satisIrsaliyesiEvrako
      ? satisIrsaliyesiEvrako.EVRNO + 1
      : 1;

    // Güncellemeleri paralel olarak yapıyoruz
    const resultUpdateAll = await Promise.all([
      updateDataByAny(
        "HARREFNO",
        { HARREFMODUL: 6 },
        { HARREFDEGER: newHarRefDeger }
      ),
      updateDataByAny(
        "HARREFNO",
        { HARREFMODUL: 1 },
        { HARREFDEGER: newHarRefDeger1 }
      ),
      updateDataByAny(
        "EVRAKNO",
        { EVRACIKLAMA: "Çıkış Fişleri" },
        { EVRNO: newCikisFisEvrNo }
      ),
      updateDataByAny(
        "EVRAKNO",
        { EVRACIKLAMA: "Satış İrsaliyeleri" },
        { EVRNO: newSatisIrsaliyesiEvrNo }
      ),
    ]);

    // Referans güncellemelerinde hata kontrolü
    const updateErrors = resultUpdateAll.filter(
      (result) => result && result.error
    );
    if (updateErrors.length > 0) {
      console.error("Referans güncelleme hataları:", updateErrors);
      throw new Error("Referans değerleri güncellenemedi");
    }

    //console.log("resultUpdateAll", resultUpdateAll);

    return {
      harRefDeger: newHarRefDeger,
      cikisFisEvrNo: newCikisFisEvrNo,
      satisIrsaliyesiEvrNo: newSatisIrsaliyesiEvrNo,
    };
  } catch (error) {
    console.error("Referans değerlerini güncellerken hata oluştu:", error);
    throw error;
  }
};

// const getLastSTKFIS = async () => {
//   const lastSTKFIS = await getDataByUniqueSingle(
//     "STKFIS",
//     {},
//     { STKFISREFNO: "desc" }
//   );

//   // Varsayılan değerler ile gelen değeri birleştiriyoruz
//   const reducedSTKFIS = {
//     STKFISREFNO: 0,
//     STKFISEVRAKNO1: "SF-000000",
//     STKFISEVRAKNO2: "WEB-000000",
//     ...lastSTKFIS, // Eğer lastSTKFIS boş değilse, onun değerleri bu objeyi overwrite eder
//   };

//   return reducedSTKFIS;
// };

const createSIRKETLOG = async (stkfisRefNo, orderDate) => {
  const sirketlogEntry = {
    SIRLOGMODUL: 1,
    SIRLOGKONU: 2,
    SIRLOGKYTTIPI: 3,
    SIRLOGKYTKODU: " ",
    SIRLOGKYTKODU2: " ",
    SIRLOGKYTREFNO: stkfisRefNo,
    SIRLOGKYTREFNO2: 0,
    SIRLOGILKKULKOD: "ETA",
    SIRLOGILKTAR: orderDate,
    SIRLOGSONKULKOD: "ETA",
    SIRLOGSONTAR: orderDate,
    SIRLOGMUHINT1: 0,
    SIRLOGMUHINT2: 0,
    SIRLOGMUHINT3: 0,
    SIRLOGMUHINT4: 0,
    SIRLOGMUHINT5: 0,
    SIRLOGMUHNUM1: 0,
    SIRLOGMUHNUM2: 0,
    SIRLOGMUHNUM3: 0,
    SIRLOGMUHNUM4: 0,
    SIRLOGMUHNUM5: 0,
    SIRLOGMUHTAR1: new Date("1900-01-01"),
    SIRLOGMUHTAR2: new Date("1900-01-01"),
    SIRLOGMUHTAR3: new Date("1900-01-01"),
    SIRLOGMUHTAR4: new Date("1900-01-01"),
    SIRLOGMUHTAR5: new Date("1900-01-01"),
    SIRLOGMUHACK1: " ",
    SIRLOGMUHACK2: " ",
    SIRLOGMUHACK3: "ANAMAK\\adnan",
    SIRLOGMUHACK4: "ANAMAK\\adnan",
    SIRLOGMUHACK5: " ",
  };

  const newSirketlogData = await createNewData("SIRKETLOG", sirketlogEntry);
  //console.log("newSirketlogData", newSirketlogData);
};

const createIRSHAR = async (orderItem, newIRSFISREFNO, siraNo) => {
  const irsharEntry = {
    IRSHARTAR: now,
    IRSHARREFNO: newIRSFISREFNO,
    IRSHARTIPI: 3,
    IRSHARGCFLAG: 2,
    IRSHARKAYONC: 1,
    IRSHARIPTALFLAG: 0,
    IRSHARKAYNAK: 6,
    IRSHARIADE: 0,
    IRSHARCARKOD: orderItem.CARKOD,
    IRSHARSIRANO: siraNo,
    IRSHARKODTIP: 1,
    IRSHARSTKKOD: orderItem.STKKOD,
    IRSHARSTKCINS: orderItem.STKNAME,
    IRSHARSTKBRM: " ",
    IRSHARDEPOKOD: " ",
    IRSHARBARKOD: " ",
    IRSHAROZDESKOD: " ",
    IRSHARBENZERKOD: " ",
    IRSHARMIKTAR: orderItem.STKADET,
    IRSHARMIKTAR2: 0,
    IRSHARMIKTAR3: 0,
    IRSHARMIKTAR4: 0,
    IRSHARMIKTAR5: 0,
    IRSHARFIYTIP: " ",
    IRSHARFIYAT: orderItem.STKBIRIMFIYAT,
    IRSHARTUTAR: orderItem.STKBIRIMFIYATTOPLAM,
    IRSHARDOVKOD: " ",
    IRSHARDOVTUR: " ",
    IRSHARDOVTUTAR: 0,
    IRSHAROZKOD: " ",
    IRSHARACIKLAMA: " ",
    IRSHARKDVYUZ: 0,
    IRSHARISKYUZ1: 0,
    IRSHARISKYUZ2: 0,
    IRSHARISKYUZ3: 0,
    IRSHARISKYUZ4: 0,
    IRSHARISKYUZ5: 0,
    IRSHARISKYTUT1: 0,
    IRSHARISKYTUT2: 0,
    IRSHARISKYTUT3: 0,
    IRSHARISKYTUT4: 0,
    IRSHARISKYTUT5: 0,
    IRSHARISKGTUT1: 0,
    IRSHARISKGTUT2: 0,
    IRSHARISKGTUT3: 0,
    IRSHARISKGTUT4: 0,
    IRSHARISKGTUT5: 0,
    IRSHARDIGERIND: 0,
    IRSHARTOPLAMIND: 0,
    IRSHARKDVMATRAH: orderItem.STKBIRIMFIYATTOPLAM,
    IRSHARKDVTUTAR: 0,
    IRSHARTOPLAMTUT: orderItem.STKBIRIMFIYATTOPLAM,
    IRSHARVADETAR: new Date("1900-01-01"),
    IRSHARACIKLAMA1: " ",
    IRSHARACIKLAMA2: " ",
    IRSHARACIKLAMA3: " ",
    IRSHARPARTINO: " ",
    IRSHARMASMER: " ",
    IRSHARSERINO1: " ",
    IRSHARSERINO2: " ",
    IRSHARRB1: 0,
    IRSHARRB2: 0,
    IRSHARRB3: 0,
    IRSHARRB4: 0,
    IRSHARRB5: 0,
    IRSHARSATKOD: " ",
    IRSHARODEMEKOD: "",
    IRSHARTOPLAMMAS: 0,
    IRSHARNETTUTAR: orderItem.STKBIRIMFIYATTOPLAM,
    IRSHARNETFIYAT: orderItem.STKBIRIMFIYAT,
    IRSHARMALIYET: 0,
    IRSHAROTVMATRAH: orderItem.STKBIRIMFIYATTOPLAM,
    IRSHAROTVORAN: 0,
    IRSHAROTVFIYAT: 0,
    IRSHARTOPOTV: 0,
    IRSHAROTVTUTAR: orderItem.STKBIRIMFIYATTOPLAM,
    IRSHARMUHKOD: " ",
    IRSHARMUHYANIND: 0,
    IRSHARMUHYANMAS: 0,
    IRSHARDOVFIYAT: 0,
    IRSHAREBTEN: 0,
    IRSHAREBTBOY: 0,
    IRSHAREBTYUK: 0,
    IRSHAREBTHCM: 0,
    IRSHAREBTAGR: 0,
    IRSHAREKCHAR1: " ",
    IRSHAREKCHAR2: " ",
    IRSHAREKINT1: 0,
    IRSHAREKINT2: 0,
    IRSHAREKDATE1: new Date("1900-01-01"),
    IRSHAREKDATE2: new Date("1900-01-01"),
    IRSHAREKTUT1: 0,
    IRSHAREKTUT2: 0,
    IRSHAREKMIK1: 0,
    IRSHAREKMIK2: 0,
    IRSHAREKDOVTUT1: 0,
    IRSHAREKDOVTUT2: 0,
    IRSHAREKORAN1: 0,
    IRSHAREKORAN2: 0,
    IRSHARDOVKUR: 0,
    IRSHAREFATFLAG: 0,
    IRSHAROTVVERKOD: " ",
    IRSHAREKVERGI: " ",
    IRSHARDISTIP: 0,
    IRSHARDISKOD: " ",
  };

  try {
    const newIrsharData = await createNewData("IRSHAR", irsharEntry);

    if (newIrsharData.error || !newIrsharData) {
      console.error("IRSHAR oluşturma hatası detayları:", {
        error: newIrsharData.error,
        refNo: newIRSFISREFNO,
        siraNo: siraNo,
        stkkod: orderItem.STKKOD,
      });
      throw new Error(newIrsharData.error || "IRSHAR oluşturulamadı");
    }
  } catch (error) {
    console.error("IRSHAR kaydı oluşturma hatası:", error);
    throw error;
  }
};

const getLastIRSFIS = async () => {
  const allIRSFIS = await getAllData("IRSFIS");
  //console.log("allIRSFIS", allIRSFIS);

  const reducedIRSFIS = allIRSFIS.reduce(
    (max, current) => (current.IRSFISREFNO > max.IRSFISREFNO ? current : max),
    { IRSFISREFNO: 0 }
  );

  return reducedIRSFIS;
};

const getLastSTKFISAndIRSFIS = async (orderData) => {
  try {
    // Properly fetch the last IRSFIS record
    const lastIRSFIS = await getDataByUniqueSingle(
      "IRSFIS",
      {},
      { IRSFISREFNO: "desc" }
    );

    // STKFIS yorum satırına alındığı için 1.evrak numarası 1 olarak kabul ediliyor.
    let newSFNumber = 1;

    // Son IRSFIS kaydından WEB numarasını çıkar ve arttır
    let newWEBNumber = 1;
    if (lastIRSFIS?.IRSFISEVRAKNO1) {
      // "WEB-005051" formatını parçala -> "005051" kısmını çıkar -> sayıya çevir -> bir artır
      const match = lastIRSFIS.IRSFISEVRAKNO1.match(/WEB-(\d+)/);
      if (match && match[1]) {
        const lastNumber = parseInt(match[1], 10);
        if (!isNaN(lastNumber)) {
          newWEBNumber = lastNumber + 1;
        }
      }
    }

    const irsFisDate = new Date();
    const irsFisHour = irsFisDate.getHours().toString().padStart(2, "0");
    const irsFisMinute = irsFisDate.getMinutes().toString().padStart(2, "0");
    const irsFisTimeInfo = `${irsFisHour}:${irsFisMinute}`;

    // Calculate newIRSFISREFNO from actual lastIRSFIS
    const newIRSFISREFNO = (lastIRSFIS?.IRSFISREFNO || 0) + 1;

    const newIRSFISData = {
      IRSFISREFNO: newIRSFISREFNO,
      IRSFISTAR: now,
      IRSFISTIPI: 3,
      IRSFISGCFLAG: 2,
      IRSFISKAYONC: 1,
      IRSFISIPTALFLAG: 0,
      IRSFISKAYNAK: 6,
      // IRSFISSTKREFNO: lastSTKFISREFNO,
      IRSFISFATREFNO: 0,
      IRSFISFATTAR: new Date("1900-01-01"),
      IRSFISFATKONT: 1,
      IRSFISFATFLAG: 0,
      IRSFISKAPFLAG: 0,
      IRSFISBASFLAG: 0,
      IRSFISOZELFIS: 0,
      IRSFISDEPOFLAG: 0,
      IRSFISIADEFLAG: 0,
      IRSFISKDVDAHILFLAG: 0,
      IRSFISTEVKIFATFLAG: 0,
      IRSFISANADEPO: " ",
      IRSFISPARTIKOD: " ",
      IRSFISODEMEKOD: " ",
      IRSFISSATKOD: " ",
      IRSFISMASMER: " ",
      IRSFISCARKOD: orderData[0].CARKOD,
      IRSFISCARUNVAN: orderData[0].CARUNVAN,
      IRSFISSAAT: irsFisTimeInfo,
      IRSFISADRESNO: 2,
      IRSFISADRES1: " ",
      IRSFISADRES2: " ",
      IRSFISADRES3: " ",
      IRSFISPOSTAKOD: " ",
      IRSFISULKE: " ",
      IRSFISIL: " ",
      IRSFISILCE: " ",
      IRSFISVERDAIRE: " ",
      IRSFISVERHESNO: " ",
      IRSFISVADETAR: new Date("1900-01-01"),
      IRSFISKDVVADETAR: new Date("1900-01-01"),
      IRSFISFATURATAR: new Date("1900-01-01"),
      IRSFISFATURANO: " ",
      IRSFISEVRAKNO1: `WEB-${newWEBNumber.toString().padStart(6, "0")}`,
      IRSFISEVRAKNO2: " ",
      IRSFISEVRAKNO3: " ",
      IRSFISOZKOD1: " ",
      IRSFISOZKOD2: " ",
      IRSFISOZKOD3: " ",
      IRSFISACIKLAMA1: " ",
      IRSFISACIKLAMA2: " ",
      IRSFISACIKLAMA3: " ",
      IRSFISHAZKOD: " ",
      IRSFISHAZTAR: new Date("1900-01-01"),
      IRSFISHAZNOT: " ",
      IRSFISKONTKOD: " ",
      IRSFISKONTTAR: new Date("1900-01-01"),
      IRSFISKONTNOT: " ",
      IRSFISONAYKOD: " ",
      IRSFISONAYTAR: new Date("1900-01-01"),
      IRSFISONAYNOT: " ",
      IRSFISKDVORANI: 0,
      IRSFISMALTOP: orderData[0].ORDERFIYATTOPLAM,
      IRSFISKALINDYTOP: 0,
      IRSFISKALINDTTOP: 0,
      IRSFISSATINDTOP: 0,
      IRSFISGENINDTOP: 0,
      IRSFISSATMASTOP: 0,
      IRSFISGENMASTOP: 0,
      IRSFISBRUTTOPLAM: orderData[0].ORDERFIYATTOPLAM,
      IRSFISKDVMATRAHI: orderData[0].ORDERFIYATTOPLAM,
      IRSFISKDVTUTARI: 0,
      IRSFISARATOPLAM: orderData[0].ORDERFIYATTOPLAM,
      IRSFISKDVALTIINDTOP: 0,
      IRSFISKDVALTIEKTOP: 0,
      IRSFISGENTOPLAM: orderData[0].ORDERFIYATTOPLAM,
      IRSFISTEVTUTAR: 0,
      IRSFISDOVTAR: now,
      IRSFISDOVKOD: " ",
      IRSFISDOVTUR: " ",
      IRSFISDOVKUR: 0,
      IRSFISGENDOVTOP: 0,
      IRSFISTEVNO: 1000,
      IRSFISTEVORAN: 0,
      IRSFISSEVNO: 1,
      IRSFISISYKOD: "MERKEZ",
      IRSFISOTVFLAG: 0,
      IRSFISOTVKDVBLOKAJ: 0,
      IRSFISTOPOTV: 0,
      IRSFISTOPOTUT: orderData[0].ORDERFIYATTOPLAM,
      IRSFISTCKIMLIKNO: " ",
      IRSFISTRNTAR: new Date("1900-01-01"),
      IRSFISTRNREFNO: 0,
      IRSFISTRNTIPI: 0,
      IRSFISEFATFLAG: 0,
      IRSFISEKVERGIINDTOP: 0,
      IRSFISEKVERGIILVTOP: 0,
      IRSFISEKVERGITOP: 0,
      IRSFISDISTIP: 0,
      IRSFISDISKOD: " ",
    };

    // const newSTKFISData = {
    //   STKFISTAR: new Date(),
    //   STKFISREFNO: lastSTKFISREFNO,
    //   STKFISTIPI: 3,
    //   STKFISGCFLAG: 2,
    //   STKFISKAYONC: 2,
    //   STKFISDEPO: 0,
    //   STKFISOZELFIS: 0,
    //   STKFISIADE: 0,
    //   STKFISKAYNAK: 3,
    //   STKFISCARKOD: orderData[0].CARKOD,
    //   STKFISREFNO2: 0,
    //   STKFISANADEPO: " ",
    //   STKFISKARDEPO: " ",
    //   STKFISOZKOD1: " ",
    //   STKFISOZKOD2: " ",
    //   STKFISOZKOD3: " ",
    //   STKFISACIKLAMA1: orderData[0].STKCINSI,
    //   STKFISACIKLAMA2: " ",
    //   STKFISACIKLAMA3: " ",
    //   STKFISEVRAKNO1: `SF-${newSFNumber.toString().padStart(6, "0")}`,
    //   STKFISEVRAKNO2: `WEB-${newWEBNumber.toString().padStart(6, "0")}`,
    //   STKFISEVRAKNO3: " ",
    //   STKFISDOVTAR: new Date(),
    //   STKFISPARTIKOD: " ",
    //   STKFISMASMER: " ",
    //   STKFISTOPBTUT: orderData[0].ORDERFIYATTOPLAM,
    //   STKFISTOPISK: 0,
    //   STKFISTOPNTUT: orderData[0].ORDERFIYATTOPLAM,
    //   STKFISTOPKDV: 0,
    //   STKFISTOPKTUT: orderData[0].ORDERFIYATTOPLAM,
    //   STKFISSEVNO: 1,
    //   STKFISISYKOD: "MERKEZ",
    //   STKFISOTVFLAG: 0,
    //   STKFISTOPOTV: 0,
    //   STKFISTOPOTUT: orderData[0].ORDERFIYATTOPLAM,
    //   STKFISDOVKOD: " ",
    //   STKFISDOVTUR: " ",
    //   STKFISDOVKUR: 0,
    //   STKFISDOVTOP: 0,
    //   STKFISTRNTAR: new Date("1900-01-01"),
    //   STKFISTRNREFNO: 0,
    //   STKFISTRNTIPI: 0,
    //   STKFISDISTIP: 0,
    //   STKFISDISKOD: "0",
    //   STKFISMUHREFNO: 0,
    // };

    const irsfisResult = await createNewData("IRSFIS", newIRSFISData);

    // IRSFIS oluşturma hatalarını kontrol et
    if (irsfisResult && irsfisResult.error) {
      console.error("IRSFIS oluşturma hatası:", {
        error: irsfisResult.error,
        refNo: newIRSFISREFNO,
        carkod: orderData[0].CARKOD,
      });
      throw new Error(`IRSFIS oluşturulamadı: ${irsfisResult.error}`);
    }

    let siraNo = 0;

    for (const item of orderData) {
      siraNo++;
      await createIRSHAR(item, newIRSFISREFNO, siraNo);
    }

    return { newIRSFISREFNO, newSFNumber, newWEBNumber };
  } catch (error) {
    console.error("IRSFIS verilerini alırken hata oluştu:", error);
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Potansiyel geri alma için oluşturulan kayıtları takip et
    let createdIRSFISREFNO = null;
    let createdSTKFISREFNO = null;

    try {
      const { cartItems, totalPrice, userId, userName, talep } = req.body;

      // [HARREFNO, EVRAKNO] verileri çek -> +1 ekle ve GÜNCELLE -> güncel veriyi döndür.
      const { harRefDeger, cikisFisEvrNo, satisIrsaliyesiEvrNo } =
        await getAndUpdateReferences();

      // Sipariş içerisindeki tüm ürünlerin bilgisi ve kaydı burada tutulur. (orderItems)
      // Tüm siparişler burada tutuluyor (orderItems)
      const orderItems = await prepareOrderData(
        cartItems,
        totalPrice,
        userId,
        userName,
        harRefDeger,
        cikisFisEvrNo,
        satisIrsaliyesiEvrNo
      );

      // IRSFIS verilerini al -> GÜNCELLE -> VERİ TABANINA EKLE -> güncel veriyi döndür.
      // NOT: Bu işlemler atomik olmalı (transaction), ancak mevcut servis mimarisi bunu desteklemiyor
      const { newIRSFISREFNO, newSFNumber, newWEBNumber } =
        await getLastSTKFISAndIRSFIS(orderItems);

      // createdIRSFISREFNO = newIRSFISREFNO;
      // createdSTKFISREFNO = lastSTKFISREFNO;

      // Tüm siparişlerin kaydı burada yapılıyor
      for (const item of orderItems) {
        const entry = {
          ...item,
          // STKFISREFNO: lastSTKFISREFNO,
          STKFISREFNO: 0, // Şu an için 0 yapıldı, çünkü STKFIS kaydı oluşturulmuyor
          // STKFISEVRAKNO1: `SF-${newSFNumber.toString().padStart(6, "0")}`,
          // STKFISEVRAKNO2: `WEB-${newWEBNumber.toString().padStart(6, "0")}`,
          ACIKLAMA: null,
          ORDERSTATUS: "Sipariş Oluşturuldu",
          TALEP: talep,
          CEVAP: "",
          REFNO: newIRSFISREFNO,
          KARGO: "",
          // KARGOTAKIPNO'yu boş string yapmak yerine item'dan kullan (unique constraint ihlalini önlemek için)
          // KARGOTAKIPNO zaten orderItems'da ayarlanmış (satır 57)
          EKXTRA7: null,
          EKXTRA8: null,
          EKXTRA9: null,
        };

        const responseCreateNewData = await createNewData("ALLORDERS", entry);

        // Yanıttaki hataları kontrol et
        if (responseCreateNewData.error) {
          console.error("ALLORDERS kaydı oluşturma hatası:", {
            error: responseCreateNewData.error,
            orderNo: item.ORDERNO,
            stkkod: item.STKKOD,
            kargotakipno: item.KARGOTAKIPNO,
          });
          throw new Error(
            `ALLORDERS kaydı oluşturulamadı: ${responseCreateNewData.error}`
          );
        }
      }

      // CARKART tablosundaki CARCIKIRSTOP değerini güncelle
      const userCARKART = await getDataByUnique("CARKART", { CARKOD: userId });

      if (
        userCARKART &&
        typeof userCARKART === "object" &&
        !userCARKART.error
      ) {
        const currentCARCIKIRSTOP = parseFloat(userCARKART.CARCIKIRSTOP) || 0;
        const newCARCIKIRSTOP = currentCARCIKIRSTOP + totalPrice;

        const responseUpdateDataByAny = await updateDataByAny(
          "CARKART",
          { CARKOD: userId },
          { CARCIKIRSTOP: newCARCIKIRSTOP }
        );
      }

      return res.status(200).json({
        success: true,
        message: "Order items created successfully",
      });
    } catch (error) {
      console.error("Sipariş oluşturma hatası:", {
        error: error.message,
        stack: error.stack,
        userId: req.body?.userId,
        createdIRSFISREFNO,
        createdSTKFISREFNO,
      });

      // Eğer IRSFIS/STKFIS/IRSHAR oluşturulmuş ama ALLORDERS oluşturulamamışsa,
      // IRSFIS kayıtları veritabanında kalacaktır. Bu bilinen bir sorundur ve
      // düzgün veritabanı transaction'ları uygulanarak çözülmelidir.
      // TODO: Tüm tablo işlemlerinde atomikliği sağlamak için Prisma transaction uygula

      res.status(500).json({
        success: false,
        message: "Sipariş kalemleri oluşturulurken hata",
        error: error.message,
      });
    }
  } else if (req.method === "GET") {
    try {
      // Her zaman güncel veri dönmesi için önbelleklemeyi devre dışı bırak
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      const allOrders = await getAllData("ALLORDERS");
      //console.log("allOrders", allOrders);
      res.status(200).json({
        success: true,
        orders: allOrders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching orders",
        error: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
