import React from 'react';
import { IBrandForm, ProductResponse } from '../../../../types';
import { Box, Typography } from '@mui/joy';
import { apiUrl } from '../../../../globalConstants';
import ReactHtmlParser from 'html-react-parser';
import noImage from '../../../../assets/no-image.jpg';
import ProductCard from '../../ProductCard/ProductCard.tsx';

interface Props {
  brand: IBrandForm;
  products: ProductResponse[];
}

const OneBrand:React.FC<Props> = ({ brand, products }) => {
  return (
    <>
      <Box sx={{ position: 'relative', overflow: 'hidden', marginTop: '60px' }}>
        <Box sx={{
          "& img": {
            width: '25%',
            height: 'auto',
            objectFit: 'contain',
            float: 'left',
            marginRight: '30px',
            marginBottom: '20px',
            "@media (max-width: 830px)": {
              float: 'none',
              width: '200px',
              marginRight: '0',
            },
          },
          "@media (max-width: 830px)": {
            textAlign: "center",
          },
        }}>
          <img
            src={brand.logo ? apiUrl + brand.logo : noImage}
            alt={brand.title}
          />
        </Box>
        <Typography
          level="h1"
          sx={{
            fontFamily: 'Nunito, sans-serif',
            color: '#237803',
            fontSize: '50px',
            textAlign: 'center',
            margin: '30px 0',
            "@media (max-width: 650px)": {
              fontSize: '40px',
            },
          }}
        >
          {brand.title}
        </Typography>
        {brand.description && (
          <Box
            sx={{
              fontFamily: "Nunito, sans-serif",
              textAlign: "justify",
            }}
          >
            { ReactHtmlParser(brand.description) }
          </Box>
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
              margin: '30px 0',
              "@media (max-width: 830px)": {
                textAlign: "center",
              },
              "@media (max-width: 650px)": {
                fontSize: '25px',
              },
            }}
          >
            Товары по данному бренду
          </Typography>
          <Box sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: '20px',
          }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product}/>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default OneBrand;