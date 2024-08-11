const PasswordGenerator = async (email) => {
  // E-posta adresinin '@' işaretinden önceki kısmını alın
  const username = email.split("@")[0];

  // İlk 3 harfi alın ve büyük harfe çevirin
  const userName = username.slice(0, 3).toUpperCase();

  // 100-999 arasında rastgele sayı oluşturma fonksiyonu
  function generateRandomNumber() {
    return Math.floor(Math.random() * 900) + 100;
  }

  // Rastgele 3 basamaklı sayılar oluşturun
  const leftRandom = generateRandomNumber();
  const rightRandom = generateRandomNumber();

  // Şifreyi oluşturun
  const password = `${leftRandom}${userName}${rightRandom}`;
  return password;
};

export default PasswordGenerator;
