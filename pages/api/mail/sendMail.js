import nodemailer from "nodemailer";

async function sendPasswordEmail(email, password) {
  const mailUser = process.env.EMAIL;
  const mailPass = process.env.EMAIL_PASSWORD;

  if (!mailUser || !mailPass) {
    console.error("❌ EMAIL / EMAIL_PASSWORD env eksik");
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: mailUser,
      pass: mailPass.replace(/\s+/g, ""),
    },
  });

  const mailOptions = {
    from: `"Çalışkan Arı Yayınları" <${mailUser}>`,
    to: email,
    subject: "Yeni Şifreniz",
    text: `Merhaba,\n\nYeni şifreniz: ${password}\n\nBu bilgiler ile giriş yapabilirsiniz. \n\n Mail adresiniz: ${email}`,
    html: `<p>Merhaba,</p><p>Yeni şifreniz: <strong>${password}</strong></p><p>Mail bilginiz: <strong>${email}</strong></p><p>Bu bilgiler ile giriş yapabilirsiniz.</p>`,
  };

  try {
    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ E-posta gönderildi:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ E-posta gönderme hatası:", error.message);
    console.error("Hata kodu:", error.code);
    return false;
  }
}

export default sendPasswordEmail;
