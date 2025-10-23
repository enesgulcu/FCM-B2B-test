import nodemailer from "nodemailer";

async function sendPasswordEmail(email, password) {
  // Gmail App Password ile transporter oluştur
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL,
      pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD, // 16-char App Password
    },
  });

  let mailOptions = {
    from: `"Çalışkan Arı Yayınları" <${process.env.NEXT_PUBLIC_EMAIL}>`,
    to: email,
    subject: "Yeni Şifreniz",
    text: `Merhaba,\n\nYeni şifreniz: ${password}\n\nBu bilgiler ile giriş yapabilirsiniz. \n\n Mail adresiniz: ${email}`,
    html: `<p>Merhaba,</p><p>Yeni şifreniz: <strong>${password}</strong></p><p>Mail bilginiz: <strong>${email}</strong></p><p>Bu bilgiler ile giriş yapabilirsiniz.</p>`,
  };

  try {
    // Transporter bağlantısını test et
    await transporter.verify();
    console.log("✅ SMTP bağlantısı başarılı");

    let info = await transporter.sendMail(mailOptions);
    console.log("✅ E-posta gönderildi:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ E-posta gönderme hatası:", error.message);
    console.error("Hata kodu:", error.code);
    console.error("Hata detayları:", error);
    return false;
  }
}

export default sendPasswordEmail;
