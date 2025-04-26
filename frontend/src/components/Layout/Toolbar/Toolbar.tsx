import {
  Badge,
  Box,
  Button,
  Container,
  InputBase,
  Toolbar,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
  usePermission,
} from "../../../app/hooks.ts";
import ExistsUser from "./ExistsUser.tsx";
import UnknownUser from "./UnknownUser.tsx";
import logo from "../../../assets/logo-nezabudka.png";
import backImage from "../../../assets/фон.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Typography from "@mui/material/Typography";
import "./Fonts.css";
import { selectEditSite } from "../../../store/editionSite/editionSiteSlice.ts";
import { selectUser } from "../../../store/users/usersSlice.ts";
import { useEffect, useState } from "react";
import CustomCart from "../../Domain/CustomCart/CustomCart.tsx";
import { fetchSite } from "../../../store/editionSite/editionSiteThunk.ts";
import { selectProducts } from "../../../store/products/productsSlice.ts";
import { getProducts } from "../../../store/products/productsThunk.ts";
import SearchIcon from "@mui/icons-material/Search";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import CategoryNavMenu from "../../Domain/CategoryNavMenu.tsx";
import {
  cartFromSlice,
  getFromLocalStorage,
} from "../../../store/cart/cartSlice.ts";
import { userRoleAdmin, userRoleSuperAdmin } from "../../../globalConstants.ts";
import IconButton from "@mui/joy/IconButton";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { fetchUserIdBonus } from "../../../store/users/usersThunk.ts";
import Tooltip from "@mui/joy/Tooltip";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { ClickAwayListener } from "@mui/material";
import theme from "../../../globalStyles/globalTheme.ts";
import { motion } from "framer-motion";


const MainToolbar = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [openCategoryMenu, setOpenCategoryMenu] = useState<boolean>(false);
  const user = useAppSelector(selectUser);
  const site = useAppSelector(selectEditSite);
  const cart = useAppSelector(cartFromSlice);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const can = usePermission(user);
  const [focused, setFocused] = useState(false);


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
    dispatch(getFromLocalStorage());
    dispatch(fetchSite()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    if (search) {
      dispatch(getProducts(debouncedSearch));
    } else {
      dispatch(getProducts(""));
    }
  }, [dispatch, debouncedSearch, search]);

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

  const highlightText = (text: string, search: string) => {
    if (!search) return text;
    const reg = new RegExp(`(${search})`, 'gi');
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
          <Container>
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
              <motion.div
                layout
                style={{
                  display: "flex",
                  alignItems: "center",
                  maxWidth: (focused && window.innerWidth <= 1060) ? "0%" : "100%",
                  opacity: (focused && window.innerWidth <= 1060) ? 0 : 1,
                  visibility: (focused && window.innerWidth <= 1060) ? "hidden" : "visible",
                  transition: "opacity 0.3s ease, visibility 0.3s ease",
                }}
              >
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
              </motion.div>

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
                    to="/catalog"
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
              <ClickAwayListener onClickAway={() => { setFocused(false); setSearch(""); }}>
                <Box
                  sx={{
                    display: "flex",
                    marginLeft: "auto",
                    marginRight: "10px",
                    position: "relative",
                    width: "100%",
                    maxWidth: focused ? "800px" : "50px",

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
                      onClick={() => setFocused(true)}
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
                            onClick={() => { setSearch(""); setFocused(false); }}
                          >
                            <Box
                              sx={{
                                padding: theme.spacing.xs,
                                borderBottom: `1px solid ${theme.colors.background}`,
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
                        <Box sx={{ padding: theme.spacing.xs }}>
                          Товаров не найдено
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </ClickAwayListener>

              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {(user && can(["client"])) || !user ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: "15px" }}>
                      <Box
                        component={NavLink}
                        to="/delivery"
                        sx={{
                          display: "none",
                          "@media (max-width: 1100px)": {
                            borderRadius: "10px",
                            backgroundColor: "#FDE910",
                            padding: "10px 20px",
                            display: "inline",
                          },
                          "@media (max-width: 900px)": {
                            padding: { xs: "9px", sm: "10px", md: "7px 20px" },
                            borderRadius: { xs: "50%", md: "10px" },
                          },
                        }}
                      >
                        <LocalShippingIcon
                          sx={{
                            color: "#333",
                            "@media (max-width: 500px)": {
                              fontSize: "20px",
                            },
                          }}
                        />
                      </Box>
                      <Box
                        onClick={() => setOpenCart(true)}
                        sx={{
                          backgroundColor: "#FDE910",
                          padding: { xs: "10px", sm: "10px", md: "7px 20px" },
                          borderRadius: { xs: "50%", md: "10px" },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "background 0.3s ease",
                          position: "relative",
                        }}
                      >
                        <ShoppingCartIcon
                          sx={{
                            color: "rgb(52, 51, 50)",
                            "@media (max-width: 500px)": {
                              fontSize: "20px",
                            },
                          }}
                        />
                        <Badge
                          badgeContent={sum}
                          overlap="circular"
                          color="warning"
                          sx={{
                            position: user ? "absolute" : "static",
                            top: user ? "10px" : undefined,
                            right: user ? "17px" : undefined,
                            backgroundColor: user ? "olive" : undefined,
                          }}
                        />
                      </Box>

                      <NavLink
                        to="/favorite-products"
                        style={{ textDecoration: "none" }}
                      >
                        <Box
                          sx={{
                            backgroundColor: "#FDE910",
                            padding: "10px 20px",
                            borderRadius: "10px",
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "background 0.3s ease",
                          }}
                        >
                          <FavoriteIcon sx={{ color: "rgb(52, 51, 50)" }} />
                        </Box>
                      </NavLink>

                      <Tooltip title="Мои бонусы">
                        <NavLink
                          to={`/my_account/users/account/${user?.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <Box
                            sx={{
                              backgroundColor: "#FDE910",
                              padding: "10px 20px",
                              borderRadius: "10px",
                              display: { xs: "none", md: "flex" },
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              transition: "background 0.3s ease",
                              color: "#333",
                            }}
                          >
                            <CurrencyExchangeIcon
                              sx={{
                                color: "rgb(52, 51, 50)",
                                marginRight: user?.bonus ? "10px" : 0,
                              }}
                            />
                            {user?.bonus}
                          </Box>
                        </NavLink>
                      </Tooltip>
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
                            <FavoriteIcon
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
                        to="/edition_site"
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
                      backgroundColor: "#FDE910",
                      padding: "7px 20px",
                      borderRadius: "10px",
                      alignItems: "center",
                    }}
                  >
                    {user ? <ExistsUser /> : <UnknownUser />}
                  </Box>
                </Box>
              </Box>

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
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default MainToolbar;
