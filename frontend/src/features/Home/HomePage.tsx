import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { brandsFromSlice } from '../../store/brands/brandsSlice.ts';
import { useEffect, useState } from 'react';
import { getBrands } from '../../store/brands/brandsThunk.ts';
import BrandForHomePage from '../../components/Domain/Brand/BrandForHomePage/BrandForHomePage.tsx';
import { Box, Container } from '@mui/material';
import Typography from '@mui/joy/Typography';
import Carousel from '../../components/UI/Carousel/Carousel.tsx';
import CustomCart from '../../components/Domain/CustomCart/CustomCart.tsx';
import CategoryMenuBox from '../Category/CategoryMenuBox/CategoryMenuBox.tsx';
import CategoryCard from '../Category/CategoryCard/CategoryCard.tsx';
import { cartCreateErrorFromSlice, cartErrorFromSlice, cartFromSlice, clearCart } from '../../store/cart/cartSlice.ts';
import { selectUser } from '../../store/users/usersSlice.ts';
import { createCart, fetchCart } from '../../store/cart/cartThunk.ts';
import { nanoid } from '@reduxjs/toolkit';

const HomePage = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const brands = useAppSelector(brandsFromSlice);
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const errorCart = useAppSelector(cartErrorFromSlice);
  const errorCreateCart = useAppSelector(cartCreateErrorFromSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBrands()).unwrap();
    let anonymousCartId: string | null = null;

    if (!user) {
      dispatch(clearCart());
      anonymousCartId = localStorage.getItem("anonymousCartId");
      if (anonymousCartId) {
        dispatch(fetchCart({anonymousCartId})).unwrap();
      } else {
        anonymousCartId = nanoid();
        localStorage.setItem("anonymousCartId", anonymousCartId);
      }
    }

    if (user) {
      dispatch(fetchCart({token: user.token})).unwrap();
    }

    if (!cart) {
      if (user) {
        dispatch(createCart({token: user.token})).unwrap();
      } else {
        if (anonymousCartId) {
          dispatch(createCart({anonymousCartId})).unwrap();
        }
      }
    }
  }, [dispatch, user, cart]);

  const closeCart = () => {
    setOpenCart(false);
  };

  console.log(cart);
  console.log(errorCreateCart?.message);
  console.log(errorCart?.message);

  return (
    <Container>
      <CustomCart openCart={openCart} closeCart={closeCart}/>

      <Box
        className="mb-5"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "stretch" },
          gap: 2,
          "@media (max-width: 990px)": { display: "flex",
            justifyContent: "row", },
        }}
      >
        <CategoryMenuBox />
        <Carousel />
      </Box>

      <Box className="mb-5">
        <Typography
          sx={{
            fontSize: "30px",
            mb: 3,
            color: "rgb(88,138,84)",
            textAlign: "center",
          }}
        >
          Купите для своего питомца
        </Typography>
        <CategoryCard/>
      </Box>

      {brands.length > 0 && (
        <Box sx={{ marginTop: "40px" }}>
          <Typography
            sx={{
              fontSize: "40px",
              mb: 0.5,
              color: "rgba(250, 143, 1, 1)",
              textAlign: "center",
            }}
          >
            Наши бренды
          </Typography>
          <BrandForHomePage brands={brands} />
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
