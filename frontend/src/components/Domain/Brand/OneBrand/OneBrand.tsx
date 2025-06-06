import React, { useEffect } from 'react';
import { IBrandForm, ICartBack, ProductResponse } from '../../../../types';
import { Box, Typography } from '@mui/joy';
import { apiUrl } from '../../../../globalConstants';
import ReactHtmlParser from 'html-react-parser';
import noImage from '../../../../assets/no-image.webp';
import ProductCard from '../../ProductCard/ProductCard.tsx';

interface Props {
  brand: IBrandForm;
  products: ProductResponse[];
  cart: ICartBack;
}

const OneBrand:React.FC<Props> = ({ brand, products, cart }) => {

  useEffect(() => {

    if(brand) {
      document.title = `Брэнд - ${brand.title}`;
    }

  }, [brand]);

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
              textAlign: "justify",
            }}
          >
            { ReactHtmlParser(brand.description) }
          </Box>
        )}
      </Box>
      {products.length > 0 && (
        <Box sx={{
          margin: "10px 0"
        }}>
          <Typography
            level="h2"
            sx={{
              color: "#FFC107",
              fontSize: '30px',
              margin: '15px 0',
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
            flexWrap: "wrap",
            gap: '2px',
          }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} cart={cart}/>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default OneBrand;