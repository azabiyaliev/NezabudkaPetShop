import {
  Badge,
  Box,
  Breadcrumbs,
  Button,
  CardMedia,
  Container,
  IconButton,
  Link as MuiLink,
  Typography
} from '@mui/material';
import '../css/product.css';
import { useAppDispatch, useAppSelector, usePermission } from '../../../app/hooks.ts';
import { useEffect, useState } from 'react';
import { getOneProduct } from '../../../store/products/productsThunk.ts';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { selectProduct } from '../../../store/products/productsSlice.ts';
import { apiUrl, userRoleAdmin, userRoleClient, userRoleSuperAdmin } from '../../../globalConstants.ts';
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
import {
  addFavoriteProduct,
  getLocalFavoriteProducts,
  removeFavoriteProduct
} from '../../../store/favoriteProducts/favoriteProductLocal.ts';
import {
  addFavoriteProducts,
  getFavoriteProducts,
  removeFavoriteProductThunk
} from '../../../store/favoriteProducts/favoriteProductsThunks.ts';
import { selectDelivery } from '../../../store/deliveryPage/deliveryPageSlice.ts';
import { fetchDeliveryPage } from '../../../store/deliveryPage/deliveryPageThunk.ts';
import { addProductToHistory } from '../../../store/historyProduct/historyProductSlice.ts';
import { selectedFavorite } from '../../../store/favoriteProducts/favoriteProductsSlice.ts';
import { COLORS, FONTS, SPACING } from '../../../globalStyles/stylesObjects.ts';
import ReactHtmlParser from 'html-react-parser';
import { Tooltip } from '@mui/joy';

const ProductPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const product = useAppSelector(selectProduct);
  const cart = useAppSelector(cartFromSlice);
  const user = useAppSelector(selectUser);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [tab, setTab] = useState<"description" | "delivery">("description");
  const selectDeliveryInfo = useAppSelector(selectDelivery)
  const favoriteProducts = useAppSelector(selectedFavorite);
  const isAddToCartDisabled = !product?.existence;
  const cartItem = cart?.products.find(item => item.product?.id === product?.id);
  const can = usePermission(user);

  useEffect(() => {
    if (id && product && product.id && product.productName) {
      dispatch(addProductToHistory({
        productId: product.id,
        product,
      }));
    }
  }, [dispatch, id, product]);

  useEffect(() => {
    if (user && can([userRoleClient])) {
      dispatch(fetchCart());
      dispatch(getFavoriteProducts());
    } else {
      dispatch(getFromLocalStorage());
    }
  }, [dispatch, user, can]);

  useEffect(() => {
    if (id) {
      const parsedId = Number(id);
      if (!isNaN(parsedId)) {
        dispatch(getOneProduct(parsedId));
      }
    }
  }, [dispatch, id]);

  useEffect(() => {
    const isFav = user
      ? favoriteProducts.some((fav) => fav.product.id === product?.id)
      : getLocalFavoriteProducts().includes(Number(product?.id));

    setIsFavorite(isFav);
  }, [user, favoriteProducts, product?.id]);

  useEffect(() => {
    dispatch(fetchDeliveryPage());
  }, [dispatch]);

  if (!product) {
    return <Typography sx={{ padding: 4 }}>Загрузка товара...</Typography>;
  }

  const addProductToCart = async (product: ProductResponse) => {
    if (user && can([userRoleClient]) && cart) {
      await dispatch(
        addItem({
          cartId: cart.id,
          productId: product.id,
          quantity: 1,
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

  const toggleFavorite = async (id: number) => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);

    if (user && can([userRoleClient])) {
      if (newValue) {
        await dispatch(addFavoriteProducts(id));
        await dispatch(getFavoriteProducts());
        enqueueSnackbar("Добавлено в избранное", { variant: "success" });
      } else {
        await dispatch(removeFavoriteProductThunk(id));
        await dispatch(getFavoriteProducts());
        enqueueSnackbar("Удалено из избранного", { variant: "info" });
      }
    } else {
      if (newValue) {
        addFavoriteProduct(id);
        enqueueSnackbar("Добавлено в избранное", { variant: "success" });
      } else {
        removeFavoriteProduct(id);
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
  const breadcrumbs = product.productCategory?.[0]?.category
    ? getBreadcrumbs(product.productCategory[0].category)
    : [];

  return (
    <Container maxWidth="xl">
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
              position: 'relative',
              '@media (max-width: 850px)': {
                width: "40%",
              },
            }}>
              {product.sales && (
                <Box sx={{
                  position: 'absolute',
                  top: 10,
                  left: 8,
                  backgroundColor: COLORS.warning,
                  color: COLORS.white,
                  padding: `${SPACING.exs} ${SPACING.xs}`,
                  borderRadius: '5px',
                  fontWeight: FONTS.weight.bold,
                  fontSize: FONTS.size.sm,
                  cursor: 'pointer',
                  zIndex: 2,
                }}>
                  - {product.promoPercentage}%
                </Box>
              )}
              <CardMedia
                component="img"
                image={apiUrl + "/" + product.productPhoto}
                alt={product.productName}
                sx={{
                  width: "100%",
                  maxHeight: 500,
                  objectFit: "contain",
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

              {product.sales ? <>
                  <Typography fontWeight={600} sx={{
                    textDecoration: 'line-through',
                    color: COLORS.text,
                  }}>
                    {product.productPrice.toLocaleString('ru-RU').replace(/,/g, ' ')} сом
                  </Typography>
                  <Typography fontWeight={600} sx={{ color: COLORS.warning }}>
                    {product.promoPrice && product.promoPrice.toLocaleString('ru-RU').replace(/,/g, ' ')} сом
                  </Typography>
              </> :
                <Typography sx={{
                  fontSize: theme.fonts.size.lg,
                  fontWeight: theme.fonts.weight.normal,
                  '@media (max-width: 850px)': {
                    textAlign: "center",
                  },
                }}>
                  {product.productPrice} сом/шт
                </Typography>
              }

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
                  {
                    label: 'Категории',
                    value: product.productCategory.length
                      ? product.productCategory
                        .map(({ category }) =>
                          category.parent
                            ? `${category.parent.title} → ${category.title}`
                            : category.title
                        )
                        .join(', ')
                      : 'не указано'
                  }
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
               <>
               {user && (can([userRoleAdmin, userRoleSuperAdmin])) ?
                 <Tooltip
                   title={'Вы не можете добавлять товар в корзину'}
                   placement="bottom-start"
                   variant="plain"
                   sx={{color: COLORS.white, backgroundColor: COLORS.yellow}}
                 >
                   <span>
                     <Button
                       variant="contained"
                       className="cart-button"
                       disabled={user && (can([userRoleAdmin, userRoleSuperAdmin]))}
                       sx={{
                         width: "200px",
                         padding: `${SPACING.sm} ${SPACING.lg}`,
                         borderRadius: "40px",
                         backgroundColor: COLORS.DARK_GREEN,
                         color: theme.colors.white,
                         fontSize: theme.fonts.size.default,
                         textTransform: "none",
                         "&:hover": {
                           backgroundColor: COLORS.FOREST_GREEN,
                         },
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
                   </span>
                 </Tooltip> :
                 <Badge
                   badgeContent={cartItem && cartItem.quantity}
                   sx={{
                     '& .MuiBadge-badge': {
                       margin: '10px',
                       backgroundColor: COLORS.adminBackgroundYellow,
                       color: COLORS.background,
                       width: SPACING.xl,
                       height: SPACING.xl,
                       borderRadius: '50%',
                       fontSize: FONTS.size.default,
                       fontWeight: FONTS.weight.bold,
                     },
                   }}
                 >
                   <Button
                     onClick={() => addProductToCart(product)}
                     variant="contained"
                     className="cart-button"
                     disabled={user && (can([userRoleAdmin, userRoleSuperAdmin])) || isAddToCartDisabled}
                     sx={{
                       width: "200px",
                       padding: `${SPACING.sm} ${SPACING.lg}`,
                       borderRadius: "40px",
                       backgroundColor: COLORS.primary,
                       color: theme.colors.white,
                       fontSize: theme.fonts.size.default,
                       textTransform: "none",
                       "&:hover": {
                         backgroundColor: COLORS.FOREST_GREEN,
                       },
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
                 </Badge>}
               </>
               <>
                 {user && (can([userRoleAdmin, userRoleSuperAdmin])) ?
                   <Tooltip
                     title={'Вы не можете добавлять товар в избранные'}
                     placement="bottom-start"
                     variant="plain"
                     sx={{color: COLORS.white, backgroundColor: COLORS.yellow}}
                   >
                     <span>
                       <IconButton
                         disabled={user && (can([userRoleAdmin, userRoleSuperAdmin]))}
                       >
                         {isFavorite ? (
                           <FavoriteIcon sx={{ fontSize: 50, color: theme.colors.error,
                             '@media (max-width: 470px)': {
                               fontSize: 30
                             },
                           }} />
                         ) : (
                           <FavoriteBorderIcon sx={{ fontSize: 50, color: theme.colors.black,
                             '@media (max-width: 470px)': {
                               fontSize: 30
                             },
                           }} />
                         )}
                       </IconButton>
                     </span>
                   </Tooltip> :
                   <IconButton
                     onClick={() => toggleFavorite(product.id)}
                     sx={{
                       width: "46px",
                       height: "46px",
                       borderRadius: "50%",
                     }}
                   >
                     {isFavorite ? (
                       <FavoriteIcon sx={{ fontSize: 50, color: theme.colors.error,
                         '@media (max-width: 470px)': {
                           fontSize: 30
                         },
                       }} />
                     ) : (
                       <FavoriteBorderIcon sx={{ fontSize: 50, color: theme.colors.black,
                         '@media (max-width: 470px)': {
                           fontSize: 30
                         },
                       }} />
                     )}
                   </IconButton>
                 }
               </>
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
          <>
            {selectDeliveryInfo && (
              <Typography sx={{ fontSize: theme.fonts.size.default, mt: theme.spacing.sm }}>
                { ReactHtmlParser(selectDeliveryInfo.text) }
              </Typography>
            )}
            {selectDeliveryInfo && ( <Typography component="span" sx={{ display: "block", mt: theme.spacing.md }}>
              { ReactHtmlParser(selectDeliveryInfo.price) }
            </Typography>
            )}
          </>
        )}
      </Box>
      <Box sx={{ mt: theme.spacing.xxl }}>
        {cart && (<HistoryProducts cart={cart} />)}
      </Box>
    </Container>
  );
};

export default ProductPage;