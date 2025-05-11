import { Badge, Box, Button, Container, InputBase, Toolbar, } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, usePermission, } from '../../../app/hooks.ts';
import ExistsUser from './ExistsUser.tsx';
import UnknownUser from './UnknownUser.tsx';
import logo from '../../../assets/logo-nezabudka.webp';
import backImage from '../../../assets/фон.png';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
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
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { fetchUserIdBonus } from '../../../store/users/usersThunk.ts';
import Tooltip from '@mui/joy/Tooltip';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { selectedFavorite } from '../../../store/favoriteProducts/favoriteProductsSlice.ts';
import { getLocalFavoriteProducts } from '../../../store/favoriteProducts/favoriteProductLocal.ts';
import { ClickAwayListener } from "@mui/material";
import theme from "../../../globalStyles/globalTheme.ts";

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
                gap: "30px",
                marginTop: "5px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
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
                    paddingRight: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "black",
                      fontSize: 16,
                      "@media (max-width: 800px)": { fontSize: 13 },
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
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <Typography
                  sx={{
                    borderRight: "1px solid black",
                    paddingRight: "10px",
                    "@media (max-width: 800px)": { fontSize: 13 },
                    "@media (max-width: 560px)": {
                      borderRight: "none",
                      paddingRight: "0px",
                    },
                  }}
                >
                  <a
                    href={`tel:${site?.phone}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {site?.phone}
                  </a>
                </Typography>

                <Typography
                  sx={{
                    "@media (max-width: 800px)": { fontSize: 13 },
                    "@media (max-width: 560px)": { display: "none" },
                  }}
                >
                  ({site && site.schedule})
                </Typography>
              </Box>
            </Box>
          </Container>
        )}
      </Box>
      <div
        style={{
          backgroundColor: user?.role === "superAdmin" ? "#FE5D26" : "#75AF4C",
          backgroundImage: `url("${backImage}")`,
          backgroundSize: "15%",
          backgroundPosition: "center",
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
                  paddingTop: "5px",
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
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "background 0.3s ease",
                      position: "relative",
                      marginRight: "20px",
                    },
                  }}
                >
                  <MenuIcon sx={{ color: "white" }} />
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
                        fontFamily: "COMIC SANS MS, Roboto, Arial, sans-serif",
                        color: "white",
                        cursor: "pointer",
                        marginRight: theme.spacing.xs,
                        "@media (max-width: 500px)": {
                          paddingRight: "10px",
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
                      fontSize: "20px",
                      textDecoration: "none",
                      color: "white",
                      fontWeight: "bold",
                      "@media (max-width: 1230px)": {
                        fontSize: "17px",
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
                    to="/contacts"
                    sx={{
                      fontSize: "20px",
                      textDecoration: "none",
                      color: "white",
                      fontWeight: "bold",
                      "@media (max-width: 1230px)": {
                        fontSize: "17px",
                      },
                      "@media (max-width: 1100px)": {
                        display: "none",
                      },
                    }}
                  >
                    Контакты
                  </Box>
                  <Box
                    component={NavLink}
                    to="/delivery"
                    sx={{
                      textDecoration: "none",
                      color: "white",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "20px",
                      "@media (max-width: 1230px)": {
                        fontSize: "17px",
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
                      width: focused ? "100%" : "50px",
                      height: "50px",
                      paddingRight: "50px",
                      transition: "all 0.5s",
                      borderRadius: "25px",
                      backgroundColor: theme.colors.white,
                      overflow: "hidden",
                      boxSizing: "border-box",
                      zIndex: 10,
                      display: "flex",
                      alignItems: "center",
                      "&:focus-within": {
                        cursor: "pointer",
                        border: `1px solid ${theme.colors.yellow}`,
                        boxShadow: `0px 0px 10px ${theme.colors.yellow}`,
                        "& .MuiInputBase-root": {
                          display: "block",
                        },
                        "& .MuiIconButton-root": {
                          backgroundColor: theme.colors.yellow,
                          color: theme.colors.text,
                        },
                      },
                    }}
                  >
                    <InputBase
                      inputRef={inputRef}
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 0,
                        width: "100%",
                        height: "42.5px",
                        lineHeight: "30px",
                        outline: 0,
                        border: 0,
                        display: focused ? "block" : "none",
                        fontSize: theme.fonts.size.default,
                        borderRadius: "20px",
                        padding: `0 ${theme.spacing.sm}`,
                        transition: "all 0.3s ease-in-out",
                        color: theme.colors.text,
                        backgroundColor: theme.colors.white,
                        flexGrow: 1,
                      }}
                      placeholder="Поиск товара"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => setFocused(true)}
                    />
                    <IconButton
                      onClick={() => {
                        setFocused(true)
                        inputRef.current?.focus();
                      }}
                      sx={{
                        boxSizing: "border-box",
                        width: "42.5px",
                        height: "42.5px",
                        position: "absolute",
                        top: 5,
                        right: 3,
                        borderRadius: "50%",
                        color: focused ? theme.colors.text : theme.colors.primary,
                        transition: "all 0.5s",
                        backgroundColor: focused ? theme.colors.yellow : "transparent",
                      }}
                    >
                      <SearchIcon />
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
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {(user && can(["client"])) || !user ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: "10px" }}>
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
                        }}
                      >
                        <Tooltip
                          sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(10px)',
                          }}
                          title='Информация о доставке'>
                        <LocalShippingIcon
                          sx={{
                            color: "#fff",
                            fontSize: { xs: "20px", sm: "24px", md: '30px' },
                            "@media (max-width: 500px)": {
                              fontSize: "20px",
                            },
                          }}
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
                          <Tooltip
                            sx={{
                              backgroundColor: 'rgba(0, 0, 0, 0.3)',
                              backdropFilter: 'blur(10px)',
                            }}
                            title='Корзина'>
                          <AddShoppingCartIcon
                            sx={{
                              color: "#fff",
                              fontSize: { xs: "20px", sm: "24px", md: '30px' },
                              '&:hover': {
                                color: theme.colors.yellow,
                              },
                            }}
                          />
                          </Tooltip>
                        </Badge>
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
                              backgroundColor: 'rgba(0, 0, 0, 0.3)',
                              backdropFilter: 'blur(10px)',
                            }}
                            title='Избранное'>
                          <FavoriteBorderIcon
                            sx={{
                              color: "#fff",
                              fontSize: { xs: "20px", sm: "24px", md: '30px' },
                              "@media (max-width: 500px)": {
                                fontSize: "20px",
                              },
                              '&:hover': {
                                color: theme.colors.yellow,
                              },
                            }}
                          />
                          </Tooltip>
                        </Badge>
                      </Box>
                      {/*Favorites*/}

                      {/*Bonus*/}
                      <Tooltip
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
                              color: "#fff",
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
                              padding: "10px",
                              borderRadius: "10px",
                              display: { xs: "none", md: "flex" },
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              transition: "background 0.3s ease",
                              color: "#333",
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
                            <CurrencyExchangeIcon
                              sx={{
                                color: "#fff",
                                marginRight: user?.bonus ? "10px" : 0,
                                '&:hover': {
                                  color: theme.colors.yellow,
                                },
                              }}
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
                        backgroundColor: "#fff",
                        boxShadow: "0px -2px 5px #8EA58C",
                        padding: "20px 0",
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
                            color: "black",
                            fontSize: "14px",
                            textTransform: "uppercase",
                            marginTop: "7px",
                          }}
                        >
                          Заказы
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
                              color: "black",
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
                            color: "black",
                            fontSize: "14px",
                            textTransform: "uppercase",
                            marginTop: "7px",
                            textAlign: "center",
                          }}
                        >
                          Избранные
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
                          backgroundColor: "#FDE910",
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
                            backgroundColor: "#FDE910",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            paddingRight: "20px",
                            paddingLeft: "20px",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "background 0.3s ease",
                            "@media (max-width: 800px)": {
                              borderRadius: "50%",
                              paddingTop: "10px",
                              paddingBottom: "10px",
                              paddingRight: "10px",
                              paddingLeft: "10px",
                            },
                          }}
                        >
                          <SettingsIcon sx={{ color: "rgb(52, 51, 50)" }} />
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
                    backgroundColor: "#fff",
                    boxShadow: "0px -2px 5px #8EA58C",
                    padding: "20px 0",
                    display: "none",
                    justifyContent: "space-around",
                    alignItems: "center",
                    zIndex: 1000,
                    "@media (max-width: 900px)": {
                      display: "flex",
                    },
                  }}
                >
                  <NavLink
                    to="/private/client_orders"
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
                        color: "black",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        marginTop: "7px",
                      }}
                    >
                      Заказы
                    </Typography>
                  </NavLink>

                  <NavLink
                    to="/private/clients"
                    style={{ textDecoration: "none" }}
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
                        color: "black",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        marginTop: "7px",
                        textAlign: "center",
                      }}
                    >
                      Клиенты
                    </Typography>
                  </NavLink>
                  {user ? <ExistsUser /> : <UnknownUser />}
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
                        color: "#8EA58C",
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
                          backgroundColor: "white",
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
                                  borderBottom: "1px solid #ddd",
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
