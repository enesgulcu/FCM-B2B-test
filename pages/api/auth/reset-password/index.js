import { getDataByUnique, updateDataByAny } from "@/services/serviceOperations";
import PasswordGenerator from "@/functions/other/PasswordGenerator";
import EncryptPassword from "@/functions/other/cryptology/encryptPassword";
import sendPasswordEmail from "../../mail/sendMail";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { email } = req.body;

    let user;
    try {
      // Kullanıcıyı e-posta adresine göre bul
      user = await getDataByUnique("CARKART", {
        CARUNVAN3: email,
        CAROZKOD1: "A",
        CAROZKOD3: "B2",
      });

      if (!user) {
        return res.status(404).json({ error: "Kullanıcı bulunamadı." });
      }
    } catch (userError) {
      console.error("Kullanıcı arama hatası:", userError);
      return res
        .status(500)
        .json({ error: "Kullanıcı aranırken bir hata oluştu." });
    }

    let newPassword, encryptedPassword;
    try {
      // Yeni şifre oluştur
      newPassword = await PasswordGenerator(email);

      // Yeni şifreyi şifrele
      encryptedPassword = await EncryptPassword(newPassword);

      if (!encryptedPassword) {
        throw new Error("Şifre şifrelenemedi.");
      }
    } catch (passwordError) {
      console.error("Şifre oluşturma/şifreleme hatası:", passwordError);
      return res
        .status(500)
        .json({ error: "Şifre oluşturulurken bir hata oluştu." });
    }

    try {
      // Veritabanında şifreyi güncelle
      const updatePassword = await updateDataByAny(
        "CARKART",
        { CARKOD: user.CARKOD },
        { CAROZKOD5: encryptedPassword }
      );

      if (!updatePassword) {
        throw new Error("Şifre güncellenemedi.");
      }
    } catch (updateError) {
      console.error("Şifre güncelleme hatası:", updateError);
      return res
        .status(500)
        .json({ error: "Şifre güncellenirken bir hata oluştu." });
    }

    try {
      // Yeni şifreyi e-posta ile gönder
      const emailSent = await sendPasswordEmail(email, newPassword);

      if (!emailSent) {
        throw new Error("E-posta gönderilemedi.");
      }
    } catch (emailError) {
      console.error("E-posta gönderme hatası:", emailError);
      return res
        .status(500)
        .json({ error: "Yeni şifre e-posta ile gönderilemedi." });
    }

    return res.status(200).json({
      success: true,
      message: "Yeni şifreniz e-posta adresinize gönderildi.",
    });
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    return res
      .status(500)
      .json({ error: "Şifre sıfırlama işlemi sırasında bir hata oluştu." });
  }
}
