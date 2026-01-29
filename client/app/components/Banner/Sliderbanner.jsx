'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import Image from 'next/image';
import Link from 'next/link';

const banners = [
  {
    image: '/assets/banner4.png',
    title: 'Newborn Essentials',
    subtitle: 'Soft, safe & stylish – everything your baby needs',
    buttonText: 'Shop Newborn',
    buttonLink: '/',
  },
  {
    image: '/assets/banner1.png',
    title: 'Newborn Essentials',
    subtitle: 'Soft, safe & stylish – everything your baby needs',
    buttonText: 'Shop Newborn',
    buttonLink: '/',
  },
  {
    image: '/assets/banner3.png',
    title: 'Up to 50% Off',
    subtitle: 'Limited time only – don’t miss out!',
    buttonText: 'Shop Sale',
    buttonLink: '/sale',
  },
];

export default function Sliderbanner() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showContentMobile, setShowContentMobile] = useState({});

  // NEW: track touched/active state per slide on mobile
  const [activeMobile, setActiveMobile] = useState({});

  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMounted) {
    return null; // or <div className="w-full aspect-[13/9] bg-gray-100" /> as skeleton
  }

  return (
    <div className="w-full sm:mt-12 mt-12 relative overflow-hidden bg-gradient-to-b from-pink-50 to-white">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        loop={true}
        speed={800}
        onSlideChange={(swiper) => {
          setActiveSlide(swiper.realIndex);
          setShowContentMobile({});
          setActiveMobile({}); // reset active state on slide change
        }}
        className="w-full aspect-[13/9] sm:aspect-[16/9] md:aspect-[16/7] lg:aspect-[16/6] xl:aspect-[16/5] 2xl:aspect-[16/4.5]"
      >
        {banners.map((banner, index) => {
          const isActive = isMobile ? !!activeMobile[index] : false;

          return (
            <SwiperSlide key={index}>
              <div
                className="group relative w-full h-full bg-[#e4f4f5]"
                onClick={() => {
                  if (isMobile) {
                    setActiveMobile((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }));
                    // Optionally toggle content too – or keep separate
                    setShowContentMobile((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }));
                  }
                }}
              >
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  quality={85}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                  className={`
                    object-contain transition-all duration-1000
                    ${isMobile
                      ? isActive
                        ? 'scale-[1.03] brightness-100'
                        : 'scale-100 brightness-[0.92]'
                      : 'group-hover:scale-[1.03] group-hover:brightness-100 brightness-[0.92]'
                    }
                  `}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/OhPPQAJJAPXdxCaAAAAAElFTkSuQmCC"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 xs:px-6 sm:px-10 md:px-12 lg:px-16 text-center text-white pointer-events-none">
                  <div
                    className={`
                      transform transition-all duration-700 ease-out
                      ${
                        isMobile
                          ? showContentMobile[index]
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-16'
                          : 'opacity-0 sm:opacity-0 translate-y-16 sm:group-hover:opacity-100 sm:group-hover:translate-y-0'
                      }
                    `}
                  >
                    <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-2 sm:mb-4 md:mb-6 drop-shadow-2xl tracking-tight leading-tight">
                      {banner.title}
                    </h2>

                    <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl mb-5 sm:mb-8 md:mb-10 drop-shadow-xl max-w-xl lg:max-w-3xl mx-auto font-light">
                      {banner.subtitle}
                    </p>

                    <Link href={banner.buttonLink}>
                      <button className="pointer-events-auto bg-[#2b9aac] text-white px-6 xs:px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-full text-sm xs:text-base sm:text-lg md:text-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300">
                        {banner.buttonText}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <button className="custom-prev absolute left-2 xs:left-4 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 z-30 w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all duration-300 opacity-80 sm:opacity-90 hover:opacity-100 shadow-lg">
        <svg className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button className="custom-next absolute right-2 xs:right-4 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all duration-300 opacity-80 sm:opacity-90 hover:opacity-100 shadow-lg">
        <svg className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination Style */}
      <style jsx global>{`
        .swiper-pagination {
          /* bottom: 14px !important; */
        }
        .swiper-pagination-bullet {
          background: rgba(255,255,255,0.9);
          opacity: 0.7;
          width: 8px;
          height: 8px;
          margin: 0 4px !important;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #ec4899;
          opacity: 1;
          width: 28px;
          border-radius: 9999px;
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.6);
        }

        @media (max-width: 640px) {
          .swiper-button-next,
          .swiper-button-prev {
            width: 44px;
            height: 44px;
          }
          .swiper-pagination {
            bottom: 10px !important;
          }
        }

        @media (max-width: 400px) {
          .swiper-button-next,
          .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}