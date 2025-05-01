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
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 0',
        position: 'relative',
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
          width: '40px',
          height: '40px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
        },
        '& .swiper-button-prev': {
          left: '-7px',
        },
        '& .swiper-button-next': {
          right: '-7px',
        },
      }}
    >
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={6}
        slidesPerView={3}
        breakpoints={{
          0: { slidesPerView: 1 },
          800: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
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


