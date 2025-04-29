import { Box, Typography, CardMedia, Button, Breadcrumbs } from '@mui/material';
import "../css/product.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import  { useEffect, useState } from 'react';
import { getOneProduct } from "../../../store/products/productsThunk.ts";
import { useParams } from 'react-router-dom';
import { selectProduct } from '../../../store/products/productsSlice.ts';
import { apiUrl, userRoleClient } from '../../../globalConstants.ts';
import HistoryProducts from '../../../components/Domain/HistoryProducts/HistoryProducts.tsx';
import '../../../components/TextEditor/styles.css'
import theme from '../../../globalStyles/globalTheme.ts';
import { ICategories, ProductResponse } from '../../../types';
import { addItem, fetchCart } from '../../../store/cart/cartThunk.ts';
import { cartFromSlice, getFromLocalStorage, newUserLogin, productCardToAdd } from '../../../store/cart/cartSlice.ts';
import { enqueueSnackbar } from 'notistack';
import { selectUser } from '../../../store/users/usersSlice.ts';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { addFavoriteProduct, removeFavoriteProduct } from '../../../store/favoriteProducts/favoriteProductLocal.ts';
import {
  addFavoriteProducts,
  removeFavoriteProductThunk
} from '../../../store/favoriteProducts/favoriteProductsThunks.ts';
import { selectDelivery } from '../../../store/deliveryPage/deliveryPageSlice.ts';
import { fetchDeliveryPage } from '../../../store/deliveryPage/deliveryPageThunk.ts';
import { Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";
import { addProductToHistory } from '../../../store/historyProduct/historyProductSlice.ts';

const ProductPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const product = useAppSelector(selectProduct);
  const [quantity, setQuantity] = useState<number>(1);
  const cart = useAppSelector(cartFromSlice);
  const user = useAppSelector(selectUser);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [tab, setTab] = useState<"description" | "delivery">("description");
  const selectDeliveryInfo = useAppSelector(selectDelivery)
  const isAddToCartDisabled = !product?.existence;
  const cartItem = cart?.products.find(item => item.product?.id === product?.id);

  useEffect(() => {
    if (id && product && product.id && product.productName) {
      dispatch(addProductToHistory({
        productId: product.id,
        product,
      }));
    }
  }, [dispatch, id, product]);

  useEffect(() => {
    if (user && user.role === userRoleClient) {
      dispatch(fetchCart());
    } else {
      dispatch(getFromLocalStorage());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (id) {
      const parsedId = Number(id);
      if (!isNaN(parsedId)) {
        dispatch(getOneProduct(parsedId));
      }
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchDeliveryPage());
  }, [dispatch]);

  useEffect(() => {
    if (cartItem && cartItem.quantity !== quantity) {
      setQuantity(cartItem.quantity);
    } else if (!cartItem && quantity !== 1) {
      setQuantity(1);
    }
  }, [cartItem, quantity]);

  if (!product) {
    return <Typography sx={{ padding: 4 }}>Загрузка товара...</Typography>;
  }

  const addProductToCart = async (product: ProductResponse) => {
    if (user && cart) {
      await dispatch(
        addItem({
          cartId: cart.id,
          productId: product.id,
          quantity: quantity,
        })
      ).unwrap();

      await dispatch(fetchCart()).unwrap();
    } else {

      if (!cart) {
        dispatch(newUserLogin());
      }
      dispatch(productCardToAdd(product));
    }

    const isFirstTimeAdded = cart?.products.some((item) => item.product.id === product.id);

    if (!isFirstTimeAdded) {
      enqueueSnackbar("Данный товар успешно добавлен в корзину!", { variant: "success" });
    }
  };

  const toggleFavorite = () => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);

    if (!user) {
      if (newValue) {
        if (product.id !== undefined) {
          addFavoriteProduct(product.id);
        }
        enqueueSnackbar("Добавлено в избранное", { variant: "success" });
      } else {
        if (product.id !== undefined) {
        removeFavoriteProduct(product.id);
        }
        enqueueSnackbar("Удалено из избранного", { variant: "info" });
      }
    } else {
      if (newValue) {
        if (product.id !== undefined) {
          dispatch(addFavoriteProducts(product.id));
        }
        enqueueSnackbar("Добавлено в избранное", { variant: "success" });
      } else {
        if (product.id !== undefined) {
          dispatch(removeFavoriteProductThunk(product.id));
        }
        enqueueSnackbar("Удалено из избранного", { variant: "info" });
      }
    }
  };
  const getBreadcrumbs = (category: ICategories) => {
    const crumbs: { title: string; path: string }[] = [];
    let current: ICategories | null | undefined = category;

    while (current) {
      crumbs.unshift({
        title: current.title,
        path: `/all-products/${current.id}`,
      });
      current = current.parent;
    }

    return crumbs;
  };

  const breadcrumbs = product.category ? getBreadcrumbs(product.category) : [];

  return (
    <div>
      <Box className="product-box">
        <Breadcrumbs
          separator="›"
          sx={{
            mb: theme.spacing.xl,
        }}>
          {breadcrumbs.map((crumb, idx) => (
            <MuiLink
              key={idx}
              component={RouterLink}
              to={crumb.path}
              underline="hover"
              color="inherit"
              sx={{
                '@media (max-width: 850px)': {
                 fontSize:theme.fonts.size.sm
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  fontSize: 'inherit',
                  '@media (max-width: 850px)': {
                    fontSize:theme.fonts.size.xs
                  },
                }}
              >
                {crumb.title}
              </Box>
            </MuiLink>
          ))}
          <Typography
            sx={{
              color:theme.colors.text,
              '@media (max-width: 870px)': {
                fontSize:theme.fonts.size.xs
              },
            }}
          >
            {product.productName}
          </Typography>
        </Breadcrumbs>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%"
          }}
        >
          <Box className="product-grid"
               sx={{
                 display: 'flex',
                 gap: 4,
                 maxWidth: 1000,
                 '@media (max-width: 850px)': {
                   flexDirection: "column",
                   alignItems: "center",
                 },
          }}>
            <Box sx={{
              width: "35%",
              '@media (max-width: 850px)': {
                width: "40%",
              },
            }}>
              <CardMedia
                component="img"
                image={apiUrl + "/" + product.productPhoto}
                alt={product.productName}
                sx={{
                  width: "100%",
                  maxHeight: 500,
                  objectFit: "contain",
                  border: "1px solid lightgray",
                  backgroundColor: theme.colors.background,
                }}
              />
            </Box>
            <Box sx={{
              width: "65%",
              '@media (max-width: 850px)': {
                width: "80%",
              },
              '@media (max-width: 450px)': {
                width: "100%",
              },
            }}>
              <Typography sx={{
                fontSize: theme.fonts.size.lg,
                fontWeight: theme.fonts.weight.normal,
                mb: theme.spacing.sm,
                '@media (max-width: 850px)': {
                  textAlign: "center",
                },
                '@media (max-width: 600px)': {
                  fontSize: theme.fonts.size.default,
                },
              }}>
                {product.productName}
              </Typography>

              <Typography sx={{
                fontSize: theme.fonts.size.lg,
                fontWeight: theme.fonts.weight.normal,
                '@media (max-width: 850px)': {
                  textAlign: "center",
                },
              }}>
                {product.productPrice} сом/шт
              </Typography>

              <Typography sx={{
                color: theme.colors.text,
                fontSize: theme.fonts.size.default,
                fontWeight: theme.fonts.weight.medium,
                mt: theme.spacing.xl
              }}>
                Характеристики:
              </Typography>

              <Box component="ul" className="product-specs" sx={{ listStyle: 'none', pl: 0 }}>
                {[
                  { label: 'Бренд', value: product.brand.title ?? 'не указано' },
                  { label: 'Страна-производитель', value: product.productManufacturer ?? 'не указано' },
                  { label: 'Класс корма', value: product.productFeedClass ?? 'не указано' },
                  { label: 'Вес', value: product.productWeight ? `${product.productWeight} кг` : 'не указано' },
                  { label: 'Форма выпуска', value: product.productSize ?? 'не указано' },
                  { label: 'Возраст животного', value: product.productAge ?? 'не указано' },
                  { label: 'Категория', value: product.category?.title ?? 'не указано' },
                ].map(({ label, value }, idx) => {
                  const isMissing = value === 'не указано';
                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: theme.fonts.size.default,
                        color: theme.colors.text,
                        py: 1,
                      }}
                    >
                      <Box
                        sx={{
                          pr: 2,
                          whiteSpace: 'nowrap',
                          '@media (max-width: 600px)': {
                            fontSize: theme.fonts.size.xs,
                          },
                        }}
                      >
                        <strong>{label}</strong>
                      </Box>
                      <Box sx={{ flex: 1, borderBottom: '1px solid #ccc', mx: 1, mt: theme.spacing.xs }} />
                      <Box
                        sx={{
                          pl: 2,
                          textAlign: 'right',
                          fontSize: isMissing? theme.fonts.size.xs : theme.fonts.size.default,
                          color: isMissing ? theme.colors.warning : theme.colors.text,
                          '@media (max-width: 600px)': {
                            fontSize: theme.fonts.size.xs,
                          },
                        }}
                      >
                        {value}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  mt: theme.spacing.xl,
                  '@media (max-width: 470px)': {
                    gap: 2,
                  },
                }}
              >
                <Button
                  onClick={() => addProductToCart(product)}
                  variant="contained"
                  className="cart-button"
                  disabled={isAddToCartDisabled}
                  sx={{
                    width: "200px",
                    pt: theme.spacing.sm,
                    pl: theme.spacing.xl,
                    pr: theme.spacing.md,
                    pb: theme.spacing.sm,
                    borderRadius: "40px",
                    backgroundColor: theme.colors.black,
                    color: theme.colors.white,
                    fontSize: theme.fonts.size.default,
                    textTransform: "none",
                    '@media (max-width: 470px)': {
                      width: "100%",
                      pt: theme.spacing.xs,
                      pl: theme.spacing.sm,
                      pr: theme.spacing.sm,
                      pb: theme.spacing.xs,
                      fontSize: theme.fonts.size.sm,
                    },
                  }}
                >
                  {isAddToCartDisabled ? "Нет в наличии" : "В корзину"}
                </Button>

                <Button
                  onClick={toggleFavorite}
                  sx={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "50%",
                  }}
                >
                  {isFavorite ? (
                    <FavoriteIcon sx={{ fontSize: 50, color: theme.colors.error }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ fontSize: 50, color: theme.colors.black }} />
                  )}
                </Button>
              </Box>

            </Box>
          </Box>
        </Box>

      </Box>
      <Box sx={{ flex: 1, textAlign: "start", mt: theme.spacing.xl, ml: theme.spacing.xl, mr: theme.spacing.xl }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            borderBottom: "2px solid #ccc",
            mb: theme.spacing.xl,
          }}
        >
          <Button
            onClick={() => setTab("description")}
            sx={{
              borderRadius: 0,
              fontWeight: theme.fonts.weight.medium,
              fontSize: theme.fonts.size.default,
              color: theme.colors.text,
              borderBottom: tab === "description" ? "3px solid black" : "none",
              padding: theme.spacing.sm,
              mx: 2,
            }}
          >
            Описание
          </Button>
          <Button
            onClick={() => setTab("delivery")}
            sx={{
              borderRadius: 0,
              fontWeight: theme.fonts.weight.medium,
              fontSize: theme.fonts.size.default,
              color: theme.colors.text,
              borderBottom: tab === "delivery" ? "3px solid black" : "none",
              padding: theme.spacing.sm,
              mx: 2,
            }}
          >
            Доставка
          </Button>
        </Box>
        {tab === "description" ? (
          <div
            className="quill-content"
            dangerouslySetInnerHTML={{ __html: product?.productDescription || "" }}
          />
        ) : (
          <Typography sx={{ fontSize: theme.fonts.size.default, mt: theme.spacing.sm }}>
            {selectDeliveryInfo?.text}
            <Box component="span" sx={{ display: "block", mt: theme.spacing.md }}>
              {selectDeliveryInfo?.price}
            </Box>
          </Typography>
        )}
      </Box>
      <Box sx={{ mt: theme.spacing.xxl }}>
        {cart && (<HistoryProducts cart={cart} />)}
      </Box>
    </div>
  );
};

export default ProductPage;