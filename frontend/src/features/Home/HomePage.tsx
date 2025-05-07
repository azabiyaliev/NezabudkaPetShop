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
import { selectPromotionalProducts, selectTopSellingProducts } from '../../store/products/productsSlice.ts';
import { getPromotionalProducts, getTopSellingProducts } from '../../store/products/productsThunk.ts';
import PromotionalProducts from '../Product/components/PromotionalProducts/PromotionalProducts.tsx';
import theme from '../../globalStyles/globalTheme.ts';
import { getFavoriteProducts } from '../../store/favoriteProducts/favoriteProductsThunks.ts';
import TopSellingProducts from '../Product/components/TopSellingProducts/TopSellingProducts.tsx';
import { FONTS, SPACING } from '../../globalStyles/stylesObjects.ts';
import ContactBlock from '../../components/Domain/ContactBlock/ContactBlock.tsx';

const HomePage = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [synced, setSynced] = useState<boolean>(false);
  const [products, setProducts] = useState<ICartItem[]>([]);
  const brands = useAppSelector(brandsFromSlice);
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const promotionalProducts = useAppSelector(selectPromotionalProducts);
  const topSellingProducts = useAppSelector(selectTopSellingProducts);
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
      await dispatch(getTopSellingProducts()).unwrap();

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

  useEffect(() => {
    if (user && user.role === userRoleClient) {
      dispatch(getFavoriteProducts());
    }
  }, [dispatch, user]);

  const bestsellerProducts = topSellingProducts.filter(product => product.isBestseller);
  const sortedProducts = [...bestsellerProducts].sort((a, b) => {
    if (a.existence === b.existence) return 0;
    return a.existence ? -1 : 1;
  });

  console.log(topSellingProducts);

  return (
    <Box>
      <Container maxWidth="xl">
        <Box
          sx={{
            marginTop: theme.spacing.main_spacing,
          }}
        >
          <Typography
            sx={{
              fontSize: theme.fonts.size.xxxl,
              fontWeight: FONTS.weight.bold,
              margin: `${SPACING.xxl} 0`,
              color: theme.colors.text,
              textAlign: "center",
            }}
          >
            Каталог
          </Typography>
          <CategoryCard />
        </Box>
      </Container>
      <CustomCart openCart={openCart} closeCart={closeCart} />
      {promotionalProducts.length > 0 && (
        <Box
          sx={{
            marginTop: theme.spacing.huge,
            width: "100%",
            backgroundColor: theme.colors.rgbaGrey,
            paddingTop: theme.spacing.main_spacing,
            paddingBottom: theme.spacing.xxxl,
          }}
        >
          <Container maxWidth="xl">
            <Typography
              sx={{
                fontSize: theme.fonts.size.xxxl,
                fontWeight: FONTS.weight.bold,
                color: theme.colors.text,
                textAlign: "center",
              }}
            >
              Акции
            </Typography>
            {cart && (
              <PromotionalProducts products={promotionalProducts} cart={cart} />
            )}
          </Container>
        </Box>
      )}
      <Container maxWidth="xl">
        {bestsellerProducts.length > 0 && (
          <Box
            sx={{
              marginTop: theme.spacing.main_spacing,
            }}
          >
            <Typography
              sx={{
                fontSize: theme.fonts.size.xxxl,
                fontWeight: FONTS.weight.bold,
                color: theme.colors.text,
                textAlign: "center",
                marginBottom: theme.spacing.md,
              }}
            >
              Хиты продаж
            </Typography>
            {cart && (
              <TopSellingProducts products={sortedProducts} cart={cart} />
            )}
          </Box>
        )}

      </Container>
      {brands.length > 0 && (
        <Box
          sx={{
            marginTop: theme.spacing.sixty,
            width: "100%",
            backgroundColor: theme.colors.rgbaGrey,
            paddingTop: theme.spacing.main_spacing,
            paddingBottom: theme.spacing.huge,
          }}
        >
          <Container maxWidth="xl">
            <Typography
              sx={{
                fontSize: theme.fonts.size.xxxl,
                fontWeight: FONTS.weight.bold,
                marginBottom: theme.spacing.xl,
                color: theme.colors.text,
                textAlign: "center",
              }}
            >
              Наши бренды
            </Typography>
            <BrandForHomePage brands={brands} />
          </Container>
        </Box>
      )}
      <Container maxWidth="xl">
        <Box
          sx={{
            marginTop: theme.spacing.main_spacing,
          }}
        >
          <Typography
            sx={{
              fontSize: theme.fonts.size.xxxl,
              fontWeight: FONTS.weight.bold,
              marginTop:` ${SPACING.main_spacing} 0`,
              paddingBottom: theme.spacing.sm,
              color: theme.colors.text,
              textAlign: "center",
            }}
          >
            Контакты
          </Typography>
          <ContactBlock />
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
