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
import { cartErrorFromSlice, cartFromSlice, setToLocalStorage } from '../../store/cart/cartSlice.ts';
import { selectUser } from '../../store/users/usersSlice.ts';
import { addItem, createCart, deleteItemsCart, fetchCart } from '../../store/cart/cartThunk.ts';
import { ICartBack, ICartItem } from '../../types';
import { userRoleAdmin, userRoleClient, userRoleSuperAdmin } from '../../globalConstants.ts';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [synced, setSynced] = useState<boolean>(false);
  const [products, setProducts] = useState<ICartItem[]>([]);
  const brands = useAppSelector(brandsFromSlice);
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const createCartError = useAppSelector(cartErrorFromSlice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const mergeCarts = (cart: ICartBack, localCart: ICartBack): ICartItem[] => {
    const mergedCart: ICartItem[] = [...cart.products];

    if (localCart !== null) {
      localCart.products.forEach((localProduct) => {
        const existingItemIndex = mergedCart.findIndex(
          (item) => item.productId === localProduct.productId
        );

        if (existingItemIndex === -1) {
          mergedCart.push(localProduct);
        }
      });
      return mergedCart;
    } else {
      return cart.products;
    }
  };

  useEffect(() => {
    if (user && (user.role === userRoleClient) && cart) {
      const cartFromLS = localStorage.getItem("cart");

      if (cartFromLS !== null) {
        const localCart = JSON.parse(cartFromLS);
        setProducts([]);
        const allUserProducts = mergeCarts(cart, localCart);
        setProducts(allUserProducts);
        localStorage.removeItem("cart");
      }
    }
  }, [user, cart, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getBrands()).unwrap();

      if (user && (user.role === userRoleClient)) {
        await dispatch(createCart({token: user.token})).unwrap();

        if (!createCartError) {
          await dispatch(fetchCart({ token: user.token })).unwrap();
        }

        const userCart = await dispatch(fetchCart({ token: user.token })).unwrap();

        if (products.length > 0 && userCart && !synced) {
          setSynced(true);

          if (userCart.products.length > 0) {
            await dispatch(deleteItemsCart({cartId: userCart.id, token: user.token})).unwrap();
          }

          for (const product of products) {
            await dispatch(
              addItem({
                cartId: userCart.id,
                productId: product.productId,
                quantity: product.quantity,
                token: user.token,
              })
            ).unwrap();
          }
          await dispatch(fetchCart({ token: user.token })).unwrap();
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
    } else {
      if (user && (user.role === userRoleAdmin || user.role === userRoleSuperAdmin)) {
        navigate("/private_account");
      }
    }
  }, [dispatch, cart, user, navigate]);

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
