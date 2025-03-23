import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { brandsFromSlice } from '../../features/brands/brandsSlice.ts';
import { useEffect, useState } from 'react';
import { getBrands } from '../../features/brands/brandsThunk.ts';
import BrandForHomePage from '../../components/Brand/BrandForHomePage/BrandForHomePage.tsx';
import { Box } from '@mui/material';
import Typography from '@mui/joy/Typography';
import Carousel from '../../components/UI/Carousel/Carousel.tsx';
import { ProductRequest } from '../../types';
import { addCart, editCart, getCart } from '../../features/cart/cartThunk.ts';
import CustomCart from '../../components/CustomCart/CustomCart.tsx';
import { cartsFromSlice } from '../../features/cart/cartSlice.ts';
import { enqueueSnackbar } from 'notistack';

const HomePage = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const brands = useAppSelector(brandsFromSlice);
  const cart = useAppSelector(cartsFromSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBrands()).unwrap();
    dispatch(getCart()).unwrap();
  }, [dispatch]);

  const addProductToCart = async (product: ProductRequest) => {

    const indexProduct = cart.findIndex((order) => order.productId === product.id);

    if (indexProduct === -1) {
      await dispatch(addCart({ productId: product.id, quantity: 1 })).unwrap();
      enqueueSnackbar('Данный товар успешно добавлен в корзину!', { variant: 'success' });

    } else {
      const updatedProduct = { ...cart[indexProduct], quantity: cart[indexProduct].quantity + 1 };
      const cartId = cart[indexProduct].id;
      await dispatch(editCart({id: cartId, productId: updatedProduct.productId, quantity: updatedProduct.quantity, product})).unwrap();
    }

    dispatch(getCart()).unwrap();
  };

  const closeCart = () => {
    setOpenCart(false);
  };

  return (
    <>
      <CustomCart openCart={openCart} closeCart={closeCart}/>
      <div className='mb-5'>
        <Carousel/>
      </div>

      {brands.length > 0 && (
        <Box sx={{marginTop: '40px'}}>
          <Typography sx={{fontSize: '40px', mb: 0.5, color: 'rgba(250, 143, 1, 1)', textAlign: 'center'}}>
            Наши бренды
          </Typography>
          <BrandForHomePage brands={brands}/>
        </Box>
      )}
    </>
  );
};

export default HomePage;