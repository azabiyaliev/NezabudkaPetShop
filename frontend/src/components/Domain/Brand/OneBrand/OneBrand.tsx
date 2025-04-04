import React from 'react';
import { IBrandForm, ProductResponse } from '../../../../types';
import { Box, Typography } from '@mui/joy';
import { apiUrl } from '../../../../globalConstants';
import ReactHtmlParser from 'html-react-parser';
import OneProductCard from '../../../../features/Product/components/OneProductCard.tsx';

interface Props {
  brand: IBrandForm;
  products: ProductResponse[];
}

const OneBrand:React.FC<Props> = ({ brand, products }) => {
  return (
    <>
      <Box sx={{ position: 'relative', overflow: 'hidden', marginTop: '60px' }}>
        {brand.logo && (
          <img
            src={apiUrl + brand.logo}
            alt={brand.title}
            style={{
              width: "25%",
              height: "auto",
              objectFit: 'contain',
              float: 'left',
              marginRight: '30px',
              marginBottom: '20px',
            }}
          />
        )}
        <Typography
          level="h1"
          sx={{
            fontFamily: "Nunito, sans-serif",
            color: "#237803",
            fontSize: '50px',
            textAlign: "center",
            margin: '30px 0'
          }}
        >
          {brand.title}
        </Typography>
        {brand.description && (
          <Typography
            sx={{
              fontFamily: "Nunito, sans-serif",
            }}
          >
            { ReactHtmlParser(brand.description)}
          </Typography>
        )}
      </Box>
      {products.length > 0 && (
        <Box sx={{
          margin: "30px 0"
        }}>
          <Typography
            level="h2"
            sx={{
              fontFamily: "Nunito, sans-serif",
              color: "#FFC107",
              fontSize: '30px',
              margin: '30px 0'
            }}
          >
            Товары по данной категории
          </Typography>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            {products.map((product) => (
              <OneProductCard key={product.id} product={product}/>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default OneBrand;