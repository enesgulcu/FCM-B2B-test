import { prisma, prismaEdis } from "@/lib/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function TestPage() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return <div className="p-4">Giriş Yapılmamış</div>;
    }

    // ADNAN (ETA_ADNAN_2025) veritabanından kullanıcı bilgileri
    const resultAdnan = await prisma.CARKART.findFirst({
      where: { CARKOD: session.user.id },
      select: { CARKOD: true, CARVERHESNO: true, CARUNVAN: true, CARUNVAN3: true },
    });

    // EDIS: CARUNVAN3 (email) ile eşleşen tüm CARKOD'lar
    let edisCariByEmail = [];
    let selectedEdisCarkod = null;
    
    if (resultAdnan?.CARUNVAN3 && resultAdnan.CARUNVAN3.trim() !== "") {
      edisCariByEmail = await prismaEdis.CARKART.findMany({
        where: { CARUNVAN3: resultAdnan.CARUNVAN3 },
        select: { CARKOD: true, CARUNVAN: true, CARUNVAN3: true },
      });
      
      // CARUNVAN eşleşmesi ile doğru kaydı seç
      if (edisCariByEmail.length === 1) {
        selectedEdisCarkod = edisCariByEmail[0].CARKOD;
      } else if (edisCariByEmail.length > 1) {
        const normalize = (str) => (str || "").trim().toLowerCase().replace(/\\s+/g, " ");
        const matchByName = edisCariByEmail.find(
          (r) => normalize(r.CARUNVAN) === normalize(resultAdnan.CARUNVAN)
        );
        selectedEdisCarkod = matchByName ? matchByName.CARKOD : edisCariByEmail[0].CARKOD;
      }
    }

    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">ADNAN (ETA_ADNAN_2025) CARKART</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto mb-4">
          {resultAdnan
            ? JSON.stringify(resultAdnan, null, 2)
            : "Kayıt bulunamadı"}
	        </pre>

	        <h2 className="text-lg font-semibold mb-2">
	          EDIS&apos;te CARUNVAN3 (Email) ile Eşleşen Tüm Kayıtlar
	        </h2>
	        <pre className="bg-yellow-100 p-4 rounded text-sm overflow-auto mb-4">
	          {edisCariByEmail.length > 0
	            ? JSON.stringify(edisCariByEmail, null, 2)
	            : "CARUNVAN3 ile EDIS'te karşılık bulunamadı"}
	        </pre>

        <h2 className="text-lg font-semibold mb-2">
          Seçilen EDIS CARKOD (CARUNVAN eşleşmesi ile)
        </h2>
        <pre className="bg-green-100 p-4 rounded text-sm overflow-auto mb-4">
          {selectedEdisCarkod || "Seçilen CARKOD yok"}
        </pre>
        
        {selectedEdisCarkod && (
          <div className="mt-2 text-blue-700 font-bold text-xl">
            ✅ EDIS CARKOD: {selectedEdisCarkod}
          </div>
        )}
        
        {edisCariByEmail.length > 1 && (
          <div className="mt-4 p-4 bg-orange-100 rounded">
            <strong>⚠️ Birden fazla eşleşme bulundu!</strong>
            <p>CARUNVAN (firma adı) eşleşmesi ile doğru kayıt seçildi.</p>
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
