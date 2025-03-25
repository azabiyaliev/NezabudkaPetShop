import { IBrand } from '../../../../types';
import React from 'react';
import { apiUrl } from '../../../../globalConstants.ts';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { Container } from '@mui/material';

interface Props {
  brands: IBrand[];
}

const BrandForHomePage: React.FC<Props> = ({ brands }) => {
  return (
    <Container>
      <Swiper
        spaceBetween={50}
        slidesPerView={8}
      >
        {brands.map((brand) => (
          <SwiperSlide key={brand.id}>
            <div key={brand.id} style={{marginLeft: '20px'}}>
              <img
                src={apiUrl + '/' + brand.logo}
                alt={brand.title}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'contain',
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default BrandForHomePage;
