import { Badge, Box, Button, Container, InputBase, Toolbar, useMediaQuery, } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, usePermission, } from '../../../app/hooks.ts';
import ExistsUser from './ExistsUser.tsx';
import UnknownUser from './UnknownUser.tsx';
import logo from '../../../assets/logo-nezabudka.png';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Typography from '@mui/material/Typography';
import './Fonts.css';
import { selectEditSite } from '../../../store/editionSite/editionSiteSlice.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { useEffect, useMemo, useRef, useState } from 'react';
import CustomCart from '../../Domain/CustomCart/CustomCart.tsx';
import { fetchSite } from '../../../store/editionSite/editionSiteThunk.ts';
import { selectProducts } from '../../../store/products/productsSlice.ts';
import { getProducts } from '../../../store/products/productsThunk.ts';
import SearchIcon from '@mui/icons-material/Search';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import CategoryNavMenu from '../../Domain/CategoryNavMenu.tsx';
import { cartFromSlice, getFromLocalStorage, } from '../../../store/cart/cartSlice.ts';
import { userRoleAdmin, userRoleClient, userRoleSuperAdmin } from '../../../globalConstants.ts';
import IconButton from '@mui/joy/IconButton';
import { fetchUserIdBonus } from '../../../store/users/usersThunk.ts';
import Tooltip from '@mui/joy/Tooltip';
import { selectedFavorite } from '../../../store/favoriteProducts/favoriteProductsSlice.ts';
import { getLocalFavoriteProducts } from '../../../store/favoriteProducts/favoriteProductLocal.ts';
import { ClickAwayListener } from "@mui/material";
import theme from "../../../globalStyles/globalTheme.ts";
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  Heart,
  MagnifyingGlass,
  ShoppingCartSimple,
  Star, Truck
} from 'phosphor-react';

const MainToolbar = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [openCategoryMenu, setOpenCategoryMenu] = useState<boolean>(false);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const user = useAppSelector(selectUser);
  const site = useAppSelector(selectEditSite);
  const cart = useAppSelector(cartFromSlice);
  const favoriteProducts = useAppSelector(selectedFavorite);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const can = usePermission(user);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");


  useEffect(() => {
    if (user && can([userRoleClient])) {
      setFavoriteCount(favoriteProducts.length);
      return;
    }


    const update = () => {
      setFavoriteCount(getLocalFavoriteProducts().length);
    };

    update();

    const interval = setInterval(update, 500);
    window.addEventListener("storage", update);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", update);
    };
  }, [favoriteProducts, user, can]);




  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserIdBonus(String(user.id))).unwrap();
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    if(!user) {
      dispatch(getFromLocalStorage());
    }
    dispatch(fetchSite()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      dispatch(getProducts(debouncedSearch)).unwrap();
    } else {
      dispatch(getProducts("")).unwrap();
    }
  }, [dispatch, debouncedSearch]);

  const filteredProducts = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return products;
    }

    return products.filter((product) =>
      product.productName.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, products]);

  const closeCart = () => {
    setOpenCart(false);
  };

  const closeMenu = () => {
    setOpenCategoryMenu(false);
    navigate("/");
  };

  const checkProductInCart: number[] = Array.isArray(cart?.products)
    ? cart.products.map((product) => product.quantity)
    : [];

  const sum: number | null =
    checkProductInCart &&
    checkProductInCart.reduce((acc: number, i: number) => {
      acc = acc + i;
      return acc;
    }, 0);


  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const highlightText = (text: string, search: string) => {
    if (!search) return text;

    const escapedSearch = escapeRegExp(search);
    const reg = new RegExp(`(${escapedSearch})`, 'gi');

    const parts = text.split(reg);

    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <strong key={index} style={{ fontWeight: theme.fonts.weight.medium }}>
          {part}
        </strong>
      ) : (
        part
      )
    );
  };


  return (
    <div>
      <CategoryNavMenu openMenu={openCategoryMenu} closeMenu={closeMenu} />
      <CustomCart openCart={openCart} closeCart={closeCart} />
      <Box
        sx={{
          textAlign: "left",
        }}
      >
        {(!user || (user.role !== "admin" && user.role !== "superAdmin")) && (
          <Container  maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: theme.spacing.lg,
                marginTop: theme.spacing.exs,
                marginBottom:theme.spacing.exs,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.xs,
                }}
              >
                <a
                  href={site?.linkAddress || "/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "black",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    paddingRight:  theme.spacing.xs,
                  }}
                >
                  <Typography
                    sx={{
                      color: theme.colors.text,
                      fontSize: theme.fonts.size.default,
                      fontWeight:theme.fonts.weight.medium,
                      "@media (max-width: 800px)": { fontSize: theme.fonts.size.xs },
                    }}
                  >
                    {site?.address}
                  </Typography>
                </a>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.xs,
                  cursor: "pointer",
                }}
              >
                <Typography
                  sx={{
                    borderRight: `1px solid ${theme.colors.text}`,
                    paddingRight: theme.spacing.xs,
                    color: theme.colors.text,
                    fontSize: theme.fonts.size.default,
                    fontWeight:theme.fonts.weight.medium,
                    "@media (max-width: 800px)": { fontSize: theme.fonts.size.xs },
                    "@media (max-width: 560px)": {
                      borderRight: "none",
                      paddingRight: "0px",
                    },
                  }}
                >
                  <a
                    href={`tel:${site?.phone}`}
                    style={{ textDecoration: "none", color: theme.colors.text, display: "flex", alignItems: "center", }}
                  >
                    <PhoneIcon/>
                    {site?.phone}
                  </a>
                </Typography>

                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: theme.colors.text,
                    fontSize: theme.fonts.size.default,
                    fontWeight: theme.fonts.weight.medium,
                    "@media (max-width: 800px)": { fontSize:  theme.fonts.size.xs},
                    "@media (max-width: 560px)": { display: "none" },
                  }}
                >
                  <AccessTimeIcon/>
                  {site && site.schedule}
                </Typography>
              </Box>
            </Box>
          </Container>
        )}
      </Box>
      <div
        style={{
          background: user?.role === "superAdmin"
            ? "linear-gradient(135deg, #1B4332 0%, #A3B72F 50%, #F4D35E 100%)"
            : theme.colors.primary,
          backgroundSize: "200%",
          backgroundPosition: "center",
          borderBottom: `1px solid ${theme.colors.white}`,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >

      <Container maxWidth="xl" style={{ padding: "0px" }}>
          <Box
            sx={{
              position: "static",
            }}
          >
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "15px",
                paddingBottom: "15px",
                "@media (max-width: 1430px)": {
                  paddingTop: theme.spacing.exs,
                  paddingBottom: 0,
                },
                "@media (max-width: 1100px)": {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }} >
                <Box
                  onClick={() => setOpenCategoryMenu(true)}
                  sx={{
                    display: "none",
                    "@media (max-width: 900px)": {
                      paddingTop: "7px",
                      paddingBottom: "7px",
                      borderRadius: theme.spacing.xs,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "background 0.3s ease",
                      position: "relative",
                      marginRight: theme.spacing.sm,
                    },
                  }}
                >
                  <MenuIcon sx={{ color: theme.colors.white }} />
                </Box>
                <NavLink
                  to="/"
                  className="text-decoration-none d-flex align-items-center gap-2"
                >
                  <Box
                    component="img"
                    src={logo}
                    alt="Nezabudka"
                    sx={{
                      height: "65px",
                      width: "65px",
                      cursor: "pointer",
                      marginRight: "8px",
                      "@media (max-width: 800px)": {
                        height: "50px",
                        width: "50px",
                      },
                    }}
                  />
                  <div>
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "15px",
                          sm: "26px",
                          md: "28px",
                        },
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        fontFamily: 'Tahoma, sans-serif',
                        color: theme.colors.white,
                        cursor: "pointer",
                        marginRight: theme.spacing.xs,
                        "@media (max-width: 500px)": {
                          paddingRight: theme.spacing.xs,
                        },
                      }}
                    >
                      Незабудка
                    </Typography>
                  </div>
                </NavLink>
              </div>

              {(user && can(["client"])) || !user && !focused ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "auto",
                    gap: "27px",
                    "@media (max-width: 1100px)": {
                      display: "inline",
                    },
                  }}
                >
                  <Box
                    component={NavLink}
                    to="/all-products"
                    sx={{
                      fontSize: theme.fonts.size.lg,
                      textDecoration: "none",
                      color: theme.colors.white,
                      "@media (max-width: 1230px)": {
                        fontSize: theme.fonts.size.default,
                      },
                      "@media (max-width: 1100px)": {
                        display: "none",
                      },
                    }}
                  >
                    Каталог
                  </Box>
                  <Box
                    component={NavLink}
                    to="/delivery"
                    sx={{
                      textDecoration: "none",
                      color: theme.colors.white,
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing.exs,
                      fontSize: theme.fonts.size.lg,
                      "@media (max-width: 1230px)": {
                        fontSize: theme.fonts.size.default,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline",
                        "@media (max-width: 1100px)": {
                          display: "none",
                        },
                      }}
                    >
                      Доставка и оплата
                    </Box>
                  </Box>
                  <Box
                    component={NavLink}
                    to="/contacts"
                    sx={{
                      fontSize: theme.fonts.size.lg,
                      textDecoration: "none",
                      color: theme.colors.white,
                      "@media (max-width: 1230px)": {
                        fontSize: theme.fonts.size.default,
                      },
                      "@media (max-width: 1100px)": {
                        display: "none",
                      },
                    }}
                  >
                    Контакты
                  </Box>
                </Box>
              ) : null}
              <ClickAwayListener onClickAway={() => { setFocused(false); }}>
                <Box
                  sx={{
                    display: "flex",
                    marginLeft: "auto",
                    marginRight: "10px",
                    position: "relative",
                    width: "100%",
                    maxWidth: focused ? "500px" : "50px",
                    "@media (max-width: 1060px)": {
                      display: "none",
                    }
                  }}
                >
                  <Box
                    component="form"
                    sx={{
                      position: "relative",
                      marginLeft: "auto",
                      width: "100%",
                      maxWidth: "400px",
                      height: "50px",
                      paddingRight: "50px",
                      transition: "all 0.5s",
                      borderRadius: "25px",
                      overflow: "hidden",
                      boxSizing: "border-box",
                      zIndex: 10,
                      display: "flex",
                      alignItems: "center",
                      border: focused ? `1px solid ${theme.colors.yellow}` : "1px solid transparent",
                      boxShadow: focused ? `0px 0px 10px ${theme.colors.yellow}` : "none",
                      backgroundColor: focused ? theme.colors.white : "transparent",
                    }}
                  >
                    <InputBase
                      inputRef={inputRef}
                      sx={{
                        width: focused ? "100%" : "0",
                        opacity: focused ? 1 : 0,
                        height: "100%",
                        borderRadius: "20px",
                        padding: focused ? `0 ${theme.spacing.sm}` : 0,
                        transition: "all 0.5s ease",
                        fontSize: theme.fonts.size.default,
                        color: theme.colors.text,
                        backgroundColor: "transparent",
                        flexGrow: 1,
                      }}
                      placeholder="Поиск товара"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => setFocused(true)}
                    />
                    <IconButton
                      onClick={() => {
                        setFocused(true);
                        inputRef.current?.focus();
                      }}
                      sx={{
                        width: "42.5px",
                        height: "42.5px",
                        position: "absolute",
                        right: 3,
                        borderRadius: "50%",
                        padding: 0,
                        color: "inherit",
                        backgroundColor: "transparent",
                        transition: "all 0.5s",
                        '&:hover': {
                          backgroundColor: "transparent",
                        },
                        '&:focus': {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      <MagnifyingGlass
                        size={28}
                        weight="regular"
                        color={focused ? theme.colors.DARK_GREEN : theme.colors.white}
                      />
                    </IconButton>
                  </Box>


                  {search && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        maxHeight: 300,
                        overflowY: "auto",
                        backgroundColor: theme.colors.white,
                        boxShadow: 3,
                        zIndex: 1000,
                        marginTop: 1,
                        borderRadius: 1,
                      }}
                    >
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <NavLink
                            key={product.id}
                            className="text-decoration-none text-black"
                            to={
                              user && can([userRoleAdmin, userRoleSuperAdmin])
                                ? `/private/edit_product/${product.id}`
                                : `/product/${product.id}`
                            }
                            onClick={() => { setSearch(""); setFocused(false); }}
                          >
                            <Box
                              sx={{
                                padding: theme.spacing.xs,
                                borderBottom: `1px solid ${theme.colors.background}`,
                                display: focused ? "block" : "none"
                              }}
                            >
                              <Box
                                sx={{ fontSize: theme.fonts.size.default, fontWeight: theme.fonts.weight.normal }}
                              >
                                {highlightText(product.productName, search)}
                              </Box>
                            </Box>
                          </NavLink>
                        ))
                      ) : (
                        <Box sx={{ padding: theme.spacing.xs, display: focused ? "block": "none" }}>
                          Товаров не найдено
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </ClickAwayListener>

              {/*Toolbar*/}
              <Box sx={{ display: "flex", alignItems: "center",  gap: theme.spacing.xs }}>
                {(user && can(["client"])) || !user ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: theme.spacing.xs }}>
                      <Box
                        component={NavLink}
                        to="/delivery"
                        sx={{
                          display: "none",
                          "@media (max-width: 1100px)": {
                            borderRadius: "10px",
                            backgroundColor: "transparent",
                            padding: "10px 0 10px 20px",
                            display: "inline",
                          },
                          "@media (max-width: 900px)": {
                            padding: { xs: "9px", sm: "10px", md: "7px 20px" },
                            borderRadius: { xs: "50%", md: "10px" },
                          },
                          "@media (max-width: 400px)": {
                            paddingRight: 0,
                          },
                        }}
                      >
                        <Tooltip
                          sx={{
                            backgroundColor: theme.colors.tooltip_color,
                            backdropFilter: 'blur(10px)',
                          }}
                          title='Информация о доставке'>
                          <Truck
                            size={isMobile ? 20 : 28}
                            weight="regular"
                            color={theme.colors.white}
                          />
                        </Tooltip>
                      </Box>
                      {/*Cart*/}
                      <Box
                        onClick={() => setOpenCart(true)}
                        sx={{
                          backgroundColor: "transparent",
                          padding: { xs: "10px", sm: "10px", md: "7px" },
                          borderRadius: { xs: "50%", md: "10px" },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "background 0.3s ease",
                          "@media (max-width: 400px)": {
                            paddingRight: 0,
                          },
                        }}
                      >
                        <Tooltip
                          title="Корзина"
                          sx={{
                            backgroundColor: theme.colors.tooltip_color,
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <Badge
                            badgeContent={sum}
                            overlap="circular"
                            color="warning"
                            sx={{
                              backgroundColor: user ? "transparent" : undefined,
                              "& .MuiBadge-badge": {
                                top: "-3px",
                                right: "-4px",
                              },
                            }}
                          >
                            <ShoppingCartSimple
                              size={isMobile ? 20 : 28}
                              weight="regular"
                              color={theme.colors.white}
                            />
                          </Badge>
                        </Tooltip>
                      </Box>
                      {/*Cart*/}

                      {/*Favorites*/}
                      <Box
                        component={NavLink}
                        to="/favorite-products"
                        sx={{
                          backgroundColor: "transparent",
                          padding: { xs: "10px", sm: "10px", md: "7px" },
                          borderRadius: { xs: "50%", md: "10px" },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "background 0.3s ease",
                          position: "relative",
                        }}
                      >
                        <Badge
                          badgeContent={favoriteCount}
                          overlap="circular"
                          color="warning"
                          sx={{
                            backgroundColor: user ? "transparent" : undefined,
                            "& .MuiBadge-badge": {
                              top: "-3px",
                              right: "-4px",
                            },
                          }}
                        >
                          <Tooltip
                            sx={{
                              backgroundColor: theme.colors.tooltip_color,
                              backdropFilter: 'blur(10px)',
                            }}
                            title='Избранное'>
                            <Heart
                              size={isMobile ? 20 : 28}
                              weight="regular"
                              color={theme.colors.white}
                            />
                          </Tooltip>
                        </Badge>
                      </Box>
                      {/*Favorites*/}

                      {/*Bonus*/}
                      <Tooltip
                        sx={{
                          backgroundColor: theme.colors.tooltip_color,
                          backdropFilter: 'blur(10px)',
                        }}
                        title={
                        <Box sx={{ textAlign: "center", padding: "10px", maxWidth: "300px" }}>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              fontSize: "16px",
                              marginBottom: "5px",
                              color: "#fff",
                            }}
                          >
                            Мои бонусы
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "14px",
                              color: theme.colors.white,
                            }}
                          >
                            Вы можете получить бонусы за каждый оформленный заказ и в дальнейшем
                            использовать накопленные бонусы для покупки товара.
                          </Typography>
                        </Box>
                      }
                      >
                        <NavLink
                          to={ user ? `/my_account/users/account/${user?.id}` : '/bonus_program'}
                          style={{ textDecoration: "none" }}
                        >
                          <Box
                            sx={{
                              backgroundColor: "transparent",
                              padding: theme.spacing.xs,
                              borderRadius: "10px",
                              display: { xs: "none", md: "flex" },
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              transition: "background 0.3s ease",
                              color: theme.colors.tooltip_color,
                            }}
                          >
                            <Badge
                              badgeContent={user?.bonus}
                              overlap="circular"
                              color="warning"
                              sx={{
                                backgroundColor: user ? "transparent" : undefined,
                                "& .MuiBadge-badge": {
                                  top: "-3px",
                                  right: "-1px",
                                },
                              }}
                            >
                              <Star
                                size={28}
                                weight="regular"
                                color={theme.colors.white}
                              />
                            </Badge>
                          </Box>
                        </NavLink>
                      </Tooltip>
                    {/*  Bonus*/}
                    </Box>

                    <Box
                      sx={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        backgroundColor: theme.colors.white,
                        boxShadow: "0px -2px 5px #8EA58C",
                        padding: "10px 0",
                        display: { xs: "flex", md: "none" },
                        justifyContent: "space-around",
                        alignItems: "center",
                        zIndex: 1000,
                      }}
                    >
                      <NavLink
                        to="/my_orders"
                        style={{ textDecoration: "none", marginTop: "5px" }}
                      >
                        <Badge
                          badgeContent={sum}
                          overlap="circular"
                          color="warning"
                        >
                          <Button
                            sx={{
                              color: "black",
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              padding: 0,
                              gap: "8px",
                            }}
                          >
                            <LocalMallOutlinedIcon
                              sx={{
                                width: "27px",
                                height: "27px",
                                color: "black",
                              }}
                            />
                          </Button>
                        </Badge>
                        <Typography
                          sx={{
                            color: theme.colors.text,
                            fontSize: "14px",
                            textTransform: "uppercase",
                            marginTop: "7px",
                          }}
                        >
                        </Typography>
                      </NavLink>

                      <NavLink
                        to="/favorite-products"
                        style={{ textDecoration: "none" }}
                      >
                        <Badge
                          badgeContent={favoriteCount}
                          overlap="circular"
                          color="warning"
                        >
                          <Button
                            sx={{
                              color: theme.colors.text,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              padding: 0,
                              gap: "8px",
                            }}
                          >
                            <FavoriteBorderIcon
                              sx={{
                                width: "27px",
                                height: "27px",
                                color: "black",
                                marginLeft: "20px",
                              }}
                            />
                          </Button>
                        </Badge>
                        <Typography
                          sx={{
                            color: theme.colors.text,
                            fontSize: theme.fonts.size.sm,
                            textTransform: "uppercase",
                            marginTop: "7px",
                            textAlign: "center",
                          }}
                        >
                        </Typography>
                      </NavLink>

                      {user ? <ExistsUser /> : <UnknownUser />}
                    </Box>
                  </Box>
                ) : null}

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px"}}>
                  {user && can(["admin", "superAdmin"]) && (
                    <Box
                      sx={{
                        display: "none",
                        "@media (max-width: 1100px)": {
                          backgroundColor: theme.colors.yellow,
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "background 0.3s ease",
                          position: "relative",
                        },
                        "@media (max-width: 800px)": {
                          borderRadius: "50%",
                        },
                      }}
                    >
                      <NavLink
                        to="/private/edition_site"
                        style={{ textDecoration: "none" }}
                      >
                        <Box
                          sx={{
                            backgroundColor: theme.colors.yellow,
                            paddingTop: theme.spacing.xs,
                            paddingBottom:  theme.spacing.xs,
                            paddingRight: theme.spacing.sm,
                            paddingLeft: theme.spacing.sm,
                            borderRadius:  theme.spacing.xs,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "background 0.3s ease",
                            "@media (max-width: 800px)": {
                              borderRadius: "50%",
                              paddingTop:  theme.spacing.xs,
                              paddingBottom:  theme.spacing.xs,
                              paddingRight:  theme.spacing.xs,
                              paddingLeft:  theme.spacing.xs,
                            },
                          }}
                        >
                          <SettingsIcon sx={{ color: theme.colors.black }} />
                        </Box>
                      </NavLink>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: { xs: "none", md: "flex" },
                      backgroundColor: "transparent",
                      padding: "7px 20px 7px 0",
                      borderRadius: "10px",
                      alignItems: "center",
                    }}
                  >
                    {user ? <ExistsUser /> : <UnknownUser />}
                  </Box>
                </Box>
              </Box>
              {/*Toolbar*/}

              {user && can(["admin", "superAdmin"]) && (
                <Box
                  sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    backgroundColor: theme.colors.white,
                    boxShadow: `0px -2px 5px ${theme.colors.primary}`,
                    padding: "10px 0",
                    display: "none",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    zIndex: 1000,
                    "@media (max-width: 900px)": {
                      display: "flex",
                    },
                  }}
                >
                  <NavLink
                    to="/private/client_orders"
                    style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center" }}
                  >
                    <Badge
                      badgeContent={sum}
                      overlap="circular"
                      color="warning"
                    >
                      <Button
                        sx={{
                          color: "black",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: 0,
                          gap: "8px",
                        }}
                      >
                        <LocalMallOutlinedIcon
                          sx={{
                            width: "27px",
                            height: "27px",
                            color: theme.colors.black,
                          }}
                        />
                      </Button>
                    </Badge>
                    <Typography
                      sx={{
                        color: theme.colors.black,
                        fontSize: theme.fonts.size.sm,
                        textTransform: "uppercase",
                        marginTop: "7px",
                        textAlign: "center",
                      }}
                    >
                      Заказы
                    </Typography>
                  </NavLink>

                  <NavLink
                    to="/private/clients"
                    style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center" }}
                  >
                    <Badge
                      badgeContent={sum}
                      overlap="circular"
                      color="warning"
                    >
                      <Button
                        sx={{
                          color: theme.colors.black,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: 0,
                          gap: "8px",
                        }}
                      >
                        <GroupOutlinedIcon
                          sx={{
                            width: "30px",
                            height: "30px",
                            color: "black",
                            marginTop: "5px",
                          }}
                        />
                      </Button>
                    </Badge>
                    <Typography
                      sx={{
                        color: theme.colors.black,
                        fontSize: theme.fonts.size.sm,
                        textTransform: "uppercase",
                        marginTop: "7px",
                        textAlign: "center",
                      }}
                    >
                      Клиенты
                    </Typography>
                  </NavLink>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 0,
                        gap: "8px",
                      }}
                    >
                      {user ? <ExistsUser /> : <UnknownUser />}
                    </Button>
                  </Box>
                </Box>
              )}
            </Toolbar>
            <Box
              sx={{
                "@media (max-width: 800px)": {
                  paddingBottom: "10px",
                },
              }}
            >
              <Box
                sx={{
                  display: "none",
                  "@media (max-width: 1060px)": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                }}
              >
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                  <Box
                    sx={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      margin: "10px 40px",
                      flexDirection: "column",
                    }}
                  >
                    <input
                      style={{
                        width: "100%",
                        padding: "10px 40px 10px 16px",
                        fontSize: "16px",
                        color: "#333",
                        backgroundColor: "white",
                        border: "2px solid rgb(195, 190, 182)",
                        borderRadius: "30px",
                        outline: "none",
                        transition: "all 0.3s ease-in-out",
                        boxShadow: "0 4px 10px rgba(91, 113, 51, 0.3)",
                      }}
                      placeholder="Поиск товара"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setOpen(true);
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = `${theme.colors.yellow}`;
                        e.target.style.boxShadow = `0px 0px 10px ${theme.colors.yellow}`;
                        setOpen(true);
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#475726";
                        e.target.style.boxShadow = "0 4px 10px rgba(91, 113, 51, 0.3)";
                      }}
                    />
                    <button
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: theme.colors.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SearchIcon />
                    </button>

                    {open && search && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          width: "100%",
                          maxHeight: 300,
                          overflowY: "auto",
                          backgroundColor: theme.colors.white,
                          boxShadow: 3,
                          zIndex: 1000,
                          marginTop: 1,
                          borderRadius: 1,
                          "@media (max-width: 1430px)": {
                            top: "92%",
                            left: 12,
                            width: "98%",
                          },
                        }}
                      >
                        {products.length > 0 ? (
                          products.map((product) => (
                            <NavLink
                              key={product.id}
                              className="text-decoration-none text-black"
                              to={
                                user &&
                                (user.role === userRoleAdmin ||
                                  user.role === userRoleSuperAdmin)
                                  ? `/private/edit_product/${product.id}`
                                  : `/product/${product.id}`
                              }
                              onClick={() => {
                                setSearch("");
                                setOpen(false);
                              }}
                            >
                              <div
                                style={{
                                  padding: "10px",
                                  borderBottom: `1px solid ${theme.colors.lightGrey}`,
                                }}
                              >
                                {highlightText(product.productName, search)}
                              </div>
                            </NavLink>
                          ))
                        ) : (
                          <div style={{ padding: "10px" }}>Товаров не найдено</div>
                        )}
                      </Box>
                    )}
                  </Box>
                </ClickAwayListener>
              </Box>
            </Box>
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default MainToolbar;
