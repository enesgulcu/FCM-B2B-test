const PasswordGenerator = async (email) => {
  
    // E-posta adresinin '@' işaretinden önceki kısmını alın
  const username = email.split("@")[0];

  // Rastgele 4 haneli sayı oluşturma fonksiyonu
  function generateRandomNumbers(length) {
    let result = "";
    
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    
    return result;
  }

  // Rastgele 4 haneli sayılar oluşturun
  const leftRandom = generateRandomNumbers(4);
  const rightRandom = generateRandomNumbers(4);

  // Şifreyi oluşturun
  const password = `${leftRandom}${username}${rightRandom}`;
  return password;
};

export default PasswordGenerator;
