import { Badge, Box, Button, Container, InputBase, Toolbar, } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, usePermission, } from '../../../app/hooks.ts';
import ExistsUser from './ExistsUser.tsx';
import UnknownUser from './UnknownUser.tsx';
import logo from '../../../assets/logo-nezabudka.png';
import backImage from '../../../assets/фон.png';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Typography from '@mui/material/Typography';
import './Fonts.css';
import { selectEditSite } from '../../../store/editionSite/editionSiteSlice.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { useEffect, useState } from 'react';
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
import ReactHtmlParser from 'html-react-parser';
import IconButton from '@mui/joy/IconButton';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { fetchUserIdBonus } from '../../../store/users/usersThunk.ts';
import Tooltip from '@mui/joy/Tooltip';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { selectedFavorite } from '../../../store/favoriteProducts/favoriteProductsSlice.ts';
import { getLocalFavoriteProducts } from '../../../store/favoriteProducts/favoriteProductLocal.ts';

const MainToolbar = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [openCategoryMenu, setOpenCategoryMenu] = useState<boolean>(false);
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

  const favorite = getLocalFavoriteProducts().length;

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
              <div style={{ display: "flex", alignItems: "center" }}>
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

              {(user && can(["client"])) || !user ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
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

              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    position: "relative",
                    width: "100%",
                    maxWidth: 400,
                    "@media (max-width: 800px)": { display: "none" },
                  }}
                >
                  <Box
                    component="form"
                    sx={{
                      position: "relative",
                      width: "50px",
                      height: "50px",
                      paddingRight: "50px",
                      transition: "all 0.5s",
                      borderRadius: "25px",
                      backgroundColor: "white",
                      overflow: "hidden",
                      boxSizing: "border-box",
                      zIndex: 10,
                      "@media (max-width: 1430px)": {
                        display: "none",
                      },
                      "&:focus-within": {
                        width: "300px",
                        cursor: "pointer",
                        "& .MuiInputBase-root": {
                          display: "block",
                        },
                        "& .MuiIconButton-root": {
                          backgroundColor: "#FDE910",
                          color: "#333",
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
                        display: "none",
                        fontSize: "1em",
                        borderRadius: "20px",
                        padding: "0 20px",
                        transition: "all 0.3s ease-in-out",
                        color: "#333",
                        backgroundColor: "white",
                        flexGrow: 1,
                      }}
                      placeholder="Поиск товара"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <IconButton
                      sx={{
                        boxSizing: "border-box",
                        width: "42.5px",
                        height: "42.5px",
                        position: "absolute",
                        top: 5,
                        right: 3,
                        borderRadius: "50%",
                        color: "#054500",
                        transition: "all 0.5s",
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
                        backgroundColor: "white",
                        boxShadow: 3,
                        zIndex: 1000,
                        marginTop: 1,
                        borderRadius: 1,
                      }}
                    >
                      {products.length > 0 ? (
                        products.map((product) => (
                          <NavLink
                            className="text-decoration-none text-black"
                            to={
                              user &&
                              (user.role === userRoleAdmin ||
                                user.role === userRoleSuperAdmin)
                                ? `/private/edit_product/${product.id}`
                                : `/product/${product.id}`
                            }
                            onClick={() => setSearch("")}
                          >
                            <div
                              key={product.id}
                              style={{
                                padding: "10px",
                                borderBottom: "1px solid #ddd",
                              }}
                            >
                              <h3>{product.productName}</h3>
                              <p>
                                {ReactHtmlParser(product.productDescription)}
                              </p>
                            </div>
                          </NavLink>
                        ))
                      ) : (
                        <div style={{ padding: "10px" }}>
                          Товаров не найдено
                        </div>
                      )}
                    </Box>
                  )}
                </Box>
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

                      <Box
                        component={NavLink}
                        to="/favorite-products"
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
                        <FavoriteIcon
                          sx={{
                            color: "rgb(52, 51, 50)",
                            "@media (max-width: 500px)": {
                              fontSize: "20px",
                            },
                          }}
                        />
                        <Badge
                          badgeContent={user && user.role === userRoleClient ?
                            favoriteProducts.length : favorite}
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
                          badgeContent={user && user.role === userRoleClient ?
                            favoriteProducts.length : favorite}
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
                  "@media (max-width: 1430px)": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    margin: "10px 40px",
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
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#d4d9c5";
                      e.target.style.boxShadow =
                        "0 0 8px rgba(91, 113, 51, 0.5)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#475726";
                      e.target.style.boxShadow =
                        "0 4px 10px rgba(91, 113, 51, 0.3)";
                    }}
                  />
                  <button
                    style={{
                      position: "absolute",
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
                      backgroundColor: "white",
                      boxShadow: 3,
                      zIndex: 1000,
                      marginTop: 1,
                      borderRadius: 1,
                      "@media (max-width: 1430px)": {
                        top: "32%",
                        left: 12,
                        width: "98%",
                      },
                    }}
                  >
                    {products.length > 0 ? (
                      products.map((product) => (
                        <NavLink
                          className="text-decoration-none text-black"
                          to={`/product/${product.id}`}
                          onClick={() => setSearch("")}
                        >
                          <div
                            key={product.id}
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            <h3>{product.productName}</h3>
                            <p>{product.productDescription}</p>
                          </div>
                        </NavLink>
                      ))
                    ) : (
                      <div style={{ padding: "10px" }}>Товаров не найдено</div>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default MainToolbar;
