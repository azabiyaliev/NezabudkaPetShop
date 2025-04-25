import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { brandsFromSlice } from '../../store/brands/brandsSlice.ts';
import { useEffect, useState } from 'react';
import { getBrands } from '../../store/brands/brandsThunk.ts';
import BrandForHomePage from '../../components/Domain/Brand/BrandForHomePage/BrandForHomePage.tsx';
import { Box, Container } from '@mui/material';
import Typography from '@mui/joy/Typography';
import CustomCart from '../../components/Domain/CustomCart/CustomCart.tsx';
import CategoryCard from '../Category/CategoryCard/CategoryCard.tsx';
import { cartErrorFromSlice, cartFromSlice, setToLocalStorage } from '../../store/cart/cartSlice.ts';
import { selectUser } from '../../store/users/usersSlice.ts';
import { addItem, createCart, deleteItemsCart, fetchCart } from '../../store/cart/cartThunk.ts';
import { ICartBack, ICartItem } from '../../types';
import { userRoleClient } from '../../globalConstants.ts';
import { selectPromotionalProducts } from '../../store/products/productsSlice.ts';
import { getPromotionalProducts } from '../../store/products/productsThunk.ts';
import PromotionalProducts from '../Product/components/PromotionalProducts/PromotionalProducts.tsx';
import theme from '../../globalStyles/globalTheme.ts';

const HomePage = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [synced, setSynced] = useState<boolean>(false);
  const [products, setProducts] = useState<ICartItem[]>([]);
  const brands = useAppSelector(brandsFromSlice);
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const promotionalProducts = useAppSelector(selectPromotionalProducts);
  const createCartError = useAppSelector(cartErrorFromSlice);
  const dispatch = useAppDispatch();

  const mergeCarts = (cart: ICartBack, localCart: ICartBack): ICartItem[] => {
    const mergedCart: ICartItem[] = [...cart.products];

    if (localCart && Array.isArray(localCart.products)) {
      localCart.products.forEach((localProduct) => {
        const existingItemIndex = mergedCart.findIndex(
          (item) => item.productId === localProduct.productId
        );

        if (existingItemIndex === -1) {
          mergedCart.push(localProduct);
        }
      });
    }

    return mergedCart;
  };

  useEffect(() => {
    if (user && (user.role === userRoleClient) && cart) {
      const cartFromLS = localStorage.getItem("cart");

      if (cartFromLS !== null) {
        try {
          const parsed = JSON.parse(cartFromLS);

          if (parsed && Array.isArray(parsed.products)) {
            setProducts([]);
            const allUserProducts = mergeCarts(cart, parsed);
            setProducts(allUserProducts);
            localStorage.removeItem("cart");
          } else {
            console.warn("Некорректный формат localCart, удаляем...");
            localStorage.removeItem("cart");
          }
        } catch (e) {
          console.warn("Ошибка парсинга cart из localStorage:", e);
          localStorage.removeItem("cart");
        }
      }
    }
  }, [user, cart, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getBrands()).unwrap();
      await dispatch(getPromotionalProducts()).unwrap();

      if (user && (user.role === userRoleClient)) {
        await dispatch(createCart()).unwrap();

        if (!createCartError) {
          await dispatch(fetchCart()).unwrap();
        }

        const userCart = await dispatch(fetchCart()).unwrap();

        if (products.length > 0 && userCart && !synced) {
          setSynced(true);

          if (userCart.products.length > 0) {
            await dispatch(deleteItemsCart({cartId: userCart.id})).unwrap();
          }

          for (const product of products) {
            await dispatch(
              addItem({
                cartId: userCart.id,
                productId: product.productId,
                quantity: product.quantity,
              })
            ).unwrap();
          }
          await dispatch(fetchCart()).unwrap();
        }
      }
    };
    void fetchData();
  }, [dispatch, user, createCartError, products, synced]);

  const closeCart = () => {
    setOpenCart(false);
  };

  useEffect(() => {
    if (!user) {
      dispatch(setToLocalStorage(cart));
    }
  }, [dispatch, cart, user]);


  return (
    <>
      <Container maxWidth="xl">
        <CustomCart openCart={openCart} closeCart={closeCart}/>
        <Box sx={{
          mt: theme.spacing.xxl
        }}>
          <Typography
            sx={{
              fontSize: theme.fonts.size.xxl,
              mb: 3,
              fontWeight: theme.fonts.weight.medium,
              color: theme.colors.text,
              textAlign: "center",
            }}
          >
            Каталог
          </Typography>
          <CategoryCard/>
        </Box>

        {promotionalProducts.length > 0 && (
          <Box>
            <Typography
              sx={{
                fontSize: "40px",
                mb: 0.5,
                color: "rgba(250, 143, 1, 1)",
                textAlign: "center",
              }}
            >
              Акции
            </Typography>
            <PromotionalProducts products={promotionalProducts}/>
          </Box>
        )}

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
    </>

  );
};

export default HomePage;
