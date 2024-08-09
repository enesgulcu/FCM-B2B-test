"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectCreative,Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import sliderStore from '@/utils/sliderStore';

const SliderComponent = () => {
  const images = sliderStore((state) => state.images);


  return (
    <div className="w-screen xl:w-[1188px]  bg-white lg:h-[475px]">
       <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        effect={'creative'}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: [0, 0, -400],
          },
          next: {
            translate: ['100%', 0, 0],
          },
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectCreative]}
   
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.id}>
              <Image src={image.src} alt={image.alt} width={1188} height={800} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SliderComponent;
