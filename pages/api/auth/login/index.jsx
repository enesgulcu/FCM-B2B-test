// import loginFunction from "@/functions/auth/login/index";
// import mailStringCheck from "@/functions/other/mailStringCheck";
// import { NextApiRequest, NextApiResponse } from 'next';

import DecryptPassword from "@/functions/other/cryptology/decryptPassword";
import EncryptPassword from "@/functions/other/cryptology/encryptPassword";
import PasswordGenerator from "@/functions/other/PasswordGenerator";
import { getDataByUnique, updateDataByAny } from "@/services/serviceOperations";
import sendPasswordEmail from "../../mail/sendMail";

const handler = async (req, res) => {
  if (!req) {
    return res.status(500).json({ error: "İstek bulunamadı." });
  }

  // ADMIN PANELİ GİRİŞİ
  // EMAIL: caliskanariyayinlari@gmail.com
  // PASSWORD: Ts1967Gs1905@@922SS

  //$2y$10$qdByGVE4u0N8OYiWvt36Ce4  + DP2og5Ui3JVGBuDS.WuVH5sjaetpFK
  // HASH BCRYPT: veri tabanı

  const data = req.body;

  if (req.method === "POST") {
    try {
      /*{ ÖRNEK VERİ YAPISI
                CARKOD: '120 07 006',
                CARUNVAN: 'FAZİLET KIRTASİYE',
                CARUNVAN3: 'halil_1226@hotmail.com',
                CAROZKOD1: 'A',
                CAROZKOD2: ' ',
                CAROZKOD3: 'B2',
                CAROZKOD4: ''
                CAROZKOD5: 'şifre123'
              },*/

      // CARUNVAN3 VE CAROZKOD3 değerlerine göre sorgulama yapılacak.
      const findUser = await getDataByUnique(
        "CARKART",
        {
          CARUNVAN3: data.email,
          CAROZKOD1: "A",
          CAROZKOD3: "B2",
        },
        2024
      ); // 2024 veritabanından sorgulama yapıyoruz

      if (
        !findUser ||
        findUser === null ||
        findUser === undefined ||
        findUser === ""
      ) {
        throw new Error(
          "Kullanıcı bulunamadı. Lütfen bilgilerinizi kontrol ediniz."
        );
      }

      // findUser.CAROZKOD5 -> Şifre
      // ŞİFRE KONTROLÜ
      else if (
        findUser &&
        findUser.CAROZKOD5 &&
        findUser.CAROZKOD5 !== " " &&
        findUser.CAROZKOD5 !== ""
      ) {
        // ADMIN ŞİFRE DOĞRULAMA // SADECE ADMİNE ÖZEL ÇALIŞIR.
        if (
          findUser?.CARKOD == "7034922" &&
          data?.email == "caliskanariyayinlari@gmail.com"
        ) {
          findUser.CAROZKOD5 =
            findUser.CAROZKOD5 + "DP2og5Ui3JVGBuDS.WuVH5sjaetpFK";
        }

        const passwordCheck = await DecryptPassword(
          data.password,
          findUser.CAROZKOD5
        );

        if (!passwordCheck) {
          throw new Error(
            "Şifre eşleşmesi başarısız. Lütfen şifrenizi kontrol ediniz."
          );
        }

        // Şifre doğru ise kullanıcı bilgilerini döndür.

        return res
          .status(200)
          .json({ success: true, message: "Giriş işlemi başarılı", findUser });
      }

      // TANIMLANMIŞ ŞİFRE YOKSA YENİ ŞİFRE OTOMATİK OLUŞTURMA
      else if (
        (findUser && !findUser.CAROZKOD5) ||
        findUser.CAROZKOD5 === " " ||
        findUser.CAROZKOD5 === ""
      ) {
        // Şifre Sıfırlama işlemleri burada yapılacak
        const newPassword = await PasswordGenerator(data.email);
        // console.log("##### 2- ŞİFRE ÜRETİLDİ", newPassword);

        // Şifreleme işlemi
        const encryptedPassword = await EncryptPassword(newPassword);

        // Şifreleme işlemi başarılı mı kontrol et.
        if (!encryptedPassword) {
          throw new Error("Şifre hash sırasında bir hata oluştu.");
        }

        // Şifreleme işlemi başarılı ise yeni şifreyi veritabanına kaydet.
        const updatePassword = await updateDataByAny(
          "CARKART",
          { CARKOD: findUser?.CARKOD },
          { CAROZKOD5: encryptedPassword },
          2024 // 2024 veritabanında güncelleme yapıyoruz
        );

        // ("updatePassword: ", updatePassword);

        if (!updatePassword) {
          throw new Error("Şifre veritabanına kaydedilirken bir hata oluştu.");
        }

        // Yeni şifreyi kullanıcıya e-posta olarak gönder

        const emailSent = await sendPasswordEmail(data.email, newPassword);

        if (!emailSent) {
          console.error("E-posta gönderme hatası detayları:", emailSent);
          throw new Error("Yeni şifre e-posta ile gönderilemedi.");
        }

        return res.status(200).json({
          success: true,
          message:
            "Yeni şifreniz e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.",
          isNewPassword: true,
        });
      } else {
        throw new Error("İşlem sırasında bir hata oluştu.");
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } //  else {
  //   const response = updateDataByAny(
  //     "CARKART",
  //     { CARKOD: "120 01 002" },
  //     { CAROZKOD5: " " }
  //   );
  //   return res.status(200).json({ data: response });
  // }
};

export default handler;
