export const mainCategory=[
    "1.Sınıf",
    "2.Sınıf",
    "3.Sınıf",
    "4.Sınıf",
    "Hikaye",
    "Set",
    "Soru Bankası"
]

export const subCategory=[
    "Genel",
    "Fen Bilgisi",
    "Sosyal Bilgisi",
    "Hayat Bilgisi",
    "Matematik",
    "Türkçe"
]
const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık"
  ];
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript'te aylar 0'dan başlar, bu yüzden +1 ekliyoruz
  const currentYear = currentDate.getFullYear();
  
  const formattedDate = `${currentDay} ${months[currentMonth - 1]} ${currentYear}`;
export const products = [
  
      {
        id: 2,
        checkbox: <input type="checkbox" />,
        imgPath:"/assets/images/evOdev.jpeg",
        category:{
            mainCategory:mainCategory[0],
            subCategory:subCategory[0]

        },
        name:"Ev Ödevi",
        active:false,
        stok:"ED-001",
        stokCount:20,
        price:45.00,
        date:{
            productAdditionDate:"20 Nisan 2024",
            lastUpdateDate:formattedDate
        }  ,
        published:true,   
        writer:"Emrah Eskibağcı",
        publisher:"Çalışkan Arı",
        barkod:"111111111111",
        bookDetail:{
            printingLang:"Türkçe",
            numberOfPages:"500 sayfa",
            coverType:"Karton",
            paperType:"2.Hamur",
            placeOfPublication:"Ankara",
            width:"135,00",
            height:"210,00"
        },
        desc:"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
      },  {
        id: 1,
        checkbox: <input type="checkbox" />,
        imgPath:"/assets/images/akildefterim.png",
        category:{
            mainCategory:mainCategory[0],
            subCategory:subCategory[0]

        },
        name:"Akıl Defterim ",
        active:false,
        stok:"AD-001",
        stokCount:20,
        price:35.00,
        date:{
            productAdditionDate:"22 Nisan 2024",
            lastUpdateDate:formattedDate
        },
        published:true,
        writer:"Emrah Eskibağcı",
        publisher:"Çalışkan Arı",
        barkod:"111111111111",
        bookDetail:{
            printingLang:"Türkçe",
            numberOfPages:"500 sayfa",
            coverType:"Karton",
            paperType:"2.Hamur",
            placeOfPublication:"Ankara",
            width:"135,00",
            height:"210,00"
        },
        desc:"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."

      },
      {
        id: 3,
        checkbox: <input type="checkbox" />,
        imgPath:"/assets/images/fen3.png",
        category:{
            mainCategory:mainCategory[2],
            subCategory:subCategory[1]

        },
        name:"Fen Bilgisi",
        active:false,
        stok:"FB-003",
        stokCount:20,
        price:75.00,
        date:{
            productAdditionDate:"20 Nisan 2024",
            lastUpdateDate:formattedDate
        }    ,
        published:false, 
        writer:"Emrah Eskibağcı" ,
        publisher:"Çalışkan Arı",
        barkod:"111111111111",
        bookDetail:{
            printingLang:"Türkçe",
            numberOfPages:"500 sayfa",
            coverType:"Karton",
            paperType:"2.Hamur",
            placeOfPublication:"Ankara",
            width:"135,00",
            height:"210,00"
        },
        desc:"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
  
      },
      {
        id: 4,
        checkbox: <input type="checkbox" />,
        imgPath:"/assets/images/fen4.png",
        category:{
            mainCategory:mainCategory[3],
            subCategory:subCategory[1]

        },
        name:"Fen Bilgisi",
        active:false,
        stok:"FB-004",
        stokCount:20,
        price:75.00,
        date:{
            productAdditionDate:"20 Nisan 2024",
            lastUpdateDate:formattedDate
        }   ,
        published:false,   
        writer:"Emrah Eskibağcı",
        publisher:"Çalışkan Arı",
        barkod:"111111111111",
        bookDetail:{
            printingLang:"Türkçe",
            numberOfPages:"500 sayfa",
            coverType:"Karton",
            paperType:"2.Hamur",
            placeOfPublication:"Ankara",
            width:"135,00",
            height:"210,00"
        },
        desc:"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
 
      },
      {
        id: 5,
        checkbox: <input type="checkbox" />,
        imgPath:"/assets/images/hayat1.png",
        category:{
            mainCategory:mainCategory[0],
            subCategory:subCategory[3]

        },
        name:"Hayat Bilgisi",
        active:false,
        stok:"HB-001",
        stokCount:20,
        price:75.00,
        date:{
            productAdditionDate:"20 Nisan 2024",
            lastUpdateDate:formattedDate
        }    ,
        published:false,  
        writer:"Emrah Eskibağcı",
        publisher:"Çalışkan Arı",
        barkod:"111111111111",
        bookDetail:{
            printingLang:"Türkçe",
            numberOfPages:"500 sayfa",
            coverType:"Karton",
            paperType:"2.Hamur",
            placeOfPublication:"Ankara",
            width:"135,00",
            height:"210,00"
        },
        desc:"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
  
      },
      {
        id: 6,
        checkbox: <input type="checkbox" />,
        imgPath:"/assets/images/mat1.png",
        category:{
            mainCategory:mainCategory[0],
            subCategory:subCategory[4]

        },
        name:"Matematik",
        active:true,
        stok:"MT-001",
        stokCount:20,
        price:75.00,
        date:{
            productAdditionDate:"20 Nisan 2024",
            lastUpdateDate:formattedDate
        }  ,
        published:true,   
        writer:"Emrah Eskibağcı" ,
        publisher:"Çalışkan Arı",
        barkod:"111111111111",
        bookDetail:{
            printingLang:"Türkçe",
            numberOfPages:"500 sayfa",
            coverType:"Karton",
            paperType:"2.Hamur",
            placeOfPublication:"Ankara",
            width:"135,00",
            height:"210,00"
        },
        desc:"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
  
      },
      {
        id: 7,
        checkbox: <input type="checkbox" />,
        imgPath:"/assets/images/mat2.png",
        category:{
            mainCategory:mainCategory[1],
            subCategory:subCategory[4]

        },
        name:"Matematik",
        active:true,
        stok:"MT-002",
        stokCount:20,
        price:85.00,
        date:{
            productAdditionDate:"20 Nisan 2024",
            lastUpdateDate:formattedDate
        }  ,
        published:true,    
        writer:"Emrah Eskibağcı",
        publisher:"Çalışkan Arı",
        barkod:"111111111111",
        bookDetail:{
            printingLang:"Türkçe",
            numberOfPages:"500 sayfa",
            coverType:"Karton",
            paperType:"2.Hamur",
            placeOfPublication:"Ankara",
            width:"135,00",
            height:"210,00"
        },
        desc:"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
 
      },
      {
        id: 8,
        checkbox: <input type="checkbox" />,
        imgPath:"/assets/images/mat3.png",
        category:{
            mainCategory:mainCategory[2],
            subCategory:subCategory[4]

        },
        name:"Matematik",
        active:true,
        stok:"MT-003",
        stokCount:20,
        price:95.00,
        date:{
            productAdditionDate:"20 Nisan 2024",
            lastUpdateDate:formattedDate
        }       ,
        published:true,
        writer:"Emrah Eskibağcı",
        publisher:"Çalışkan Arı",
        barkod:"111111111111",
        bookDetail:{
            printingLang:"Türkçe",
            numberOfPages:"500 sayfa",
            coverType:"Karton",
            paperType:"2.Hamur",
            placeOfPublication:"Ankara",
            width:"135,00",
            height:"210,00"
        },
        desc:"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
 
      },
      {
        id: 9,
        checkbox: <input type="checkbox" />,
        imgPath:"/assets/images/mat4.png",
        category:{
            mainCategory:mainCategory[3],
            subCategory:subCategory[4]

        },
        name:"Matematik",
        active:true,
        stok:"MT-004",
        stokCount:0,
        price:105.00,
        date:{
            productAdditionDate:"20 Nisan 2024",
            lastUpdateDate:formattedDate
        }      ,
        published:true, 
        writer:"Emrah Eskibağcı",
        publisher:"Çalışkan Arı",
        barkod:"111111111111",
        bookDetail:{
            printingLang:"Türkçe",
            numberOfPages:"500 sayfa",
            coverType:"Karton",
            paperType:"2.Hamur",
            placeOfPublication:"Ankara",
            width:"135,00",
            height:"210,00"
        },
        desc:"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
 
      },
      {
        id: 10,
        checkbox: <input type="checkbox" />,
        imgPath:"/assets/images/sosyal4.png",
        category:{
            mainCategory:mainCategory[3],
            subCategory:subCategory[2]

        },
        name:"Sosyal Bilgisi",
        active:true,
        stok:"SB-004",
        stokCount:0,
        price:85.00,
        date:{
            productAdditionDate:"20 Nisan 2024",
            lastUpdateDate:formattedDate
        }       ,
        published:true,
        writer:"Emrah Eskibağcı",
        publisher:"Çalışkan Arı",
        barkod:"111111111111",
        bookDetail:{
            printingLang:"Türkçe",
            numberOfPages:"500 sayfa",
            coverType:"Karton",
            paperType:"2.Hamur",
            placeOfPublication:"Ankara",
            width:"135,00",
            height:"210,00"
        },
        desc:"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
 
      },
      {
        id: 11,
        checkbox: <input type="checkbox" />,
        imgPath:"/assets/images/telafi1.png",
        category:{
            mainCategory:mainCategory[0],
            subCategory:subCategory[0]

        },
        name:"Telafi",
        active:true,
        stok:"TL-001",
        stokCount:0,
        price:55.00,
        date:{
            productAdditionDate:"20 Nisan 2024",
            lastUpdateDate:formattedDate
        }     ,
        published:true,  
        writer:"Emrah Eskibağcı",
        publisher:"Çalışkan Arı",
        barkod:"111111111111",
        bookDetail:{
            printingLang:"Türkçe",
            numberOfPages:"500 sayfa",
            coverType:"Karton",
            paperType:"2.Hamur",
            placeOfPublication:"Ankara",
            width:"135,00",
            height:"210,00"
        },
        desc:"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
 
      },
      {
        id: 12,
        checkbox: <input type="checkbox" />,
        imgPath:"/assets/images/tumders.png",
        category:{
            mainCategory:mainCategory[0],
            subCategory:subCategory[0]

        },
        name:"Tüm Dersler",
        active:true,
        stok:"TD-001",
        stokCount:0,
        price:85.00,
        date:{
            productAdditionDate:"20 Nisan 2024",
            lastUpdateDate:formattedDate
        }       ,
        published:true,
        writer:"Emrah Eskibağcı",
        publisher:"Çalışkan Arı",
        barkod:"111111111111",
        bookDetail:{
            printingLang:"Türkçe",
            numberOfPages:"500 sayfa",
            coverType:"Karton",
            paperType:"2.Hamur",
            placeOfPublication:"Ankara",
            width:"135,00",
            height:"210,00"
        },
        desc:"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
 
      },
      {
        id: 13,
        checkbox: <input type="checkbox" />,
        imgPath:"/assets/images/turkce1.png",
        category:{
            mainCategory:mainCategory[0],
            subCategory:subCategory[5]

        },
        name:"Türkçe",
        active:true,
        stok:"TC-001",
        stokCount:0,
        price:85.00,
        date:{
            productAdditionDate:"20 Nisan 2024",
            lastUpdateDate:formattedDate
        }       ,
        published:true,
        writer:"Emrah Eskibağcı",
        publisher:"Çalışkan Arı",
        barkod:"111111111111",
        bookDetail:{
            printingLang:"Türkçe",
            numberOfPages:"500 sayfa",
            coverType:"Karton",
            paperType:"2.Hamur",
            placeOfPublication:"Ankara",
            width:"135,00",
            height:"210,00"
        },
        desc:"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."

      },
      {
        id: 14,
        checkbox: <input type="checkbox" />,
        imgPath:"/assets/images/turkce3.png",
        category:{
            mainCategory:mainCategory[2],
            subCategory:subCategory[5]

        },
        name:"Türkçe",
        active:true,
        stok:"TC-003",
        stokCount:0,
        price:75.00,
        date:{
            productAdditionDate:"20 Nisan 2024",
            lastUpdateDate:formattedDate
        }      ,
        published:true, 
        writer:"Emrah Eskibağcı",
        publisher:"Çalışkan Arı",
        barkod:"111111111111",
        bookDetail:{
            printingLang:"Türkçe",
            numberOfPages:"500 sayfa",
            coverType:"Karton",
            paperType:"2.Hamur",
            placeOfPublication:"Ankara",
            width:"135,00",
            height:"210,00"
        },
        desc:"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
 
      },
      {
        id: 15,
        checkbox: <input type="checkbox" />,
        imgPath:"/assets/images/turkce4.png",
        category:{
            mainCategory:mainCategory[3],
            subCategory:subCategory[5]

        },
        name:"Türkçe",
        active:true,
        stok:"TC-004",
        stokCount:0,
        price:95.00,
        date:{
            productAdditionDate:"20 Nisan 2024",
            lastUpdateDate:formattedDate
        }       ,
        published:true,
        writer:"Emrah Eskibağcı",
        publisher:"Çalışkan Arı",
        barkod:"111111111111",
        bookDetail:{
            printingLang:"Türkçe",
            numberOfPages:"500 sayfa",
            coverType:"Karton",
            paperType:"2.Hamur",
            placeOfPublication:"Ankara",
            width:"135,00",
            height:"210,00"
        },
        desc:"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."

      },
]


export const status = [
    { name: "Tümü", count: products.length },
   
  ];