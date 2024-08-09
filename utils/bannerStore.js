import { create } from 'zustand'

const useBannerStore = create((set) => ({
  content: "750 TL ve üzeri alışverişlerinizde kargo ücretsiz!",
  buttonText: "", // Buton metni 
  buttonLink: "", // Buton linki
  isBannerVisible: true, // Başlangıçta banner'ı göster
  hideBanner: () => set({ isBannerVisible: false }), // Banner gizleme işlevi
}));

export default useBannerStore;
