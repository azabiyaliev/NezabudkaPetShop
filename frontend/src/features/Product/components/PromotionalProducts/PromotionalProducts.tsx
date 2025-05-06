import { ICartBack, ProductResponse } from '../../../../types';
import React from 'react';
import { Box } from '@mui/joy';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import ProductCard from '../../../../components/Domain/ProductCard/ProductCard.tsx';

interface Props {
  products: ProductResponse[];
  cart: ICartBack;
}

const PromotionalProducts: React.FC<Props> = ({ products, cart }) => {
  return (
    <Box
      sx={{
        width: '100%',
        margin: '0 auto',
        padding: '20px 20px',
        position: 'relative',
        overflow: 'visible',
        '& .swiper': {
          paddingBottom: '10px',
        },
        '& .swiper-pagination': {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: 'center',
        },
        '& .swiper-pagination-bullet': {
          backgroundColor: '#888',
          width: '10px',
          height: '10px',
          margin: '0 5px',
          opacity: 1,
        },
        '& .swiper-pagination-bullet-active': {
          backgroundColor: '#237803',
        },
        '& .swiper-button-next, & .swiper-button-prev': {
          color: '#237803',
          width: '32px',
          height: '32px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
        },
        '& .swiper-button-prev': {
          left: '-8px',
          '@media (min-width: 768px)': {
            left: '-4px',
          },
          '@media (min-width: 1280px)': {
            left: '-4px',
          },
        },
        '& .swiper-button-next': {
          right: '-8px',
          '@media (min-width: 768px)': {
            right: '-4px',
          },
          '@media (min-width: 1280px)': {
            right: '-4px',
          },
        },
      }}
    >

    <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={4}
        slidesPerView={5}
        breakpoints={{
          0: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        loop={true}
        grabCursor={true}
        centeredSlides={false}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}

        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation
      >
        {products.map((product) => (
          <SwiperSlide
            key={product.id}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              height: '100%',
              width: 250,
            }}
          >
            <Box
              sx={{
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                '& a:not(:has(img))': {
                  height: '80px',
                },
                '& a img': {
                  height: '150px',
                  objectFit: 'contain',
                  margin: '0 auto',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  position: 'static',
                  zIndex: -1,
                },
              }}
            >
              <ProductCard product={product} cart={cart} key={product.id} />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default PromotionalProducts;


