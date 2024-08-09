import { create } from 'zustand'

const footerStore = create((set) => ({
    footerLogo: [
        {
          logosrc: "https://caliskanari.com/wp-content/uploads/2022/11/x-04.png",
        },
      ],
}));

export default footerStore;
