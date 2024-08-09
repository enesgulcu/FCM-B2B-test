import { create } from 'zustand';

const sliderStore = create((set) => ({
  images: [
    {
      id: 1,
      src: '/assets/images/sliderImage1.png',
      alt: 'Slider Image 1',
      title: 'Slider Image 1',
    },
    {
      id: 2,
      src: '/assets/images/sliderImage2.png',
      alt: 'Slider Image 2',
      title: 'Slider Image 2',
    },
    {
      id: 3,
      src: '/assets/images/sliderImage3.png',
      alt: 'Slider Image 3',
      title: 'Slider Image 3',
    },
  ],
}));

export default sliderStore;
