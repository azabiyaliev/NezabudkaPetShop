import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Box } from '@mui/material';
import { IBrand } from '../../../../types';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import React from 'react';
import { apiUrl } from '../../../../globalConstants.ts';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../../../globalStyles/stylesObjects.ts';

interface Props {
  brands: IBrand[];
}

const BrandForHomePage:React.FC<Props> = ({brands}) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "100%",
        margin: "0 auto",
        padding: "20px 0",
        "& .swiper-pagination-bullet": {
          backgroundColor: '#888',
          width: '10px',
          height: '10px',
        },
        "& .swiper-pagination-bullet-active": {
          backgroundColor: '#237803',
        },
        "& .swiper-pagination": {
          marginTop: '20px',
          textAlign: 'center',
        },
        "& .swiper-button-next, & .swiper-button-prev": {
          display: 'none',
        },
      }}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={6}
        breakpoints={{
          0: { slidesPerView: 1 },
          450: { slidesPerView: 2 },
          550: { slidesPerView: 3 },
          650: { slidesPerView: 4 },
          850: { slidesPerView: 5 },
          900: { slidesPerView: 6 },
          1200: { slidesPerView: 8 },
          1450: { slidesPerView: 9 },
        }}
        navigation
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{ delay: 3000 }}
        style={{ paddingBottom: "40px" }}
      >
        {brands.map((brand, index) => (
          <SwiperSlide
            onClick={() => navigate(`/brand/${brand.id}`)}
            key={index}
            style={{
              textAlign: 'center',
              cursor: 'pointer',
              display: brand.logo ? 'block' : 'none',
            }}
          >
            {brand.logo && (
              <img
                src={`${apiUrl + brand.logo}`}
                alt={brand.title}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'contain',
                  backgroundColor: COLORS.white,
                }}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default BrandForHomePage;