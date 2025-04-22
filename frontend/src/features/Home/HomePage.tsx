import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { brandsFromSlice } from '../../store/brands/brandsSlice.ts';
import { useEffect, useState } from 'react';
import { getBrands } from '../../store/brands/brandsThunk.ts';
import BrandForHomePage from '../../components/Domain/Brand/BrandForHomePage/BrandForHomePage.tsx';
import { Box, Container } from '@mui/material';
import Typography from '@mui/joy/Typography';
import SwiperCarousel from '../../components/UI/Carousel/SwiperCarousel.tsx';
import CustomCart from '../../components/Domain/CustomCart/CustomCart.tsx';
import CategoryMenuBox from '../Category/CategoryMenuBox/CategoryMenuBox.tsx';
import CategoryCard from '../Category/CategoryCard/CategoryCard.tsx';
import { cartErrorFromSlice, cartFromSlice, setToLocalStorage } from '../../store/cart/cartSlice.ts';
import { selectUser } from '../../store/users/usersSlice.ts';
import { addItem, createCart, deleteItemsCart, fetchCart } from '../../store/cart/cartThunk.ts';
import { ICartBack, ICartItem } from '../../types';
import { userRoleClient } from '../../globalConstants.ts';

const HomePage = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [synced, setSynced] = useState<boolean>(false);
  const [products, setProducts] = useState<ICartItem[]>([]);
  const brands = useAppSelector(brandsFromSlice);
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
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
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <SwiperCarousel />
        </Box>
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
