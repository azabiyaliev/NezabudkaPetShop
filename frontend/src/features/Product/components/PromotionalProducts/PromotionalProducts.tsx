import { ProductResponse } from '../../../../types';
import React from 'react';
import { Box } from '@mui/joy';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import PromotionalProduct from './PromotionalProduct/PromotionalProduct.tsx';

interface Props {
  products: ProductResponse[];
}

const PromotionalProducts:React.FC<Props> = ({products}) => {
  return (
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px 0",
          position: "relative",
          '& .swiper': {
            paddingBottom: "60px",
          },
          "& .swiper-pagination": {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: 'center',
          },
          "& .swiper-pagination-bullet": {
            backgroundColor: '#888',
            width: '10px',
            height: '10px',
            margin: '0 5px',
            opacity: 1,
          },
          "& .swiper-pagination-bullet-active": {
            backgroundColor: '#237803',
          },
          "& .swiper-button-next, & .swiper-button-prev": {
            color: '#237803',
            top: '40%',
            width: '30px',
            height: '30px',
          },
          "& .swiper-button-prev": {
            left: "-3px",
          },
          "& .swiper-button-next": {
            right: "-3px",
          },
        }}
      >
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={8}
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
            <SwiperSlide key={product.id} style={{ textAlign: 'center'}}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                margin: '0 auto',
                alignItems: 'stretch',
                height: '100%',
              }}>
                <PromotionalProduct product={product} />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
  );
};

export default PromotionalProducts;