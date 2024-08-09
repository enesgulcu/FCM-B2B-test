import { create } from 'zustand';
import { FcHome } from "react-icons/fc";
import { FcBusiness } from "react-icons/fc";

const orderInformationStore = create((set) => ({
    address: [
        {
            id: 1,
            name: "Ev Adresi",
            info: "1234 Elm Sokağı Springfield, IL Nowakoscka, 31-215 Cracow-Poland",
            icon: <FcHome/>
        },
        {
            id: 2,
            name: "İş Adresi",
            info: "5678 Oak Caddesi Springfield, IL Nowakoscka, 32-567 Cracow-Poland",
            icon: <FcBusiness/>
        },
        {
            id: 3,
            name: "Ev Adresi 2",
            info: "5345 Oak Caddesi Springfield, IL Nowakoscka,56-893 Cracow-Poland",
            icon: <FcHome/>
        },
    ],
    selectedAddress: 1,  // Default to the first address
    setSelectedAddress: (selectedAddress) => set(() => ({ selectedAddress })),
}));

export default orderInformationStore;
