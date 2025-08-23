// tableName: eşleşecek tablonun ismi
// where:     eşleşecek tablodaki verinin anahtar değeri örn: {email: "enes.gulcu@hotmail.com"} (mail) değeri oluyor.
// newData:   yeni eklenecek veya güncellenecek veri

import { prisma, prisma2024, prismaEdis } from "@/lib/prisma";

// GET ALL
export async function getAllData(tableName, year = 2023) {
  let client;

  switch (year) {
    case 2024:
      client = prisma2024;
      break;
    case 2025:
      client = prismaEdis;
      break;
    default:
      client = prisma;
  }

  try {
    const data = await client[tableName].findMany();
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

// POST
export async function createNewData(tableName, newData) {
  try {
    const data = await prisma[tableName].create({ data: newData });
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

// GET BY UNIQUE ONE VALUE
export async function getDataByUnique(tableName, where, year ) {
  let client;

  switch (year) {
    case 2024:
      client = prisma2024;
      break;
    case 2025:
      client = prisma; // 2025 ana veritabanı
      break;
    default:
      client = prisma;
  }

  try {
    const data = await client[tableName].findFirst({ where: where });
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

// GET SINGLE BY ORDER
export async function getDataByUniqueSingle(
  tableName,
  where,
  orderBy,
  year = 2023
) {
  let client;

  switch (year) {
    case 2024:
      client = prisma2024;
      break;
    case 2025:
      client = prismaEdis;
      break;
    default:
      client = prisma;
  }

  try {
    const data = await client[tableName].findFirst({
      where: where,
      orderBy: orderBy,
    });
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

// GET BY UNIQUE MANY VALUE
export async function getDataByMany(tableName, where, year = 2023) {
  let client;

  switch (year) {
    case 2024:
      client = prisma2024;
      break;
    case 2025:
      client = prismaEdis;
      break;
    default:
      client = prisma;
  }

  try {
    const data = await client[tableName].findMany({ where: where });
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

// UPDATE
export async function updateDataByAny(tableName, where, newData) {
  try {
    const data = await prisma[tableName].update({
      where: where,
      data: newData,
    });
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

//DELETE
export async function deleteDataByAny(tableName, where) {
  try {
    const data = await prisma[tableName].delete({ where: where });
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

//DELETE MANY
export async function deleteDataByMany(tableName, where) {
  try {
    const data = await prisma[tableName].deleteMany({ where: where });
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

//DELETE ALL
export async function deleteDataAll(tableName) {
  try {
    const data = await prisma[tableName].deleteMany({});
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

//BU FONKSİYONLAR, SİPARİŞ DURUMUNU DEĞİŞTİRMEK İÇİNDİR. SÜREKLİ KULLANACAĞINIZ FONKSİYONLAR ÜSTTEKİ FONKSİYONLARDIR.
// ÖZEL FONKSİYONLARDIR LÜTFEN DEĞİŞTİRMEYİN, KULLANMAYIN. ****ILKER DEMIRCI****
export async function updateOrderStatus(tableName, where, newStatus) {
  try {
    const data = await prisma[tableName].updateMany({
      where: where,
      data: { ORDERSTATUS: newStatus },
    });

    // Eğer yeni durum "İptal" ise, ilgili diğer tabloları da güncelle
    if (newStatus === "İptal") {
      // Önce REFNO'yu alalım
      const order = await prisma[tableName].findFirst({
        where: where,
        select: { REFNO: true },
      });

      if (order && order.REFNO) {
        await updateRelatedTables(order.REFNO);
      }
    }

    return data;
  } catch (error) {
    return { error: error.message };
  }
}

export async function updateKargoStatus(tableName, where, kargoData) {
  try {
    const updateData = {};

    // Sadece değer varsa güncelleme nesnesine ekle
    if (kargoData.KARGO !== undefined) updateData.KARGO = kargoData.KARGO;
    if (kargoData.KARGOTAKIPNO !== undefined)
      updateData.KARGOTAKIPNO = kargoData.KARGOTAKIPNO;
    if (kargoData.ORDERSTATUS) updateData.ORDERSTATUS = kargoData.ORDERSTATUS;

    const data = await prisma[tableName].updateMany({
      where: where,
      data: updateData,
    });

    return data;
  } catch (error) {
    return { error: error.message };
  }
}

export async function updateRelatedTables(REFNO) {
  try {
    // IRSFIS tablosunu güncelle
    await prisma.IRSFIS.updateMany({
      where: { IRSFISREFNO: REFNO },
      data: { IRSFISIPTALFLAG: 1 },
    });

    // IRSHAR tablosunu güncelle
    await prisma.IRSHAR.updateMany({
      where: { IRSHARREFNO: REFNO },
      data: { IRSHARIPTALFLAG: 1 },
    });
  } catch (error) {
    console.error("Error updating related tables:", error);
    throw error;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAllData,

  createNewData,

  getDataByUnique,

  getDataByUniqueSingle,

  updateDataByAny,

  deleteDataByAny,

  deleteDataByMany,

  deleteDataAll,

  updateOrderStatus,
};
