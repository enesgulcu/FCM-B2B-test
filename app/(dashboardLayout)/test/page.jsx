import { prisma, prisma2024, prismaEdis } from "@/lib/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function TestPage() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return <div className="p-4">Giriş Yapılmamış</div>;
    }

    // 2023 veritabanı sadece gösterilecek
    const result2023 = await prisma.CARKART.findFirst({
      where: { CARKOD: session.user.id },
      select: { CARKOD: true, CARVERHESNO: true },
    });

    // 2024'te giriş yapan kullanıcının CARVERHESNO'su bulunur
    const result2024 = await prisma2024.CARKART.findFirst({
      where: { CARKOD: session.user.id },
      select: { CARKOD: true, CARVERHESNO: true, CARUNVAN: true },
    });

    // EDIS: 2024'ten gelen CARVERHESNO ile eşleşen CARKOD bulunur
    let edisCarkod = null;
    let edisCari = null;
    if (result2024?.CARVERHESNO && result2024.CARVERHESNO.trim() !== "") {
      edisCari = await prismaEdis.CARKART.findFirst({
        where: { CARVERHESNO: result2024.CARVERHESNO },
        select: { CARKOD: true, CARVERHESNO: true, CARUNVAN: true },
      });
      edisCarkod = edisCari?.CARKOD || null;
    }

    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">2023 CARKART</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto mb-4">
          {result2023
            ? JSON.stringify(result2023, null, 2)
            : "Kayıt bulunamadı"}
        </pre>

        <h2 className="text-lg font-semibold mb-2">2024 CARKART</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto mb-4">
          {result2024
            ? JSON.stringify(result2024, null, 2)
            : "Kayıt bulunamadı"}
        </pre>

        <h2 className="text-lg font-semibold mb-2">
          EDIS CARKART (CARVERHESNO ile eşleşen CARKOD)
        </h2>
        <pre className="bg-green-100 p-4 rounded text-sm overflow-auto mb-4">
          {edisCari
            ? JSON.stringify(edisCari, null, 2)
            : "CARVERHESNO ile EDIS'te karşılık bulunamadı"}
        </pre>
        {edisCarkod && (
          <div className="mt-2 text-blue-700 font-bold">
            EDIS CARKOD: {edisCarkod}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Hata</h1>
        <pre className="bg-red-100 p-4 rounded text-sm overflow-auto">
          {error.message}
        </pre>
      </div>
    );
  }
}
