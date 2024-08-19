import {
  createNewData,
  getAllData,
  updateDataByAny,
  getDataByUnique,
  getDataByUniqueSingle,
  getDataByMany,
} from "@/services/serviceOperations";

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
    STKKOD: item.STKKOD,
    STKNAME: item.STKCINSI || null,
    STKCINSI: item.STKCINSI || null,
    STKADET: parseInt(item.quantity),
    STKBIRIMFIYAT: parseFloat(item.STKOZKOD5) || 0,
    STKBIRIMFIYATTOPLAM: (parseFloat(item.STKOZKOD5) || 0) * item.quantity,
    CIKISFISEVRNO: cikisFisEvrNo,
    SATISIRSEVRNO: satisIrsaliyesiEvrNo,
    HARREFDEGER1: harRefDeger,
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

const updateSTKKART = async (STKKOD, quantity) => {
  try {
    const stkKart = await getDataByUnique("STKKART", { STKKOD: STKKOD });
    //console.log("stkKart", stkKart);

    if (stkKart && typeof stkKart === "object" && !stkKart.error) {
      const currentSTKBAKIYE = parseFloat(stkKart.STKBAKIYE) || 0;
      const newSTKBAKIYE = Math.max(currentSTKBAKIYE - quantity, 0);

      const updateSTKKART = await updateDataByAny(
        "STKKART",
        { STKKOD: STKKOD },
        {
          STKBAKIYE: newSTKBAKIYE,
          STKEKDATE1: now, // Sipariş oluşturulma tarihini ekliyoruz
        }
      );

      //console.log("updateSTKKART", updateSTKKART);
    }
  } catch (error) {
    console.error(`STKKART güncellenirken hata oluştu (${STKKOD}):`, error);
  }
};

const updateSTKMIZDEGERYEDEK = async (orderItems, currentDate) => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // En güncel STKMIZDEGERYEDEK verilerini çek
  const latestSTKMIZDEGERYEDEK = await getDataByMany("STKMIZDEGERYEDEK", {
    STKYIL: currentYear,
    STKAY: currentMonth,
  });
  //console.log("latestSTKMIZDEGERYEDEK", latestSTKMIZDEGERYEDEK);

  for (const item of orderItems) {
    const { STKKOD, STKADET, STKBIRIMFIYATTOPLAM } = item;

    // STKRAKTIP değerleri için döngü
    for (const STKRAKTIP of [1, 6, 8]) {
      // Mevcut ayda bu STKKOD ve STKRAKTIP için veri var mı kontrol et
      const existingRecord = latestSTKMIZDEGERYEDEK.find(
        (record) =>
          record.STKKOD === STKKOD &&
          record.STKRAKTIP === STKRAKTIP &&
          record.STKYIL === currentYear &&
          record.STKAY === currentMonth
      );

      if (existingRecord) {
        // Veri varsa güncelle
        let newSTKALACAK = existingRecord.STKALACAK;

        switch (STKRAKTIP) {
          case 1:
            newSTKALACAK += STKADET;
            break;
          case 6:
            newSTKALACAK += STKBIRIMFIYATTOPLAM;
            break;
          case 8:
            newSTKALACAK += 1;
            break;
        }

        const updateSTKMIZDEGERYEDEK = await updateDataByAny(
          "STKMIZDEGERYEDEK",
          { STKKOD, STKRAKTIP, STKYIL: currentYear, STKAY: currentMonth },
          { STKALACAK: parseInt(newSTKALACAK) }
        );

        //console.log("updateSTKMIZDEGERYEDEK", updateSTKMIZDEGERYEDEK);
      } else {
        // Veri yoksa yeni kayıt oluştur

        const newSTKALACAK =
          STKRAKTIP === 1
            ? STKADET
            : STKRAKTIP === 6
            ? STKBIRIMFIYATTOPLAM
            : STKRAKTIP === 8
            ? 1
            : 0;
        parseInt(newSTKALACAK);
        const newRecord = {
          STKKOD,
          STKYIL: currentYear,
          STKAY: currentMonth,
          STKRAKTIP,
          STKDOVKOD: "",
          STKBORC: 0,
          STKALACAK: newSTKALACAK,
          STKDEPO: "",
        };

        const createNewData2 = await createNewData(
          "STKMIZDEGERYEDEK",
          newRecord
        );
        //console.log("createNewData2", createNewData2);
      }
    }
  }
};

const getLastSTKFIS = async () => {
  const lastSTKFIS = await getDataByUniqueSingle(
    "STKFIS",
    {},
    { STKFISREFNO: "desc" }
  );
  //console.log("lastSTKFIS", lastSTKFIS);

  // Varsayılan değerler ile gelen değeri birleştiriyoruz
  const reducedSTKFIS = {
    STKFISREFNO: 0,
    STKFISEVRAKNO1: "SF-000000",
    STKFISEVRAKNO2: "WEB-000000",
    ...lastSTKFIS, // Eğer lastSTKFIS boş değilse, onun değerleri bu objeyi overwrite eder
  };

  return reducedSTKFIS;
};

const getStkFisRefNo = async () => {
  const allSTKFIS = await getLastSTKFIS();

  return allSTKFIS.STKFISREFNO + 1;
};

const createSTKFIS = async (orderData, lastSTKFIS, lastSTKFISREFNO) => {
  const newSTKFISREFNO = lastSTKFISREFNO;
  const newSFNumber = parseInt(lastSTKFIS.STKFISEVRAKNO1.split("-")[1]) + 1;
  const newWEBNumber = parseInt(lastSTKFIS.STKFISEVRAKNO2.split("-")[1]) + 1;

  const stkfisEntry = {
    STKFISTAR: new Date(),
    STKFISREFNO: newSTKFISREFNO,
    STKFISTIPI: 3,
    STKFISGCFLAG: 2,
    STKFISKAYONC: 2,
    STKFISDEPO: 0,
    STKFISOZELFIS: 0,
    STKFISIADE: 0,
    STKFISKAYNAK: 3,
    STKFISCARKOD: orderData.CARKOD,
    STKFISREFNO2: 0,
    STKFISANADEPO: " ",
    STKFISKARDEPO: " ",
    STKFISOZKOD1: " ",
    STKFISOZKOD2: " ",
    STKFISOZKOD3: " ",
    STKFISACIKLAMA1: orderData.STKCINSI,
    STKFISACIKLAMA2: " ",
    STKFISACIKLAMA3: " ",
    STKFISEVRAKNO1: `SF-${newSFNumber.toString().padStart(6, "0")}`,
    STKFISEVRAKNO2: `WEB-${newWEBNumber.toString().padStart(6, "0")}`,
    STKFISEVRAKNO3: " ",
    STKFISDOVTAR: new Date(),
    STKFISPARTIKOD: " ",
    STKFISMASMER: " ",
    STKFISTOPBTUT: orderData.ORDERFIYATTOPLAM,
    STKFISTOPISK: 0,
    STKFISTOPNTUT: orderData.ORDERFIYATTOPLAM,
    STKFISTOPKDV: 0,
    STKFISTOPKTUT: orderData.ORDERFIYATTOPLAM,
    STKFISSEVNO: 1,
    STKFISISYKOD: "MERKEZ",
    STKFISOTVFLAG: 0,
    STKFISTOPOTV: 0,
    STKFISTOPOTUT: orderData.ORDERFIYATTOPLAM,
    STKFISDOVKOD: " ",
    STKFISDOVTUR: " ",
    STKFISDOVKUR: 0,
    STKFISDOVTOP: 0,
    STKFISTRNTAR: new Date("1900-01-01"),
    STKFISTRNREFNO: 0,
    STKFISTRNTIPI: 0,
    STKFISDISTIP: 0,
    STKFISDISKOD: "0",
    STKFISMUHREFNO: 0,
  };

  const newSkfisData = await createNewData("STKFIS", stkfisEntry);
  //console.log("newSkfisData", newSkfisData);

  // SIRKETLOG oluştur
  await createSIRKETLOG(newSTKFISREFNO, new Date());

  return newSTKFISREFNO;
};

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

const createSTKHAR = async (orderItem, lastSTKFISREFNO, siraNo) => {
  const stkharEntry = {
    STKHARTAR: now,
    STKHARREFNO: lastSTKFISREFNO,
    STKHARTIPI: 3,
    STKHARGCFLAG: 2,
    STKHARKAYONC: 2,
    STKHARDEPO: 0,
    STKHAROZELFIS: 0,
    STKHARIADE: 0,
    STKHARKAYNAK: 6,
    STKHARCARKOD: orderItem.CARKOD,
    STKHARREFNO2: 0,
    STKHARANADEPO: " ",
    STKHARKARDEPO: " ",
    STKHARSTKKOD: orderItem.STKKOD,
    STKHARSTKCINS: orderItem.STKNAME,
    STKHARSTKBRM: " ",
    STKHARBARKOD: " ",
    STKHAROZDESKOD: " ",
    STKHARBENZERKOD: " ",
    STKHARMIKTAR: orderItem.STKADET,
    STKHARMIKTAR2: 0,
    STKHARMIKTAR3: 0,
    STKHARMIKTAR4: 0,
    STKHARMIKTAR5: 0,
    STKHARFIYAT: orderItem.STKBIRIMFIYAT,
    STKHARTUTAR: orderItem.STKBIRIMFIYATTOPLAM,
    STKHARDOVKOD: " ",
    STKHARDOVTUR: " ",
    STKHARDOVTUTAR: 0,
    STKHAROZKOD: " ",
    STKHARACIKLAMA: " ",
    STKHARKDVYUZ: 0,
    STKHARISKYUZ1: 0,
    STKHARISKYUZ2: 0,
    STKHARISKYUZ3: 0,
    STKHARISKYUZ4: 0,
    STKHARISKYUZ5: 0,
    STKHARISKYTUT1: 0,
    STKHARISKYTUT2: 0,
    STKHARISKYTUT3: 0,
    STKHARISKYTUT4: 0,
    STKHARISKYTUT5: 0,
    STKHARISKGTUT1: 0,
    STKHARISKGTUT2: 0,
    STKHARISKGTUT3: 0,
    STKHARISKGTUT4: 0,
    STKHARISKGTUT5: 0,
    STKHARDIGERIND: 0,
    STKHARTOPLAMIND: 0,
    STKHARKDVMATRAH: orderItem.STKBIRIMFIYATTOPLAM,
    STKHARKDVTUTAR: 0,
    STKHARTOPLAMTUT: orderItem.STKBIRIMFIYATTOPLAM,
    STKHARVADETAR: new Date("1900-01-01"),
    STKHARACIKLAMA1: " ",
    STKHARACIKLAMA2: " ",
    STKHARACIKLAMA3: " ",
    STKHARPARTINO: " ",
    STKHARMASMER: " ",
    STKHARSERINO1: " ",
    STKHARSERINO2: " ",
    STKHARRB1: 0,
    STKHARRB2: 0,
    STKHARRB3: 0,
    STKHARRB4: 0,
    STKHARRB5: 0,
    STKHARFIYTIP: " ",
    STKHARSIRANO: siraNo,
    STKHARTOPLAMMAS: 0,
    STKHARNETTUTAR: orderItem.STKBIRIMFIYATTOPLAM,
    STKHARNETFIYAT: orderItem.STKBIRIMFIYAT,
    STKHARMALIYET: 0,
    STKHAROTVMATRAH: orderItem.STKBIRIMFIYATTOPLAM,
    STKHAROTVORAN: 0,
    STKHAROTVFIYAT: 0,
    STKHARTOPOTV: 0,
    STKHAROTVTUTAR: orderItem.STKBIRIMFIYATTOPLAM,
    STKHARDOVFIYAT: 0,
    STKHAREBTEN: 0,
    STKHAREBTBOY: 0,
    STKHAREBTYUK: 0,
    STKHAREBTHCM: 0,
    STKHAREBTAGR: 0,
    STKHAREKCHAR1: " ",
    STKHAREKCHAR2: " ",
    STKHAREKINT1: 0,
    STKHAREKINT2: 0,
    STKHAREKDATE1: new Date("1900-01-01"),
    STKHAREKDATE2: new Date("1900-01-01"),
    STKHAREKTUT1: 0,
    STKHAREKTUT2: 0,
    STKHAREKMIK1: 0,
    STKHAREKMIK2: 0,
    STKHAREKDOVTUT1: 0,
    STKHAREKDOVTUT2: 0,
    STKHAREKORAN1: 0,
    STKHAREKORAN2: 0,
    STKHARDOVKUR: 0,
    STKHARDISTIP: 0,
    STKHARDISKOD: " ",
  };

  try {
    const newStkharData = await createNewData("STKHAR", stkharEntry);
    //console.log("newStkharData", newStkharData);

    return newStkharData;
  } catch (error) {
    console.error("Yeni STKHAR verisi oluşturulamadı:", error);
    throw error;
  }
};

// const getLastIRSHAR = async () => {
//   const lastIRSHAR = await getDataByUnique(
//     'IRSHAR',
//     {},
//     { IRSHARREFNO: 'desc' }
//   );

//   // Varsayılan değer ile gelen değeri birleştiriyoruz
//   const reducedIRSHAR = {
//     IRSHARREFNO: 0,
//     ...lastIRSHAR, // Eğer lastIRSHAR boş değilse, onun değerleri bu objeyi overwrite eder
//   };
//   return reducedIRSHAR;
// };

const createIRSHAR = async (orderItem, createdIRSFISREFNO, siraNo) => {
  const newIRSHARREFNO = createdIRSFISREFNO;

  const irsharEntry = {
    IRSHARTAR: now,
    IRSHARREFNO: newIRSHARREFNO,
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
    //console.log("newIrsharData", newIrsharData);

    return newIRSHARREFNO;
  } catch (error) {
    console.error("Yeni IRSHAR verisi oluşturulamadı:", error);
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

const createIRSFIS = async (
  orderData,
  lastIRSFIS,
  createdSTKFISREFNO,
  lastSTKFIS
) => {
  const newIRSFISREFNO = lastIRSFIS.IRSFISREFNO + 1;
  const irsFisDate = new Date();
  const irsFisHour = irsFisDate.getHours().toString().padStart(2, "0");
  const irsFisMinute = irsFisDate.getMinutes().toString().padStart(2, "0");
  const irsFisTimeInfo = `${irsFisHour}:${irsFisMinute}`;
  const newWEBNumber = parseInt(lastSTKFIS.STKFISEVRAKNO2.split("-")[1]) + 1;

  const irsfisEntry = {
    IRSFISREFNO: newIRSFISREFNO,
    IRSFISTAR: now,
    IRSFISTIPI: 3,
    IRSFISGCFLAG: 2,
    IRSFISKAYONC: 1,
    IRSFISIPTALFLAG: 0,
    IRSFISKAYNAK: 6,
    IRSFISSTKREFNO: createdSTKFISREFNO,
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
    IRSFISCARKOD: orderData.CARKOD,
    IRSFISCARUNVAN: orderData.CARUNVAN,
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
    IRSFISMALTOP: orderData.ORDERFIYATTOPLAM,
    IRSFISKALINDYTOP: 0,
    IRSFISKALINDTTOP: 0,
    IRSFISSATINDTOP: 0,
    IRSFISGENINDTOP: 0,
    IRSFISSATMASTOP: 0,
    IRSFISGENMASTOP: 0,
    IRSFISBRUTTOPLAM: orderData.ORDERFIYATTOPLAM,
    IRSFISKDVMATRAHI: orderData.ORDERFIYATTOPLAM,
    IRSFISKDVTUTARI: 0,
    IRSFISARATOPLAM: orderData.ORDERFIYATTOPLAM,
    IRSFISKDVALTIINDTOP: 0,
    IRSFISKDVALTIEKTOP: 0,
    IRSFISGENTOPLAM: orderData.ORDERFIYATTOPLAM,
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
    IRSFISTOPOTUT: orderData.ORDERFIYATTOPLAM,
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

  const newIrsfisData = await createNewData("IRSFIS", irsfisEntry);
  //console.log("newIrsfisData", newIrsfisData);

  return newIRSFISREFNO;
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { cartItems, totalPrice, userId, userName } = req.body;

      const { harRefDeger, cikisFisEvrNo, satisIrsaliyesiEvrNo } =
        await getAndUpdateReferences();

      const orderItems = prepareOrderData(
        cartItems,
        totalPrice,
        userId,
        userName,
        harRefDeger,
        cikisFisEvrNo,
        satisIrsaliyesiEvrNo
      );

      const [lastSTKFIS, lastIRSFIS, /*lastIRSHAR,*/ lastSTKFISREFNO] =
        await Promise.all([
          getLastSTKFIS(),
          getLastIRSFIS(),
          //getLastIRSHAR(),
          getStkFisRefNo(),
        ]);

      const newSFNumber = parseInt(lastSTKFIS.STKFISEVRAKNO1.split("-")[1]) + 1;
      const newWEBNumber =
        parseInt(lastSTKFIS.STKFISEVRAKNO2.split("-")[1]) + 1;

      for (const item of orderItems) {
        const newIRSFISREFNO = lastIRSFIS.IRSFISREFNO + 1;
        const entry = {
          ...item,
          STKFISREFNO: lastSTKFISREFNO,
          STKFISEVRAKNO1: `SF-${newSFNumber.toString().padStart(6, "0")}`,
          STKFISEVRAKNO2: `WEB-${newWEBNumber.toString().padStart(6, "0")}`,
          ACIKLAMA: null,
          ORDERSTATUS: "Sipariş Oluşturuldu",
          TALEP: "",
          CEVAP: "",
          REFNO: newIRSFISREFNO,
          EKXTRA5: null,
          EKXTRA6: null,
          EKXTRA7: null,
          EKXTRA8: null,
          EKXTRA9: null,
        };

        const responseCreateNewData = await createNewData("ALLORDERS", entry);
        //console.log("responseCreateNewData", responseCreateNewData);
        const responseUpdateSTKKART = await updateSTKKART(
          item.STKKOD,
          item.STKADET
        );
      }

      // STKMIZDEGERYEDEK tablosunu güncelle
      await updateSTKMIZDEGERYEDEK(orderItems, now);

      // STKFIS ve SIRKETLOG oluştur
      const createdSTKFISREFNO = await createSTKFIS(
        orderItems[0],
        lastSTKFIS,
        lastSTKFISREFNO
      );

      // IRSFIS oluştur
      const createdIRSFISREFNO = await createIRSFIS(
        orderItems[0],
        lastIRSFIS,
        createdSTKFISREFNO,
        lastSTKFIS
      );

      // STKHAR ve IRSHAR oluştur
      const createdSTKHARs = [];
      const createdIRSHARs = [];
      let siraNo = 0;
      for (const item of orderItems) {
        siraNo++;

        const createdSTKHAR = await createSTKHAR(
          item,
          lastSTKFISREFNO,
          siraNo
          //createdSTKFISREFNO,
        );
        createdSTKHARs.push(createdSTKHAR);

        const createdIRSHAR = await createIRSHAR(
          item,
          createdIRSFISREFNO,
          siraNo
          //lastIRSHAR
        );
        createdIRSHARs.push(createdIRSHAR);
      }

      // CARKART tablosundaki CARCIKIRSTOP değerini güncelle
      const userCARKART = await getDataByUnique("CARKART", { CARKOD: userId });
      //console.log("userCARKART", userCARKART);

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
        //console.log("responseUpdateDataByAny", responseUpdateDataByAny);
      } else {
      }

      return res.status(200).json({
        success: true,
        message: "Order items created successfully",
        createdSTKFISREFNO: createdSTKFISREFNO,
        createdIRSFISREFNO: createdIRSFISREFNO,
      });
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating order items",
        error: error.message,
      });
    }
  } else if (req.method === "GET") {
    try {
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
