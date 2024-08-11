// Genel API istek fonksiyonu
const apiRequest = async (
  URL,
  method = "GET",
  body = null,
  headers = { "Content-Type": "application/json" }
) => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL || !URL) {
      throw new Error("URL bulunamadı!");
    }

    const options = {
      method: method,
      headers: headers,
      cache: "no-store",
    };
    // cache önemli! her çalıştığında cache'deki veri yerine -> güncel veriyi almasını sağlar.
    // bu olmaz ise üncel veriyi almayabiliyor dikkat et.
    // Dinamik sayfalarda burası kullanılıyorsa o sayfalara -> export const dynamic = 'force-dynamic' ekle!

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL + URL}`,
      options
    );

    if (response.url.includes("/notification") && response.redirected) {
      if (typeof window !== "undefined") {
        window.location.href = response.url;
        return;
      }
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`API request failed: ${err}`);
    throw err;
  }
};

// GET isteği için yardımcı fonksiyon
const getAPI = (URL, headers) => apiRequest(URL, "GET", null, headers);

// POST isteği için yardımcı fonksiyon
const postAPI = (URL, body, headers) => apiRequest(URL, "POST", body, headers);

// PUT isteği için yardımcı fonksiyon
const putAPI = (URL, body, headers) => apiRequest(URL, "PUT", body, headers);

// PATCH isteği için yardımcı fonksiyon
const patchAPI = (URL, body, headers) =>
  apiRequest(URL, "PATCH", body, headers);

// DELETE isteği için yardımcı fonksiyon
const deleteAPI = (URL, headers) => apiRequest(URL, "DELETE", null, headers);

export { getAPI, postAPI, putAPI, patchAPI, deleteAPI };
