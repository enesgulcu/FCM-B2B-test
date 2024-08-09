import NextAuth from "next-auth";
import CredentialsProvider, {  CredentialsConfig,} from "next-auth/providers/credentials";
import { postAPI } from "@/services/fetchAPI";

let loginPageRoute = "partner";

export const authOptions = {
  providers: [
    // CredentialsProvider ile email ve şifreyi kullanıcıdan alarak normal giriş yapmasını sağlarız.
    // farklı giriş yöntemleri ile (google - github - facebook) giriş için hazır "provider" ları kullanabiliriz.
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "role", type: "text" },
      },

      async authorize(credentials) {
        let { email, password, role } = credentials;

        const data = await postAPI(`/auth/login`, { role, email, password });

        if (data.error) {
          throw new Error(data.error);
        }

        // admin girişi yapılırsa admin paneline yönlendirme yapılır.
        if (data.findUser?.CARKOD === "7034922") {
          loginPageRoute = data.findUser.CARYETKILI;
        }

        // console.log("########## DATA: ", data);

        if (!data || data.error || data == null) {
          throw new Error(
            data.error || "Bir hata oluştu. Lütfen tekrar deneyiniz."
          );
        }
        console.log("##### LOGIN DATA: ", data);
        // Kullanıcı bilgilerini döndürüyoruz.

        if (data?.isNewPassword) {
          throw new Error(data.message);
        } else {
          const user = {
            id: data.findUser.CARKOD,
            email: data.findUser.CARUNVAN3,
            name: data.findUser.CARUNVAN,
            role: loginPageRoute,
            isActive: data.findUser.CAROZKOD1,
            isPartner: data.findUser.CAROZKOD3,
          };

          return user;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },

  // kullanıcı giriş yaptıktan sonra giriş yapan kullanıcının bilgilerini token değişkenine atıyoruz.
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 days * 24 hours * 60 minutes * 60 seconds
  },

  callbacks: {
    // jwt fonksiyonu ile kullanıcı giriş yaptıktan sonra giriş yapan kullanıcının bilgilerini token değişkenine atıyoruz.
    // bu bilgileri session fonksiyonunda kullanacağız.
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    // session fonksiyonu ile kullanıcı giriş yaptıktan sonra giriş yapan kullanıcının bilgilerini session değişkenine atıyoruz.
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },

  pages: {
    // signIn fonksiyonu çalıştığında kulanıcıyı yönlendireceğimiz sayfayı belirtiyoruz.
    signIn: `/auth/login/`,
    encryption: true,
  },
};

export default NextAuth(authOptions);
