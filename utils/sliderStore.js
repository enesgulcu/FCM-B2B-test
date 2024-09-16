import { create } from "zustand";

const sliderStore = create((set) => ({
  images: [
    {
      id: 1,
      src: "/assets/images/slider1.png",
      alt: "Slider Image 1",
      title: "Slider Image 1",
    },
    {
      id: 2,
      src: "/assets/images/slider2.png",
      alt: "Slider Image 2",
      title: "Slider Image 2",
    },
    {
      id: 3,
      src: "/assets/images/slider3.png",
      alt: "Slider Image 3",
      title: "Slider Image 3",
    },
    {
      id: 4,
      src: "/assets/images/slider4.png",
      alt: "Slider Image 4",
      title: "Slider Image 4",
    },
    {
      id: 5,
      src: "/assets/images/slider5.png",
      alt: "Slider Image 5",
      title: "Slider Image 5",
    },
    {
      id: 6,
      src: "/assets/images/slider6.png",
      alt: "Slider Image 6",
      title: "Slider Image 6",
    },
    {
      id: 7,
      src: "/assets/images/slider7.png",
      alt: "Slider Image 7",
      title: "Slider Image 7",
    },
    {
      id: 8,
      src: "/assets/images/slider8.png",
      alt: "Slider Image 8",
      title: "Slider Image 8",
    },
  ],
}));

export default sliderStore;
