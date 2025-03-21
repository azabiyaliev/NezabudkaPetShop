import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { brandsFromSlice } from '../../features/brands/brandsSlice.ts';
import { useEffect, useState } from 'react';
import { getBrands } from '../../features/brands/brandsThunk.ts';
import BrandForHomePage from '../../components/Brand/BrandForHomePage/BrandForHomePage.tsx';
import { Box } from '@mui/material';
import Typography from '@mui/joy/Typography';
import Carousel from '../../components/UI/Carousel/Carousel.tsx';
import { productsFromSlice } from '../../features/products/productsSlice.ts';
import { getProduct } from '../../features/products/productsThunk.ts';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';
import { ProductRequest } from '../../types';
import { apiUrl } from '../../globalConstants.ts';
import { addCart, editCart, getCart } from '../../features/cart/cartThunk.ts';
import CustomCart from '../../components/CustomCart/CustomCart.tsx';
import { cartsFromSlice } from '../../features/cart/cartSlice.ts';

const HomePage = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const brands = useAppSelector(brandsFromSlice);
  const products = useAppSelector(productsFromSlice);
  const cart = useAppSelector(cartsFromSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBrands()).unwrap();
    dispatch(getProduct()).unwrap();
    dispatch(getCart()).unwrap();
  }, [dispatch]);

  const addProductToCart = async (product: ProductRequest) => {

    const indexProduct = cart.findIndex((order) => order.productId === product.id);

    if (indexProduct === -1) {

      await dispatch(addCart({ productId: product.id, quantity: 1 })).unwrap();
    } else {

      const updatedProduct = { ...cart[indexProduct], quantity: cart[indexProduct].quantity + 1 };
      const cartId = cart[indexProduct].id;
      console.log(cartId);

      await dispatch(editCart({id: cartId, productId: updatedProduct.productId, quantity: updatedProduct.quantity })).unwrap();
    }
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
      {products.length > 0 && (
        <Box>
          <Typography sx={{fontSize: '40px', mb: 0.5, color: 'rgba(250, 143, 1, 1)', textAlign: 'center'}}>
            Наши товары
          </Typography>
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'}}>
            {products.map((product: ProductRequest) => (
              <Card sx={{ width: 320 }} key={product.id}>
                <div>
                  <Typography level="title-lg">{product.productName}</Typography>
                  <Typography level="body-sm">April 24 to May 02, 2021</Typography>
                  <IconButton
                    aria-label="bookmark Bahamas Islands"
                    variant="plain"
                    color="neutral"
                    size="sm"
                    sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
                  >
                    <BookmarkAdd />
                  </IconButton>
                </div>
                <AspectRatio minHeight="120px" maxHeight="200px">
                  <img
                    src={apiUrl + product.productPhoto}
                    srcSet={apiUrl + product.productPhoto}
                    loading="lazy"
                    alt=""
                  />
                </AspectRatio>
                <CardContent orientation="horizontal">
                  <div>
                    <Typography level="body-xs">Total price:</Typography>
                    <Typography sx={{ fontSize: 'lg', fontWeight: 'lg' }}>{product.productPrice} сом</Typography>
                  </div>
                  <Button
                    variant="solid"
                    size="md"
                    color="primary"
                    aria-label="Explore Bahamas Islands"
                    sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
                    onClick={() => addProductToCart(product)}
                  >
                    Explore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}
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