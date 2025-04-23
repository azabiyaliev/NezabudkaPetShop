import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { historyProduct, ProductResponse } from '../../../types';
import { useNavigate, useParams } from 'react-router-dom';
import { selectProduct } from '../../../store/products/productsSlice.ts';
import { useEffect, useState } from 'react';
import { getOneProduct } from '../../../store/products/productsThunk.ts';
import { addProductToHistory } from '../../../store/historyProduct/historyProductSlice.ts';
import { Box, Card, CardMedia } from '@mui/material';
import { apiUrl } from '../../../globalConstants.ts';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { addFavoriteProduct, removeFavoriteProduct } from '../../../store/favoriteProducts/favoriteProductLocal.ts';
import { enqueueSnackbar } from 'notistack';
import {
  addFavoriteProducts,
  removeFavoriteProductThunk
} from '../../../store/favoriteProducts/favoriteProductsThunks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Typography from '@mui/joy/Typography';
import { addItem, fetchCart } from '../../../store/cart/cartThunk.ts';
import { cartFromSlice, newUserLogin, productCardToAdd, setToLocalStorage } from '../../../store/cart/cartSlice.ts';

const HistoryProduct = () => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const viewedProducts = useAppSelector((state) => state.history.history);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const product = useAppSelector(selectProduct);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getOneProduct(Number(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.id !== undefined) {
      dispatch(addProductToHistory({
        productId: product.id,
        product,
      }));
    }
  }, [dispatch, product]);

  console.log(viewedProducts);

  const toggleFavorite = (id: number) => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);

    if (!user) {
      if (newValue) {
        addFavoriteProduct(id);
        enqueueSnackbar("Добавлено в избранное", { variant: "success" });
      } else {
        removeFavoriteProduct(id);
        enqueueSnackbar("Удалено из избранного", { variant: "info" });
      }
    } else {
      if (newValue) {
        dispatch(addFavoriteProducts(id));
        enqueueSnackbar("Добавлено в избранное", { variant: "success" });
      } else {
        dispatch(removeFavoriteProductThunk(id));
        enqueueSnackbar("Удалено из избранного", { variant: "info" });
      }
    }
  };

  const addItemToCart = async (productItem: ProductResponse) => {
    if (user && cart) {
      await dispatch(
        addItem({
          cartId: cart.id,
          productId: productItem.id,
          quantity: 1,
        }),
      ).unwrap();
      await dispatch(fetchCart()).unwrap();
    } else {
      if (!cart) {
        dispatch(newUserLogin());
        dispatch(productCardToAdd(productItem));
      } else {
        dispatch(productCardToAdd(productItem));
      }
    }

    const isFirstTimeAdded = cart?.products.some((item) => item.product.id === product.id);

    if (!isFirstTimeAdded) {
      enqueueSnackbar("Данный товар успешно добавлен в корзину!", { variant: "success" });
    }
  };

  useEffect(() => {
    dispatch(setToLocalStorage(cart));
  }, [dispatch, cart]);

  return (
    <div>
      <Box sx={{ p: 2 }}>
        <Typography  gutterBottom sx={{mb:5}}>
          История просмотров
        </Typography>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'flex-start',
        }}>
          {viewedProducts
            .filter((item): item is historyProduct => !!item.product && !!item.product.productName)
            .map((item) => (
              <Card
                key={item.productId}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '10px',
                  width: 233,
                  borderRadius: 3,
                  boxShadow: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                  },
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <FavoriteBorderOutlinedIcon
                    onClick={() => toggleFavorite(item.productId)}
                    sx={{ color: '#f60', cursor: 'pointer' }}
                  />
                </Box>

                <CardMedia
                  onClick={() => navigate(`/product/${item.productId}`)}
                  component="img"
                  image={apiUrl + '/' + item.product.productPhoto}
                  alt={item.product.productName}
                  sx={{
                    width: "100%",
                    height: 150,
                    objectFit: 'contain',
                    mb: 1,
                    cursor: 'pointer',
                  }}
                />

                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, borderTop: '1px solid lightgrey', mt: 1.5 }}>
                  <Box
                    onClick={() => navigate(`/product/${item.productId}`)}
                    sx={{ cursor: 'pointer', margin: '10px' }}
                  >
                    <Typography level="h4" sx={{ fontSize: 'lg'}}>
                      {item.product.brand.title}
                    </Typography>
                    <Typography level="body-md" sx={{marginTop: '10px'}}>
                      {item.product.productName}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 'auto',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pt: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        visibility: item.product.productWeight ? 'visible' : 'hidden',
                        minWidth: '40px',
                        marginLeft: '10px'
                      }}
                    >
                      {item.product.productWeight} кг
                    </Typography>

                    <Typography fontWeight={600}>
                      {item.product.productPrice} сом
                    </Typography>

                    <ShoppingCartOutlinedIcon
                      sx={{ color: '#333', cursor: 'pointer', marginRight: '10px' }}
                      onClick={() => addItemToCart(item.product)}
                    />
                  </Box>
                </Box>
              </Card>
            ))}
        </Box>
      </Box>
    </div>
  );
};

export default HistoryProduct;