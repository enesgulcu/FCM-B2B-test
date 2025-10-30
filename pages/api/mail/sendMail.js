import nodemailer from "nodemailer";

async function sendPasswordEmail(email, password) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL,
      pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: `"Çalışkan Arı Yayınları" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Yeni Şifreniz",
    text: `Merhaba,\n\nYeni şifreniz: ${password}\n\nBu bilgiler ile giriş yapabilirsiniz. \n\n Mail adresiniz: ${email}`,
    html: `<p>Merhaba,</p><p>Yeni şifreniz: <strong>${password}</strong></p><p>Mail bilginiz: <strong>${email}</strong></p><p>Bu bilgiler ile giriş yapabilirsiniz.</p>`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("E-posta gönderme hatası:");
    console.error("Hata mesajı:", error.message);
    console.error("Hata detayları:", error);
    return false;
  }
}

export default sendPasswordEmail;
