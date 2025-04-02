import {
  Badge,
  Box,
  Button,
  Container,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import ExistsUser from "./ExistsUser.tsx";
import UnknownUser from "./UnknownUser.tsx";
import logo_transparent from "../../../assets/logo_transparent.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Typography from "@mui/material/Typography";
import "./Fonts.css";
import { selectEditSite } from "../../../store/editionSite/editionSiteSlice.ts";
import { selectUser } from "../../../store/users/usersSlice.ts";
import React, { useEffect, useState } from "react";
import CustomCart from "../../Domain/CustomCart/CustomCart.tsx";
import {
  cartsFromSlice,
  getFromLocalStorage,
} from "../../../store/cart/cartSlice.ts";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { fetchSite } from '../../../store/editionSite/editionSiteThunk.ts';
import { selectProducts } from '../../../store/products/productsSlice.ts';
import { getProducts } from '../../../store/products/productsThunk.ts';
import SearchIcon from '@mui/icons-material/Search';
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';

const MainToolbar = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const user = useAppSelector(selectUser);
  const site = useAppSelector(selectEditSite);
  const cart = useAppSelector(cartsFromSlice);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const products = useAppSelector(selectProducts);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    dispatch(fetchSite()).unwrap()
  }, [dispatch]);


  useEffect(() => {
    if (search) {
      dispatch(getProducts(debouncedSearch));
    } else {
      dispatch(getProducts(''));
    }

    dispatch(getFromLocalStorage());
  }, [dispatch, debouncedSearch, search, user]);

  const closeCart = () => {
    setOpenCart(false);
    navigate("/");
  };

  const checkProductInCart: number[] = cart.map((product) => {
    return product.quantity;
  });

  const sum: number = checkProductInCart.reduce((acc: number, i: number) => {
    acc = acc + i;
    return acc;
  }, 0);
  return (
    <div>
      <CustomCart openCart={openCart} closeCart={closeCart} />
      <Box
        sx={{
          textAlign: "left",
        }}
      >
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
              <NavLink
                style={{
                  color: "black",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  borderRight: "1px solid black",
                  paddingRight: "10px",
                }}
                to={site?.linkAddress || "/"}
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
              </NavLink>
              <Button
                onClick={onClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "black",
                  gap: "5px",
                  textTransform: "none",
                  "@media (max-width: 460px)": { display:"none" }
                }}
              >
                <Typography sx={{ color: "black", fontSize: 16,  "@media (max-width: 800px)": { fontSize: 13 } }}> Покупателям</Typography>
                <KeyboardArrowDownOutlinedIcon />
              </Button>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={onClose}
              >
                <MenuItem>
                  <NavLink
                    to="/company"
                    className="text-decoration-none text-black"
                  >
                    О компании
                  </NavLink>
                </MenuItem>

                <MenuItem>
                  <NavLink
                    to="/delivery"
                    className="text-decoration-none text-black"
                  >
                    Доставка и опалата
                  </NavLink>
                </MenuItem>

                <MenuItem>
                  <NavLink
                    to="/bonus"
                    className="text-decoration-none text-black"
                  >
                    Бонусная программа
                  </NavLink>
                </MenuItem>

                <MenuItem>
                  <NavLink
                    to="/contacts"
                    className="text-decoration-none text-black"
                  >
                    Контакты
                  </NavLink>
                </MenuItem>
              </Menu>
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
                  "@media (max-width: 560px)": {borderRight:"none", paddingRight: "0px", },
                }}
              >
                {site && site.phone}
              </Typography>

              <Typography
                sx={{
                  "@media (max-width: 800px)": { fontSize: 13 },
                  "@media (max-width: 560px)": {display:"none" },
                }}
              >
                ({site && site.schedule})
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
      <div style={{ backgroundColor: "#8EA58C" }}>
        <Container style={{ padding: "0px" }}>
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
                "@media (max-width: 1100px)": {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
                "@media (max-width: 800px)": {
                  paddingTop: "5px",
                  paddingBottom: "5px",
                },
              }}
            >
              <div style={{display: "flex",alignItems: "center"}}>
                <Box
                  onClick={() => setOpenCart(true)}
                  sx={{
                    display:"none",
                    "@media (max-width: 800px)": {
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
                    }
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
                    src={logo_transparent}
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
                        fontSize: "28px",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        fontFamily: "COMIC SANS MS, Roboto, Arial, sans-serif",
                        color: "white",
                        cursor: "pointer",
                        "@media (max-width: 800px)": {
                          fontSize: "26px",
                        },
                      }}
                    >
                      Незабудка
                    </Typography>
                  </div>
                </NavLink>
              </div>
              <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, "@media (max-width: 800px)": { display: "none" } }}>
                <Box sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: "400px",
                }}>
                  <input
                    style={{
                      width: "100%",
                      padding: "12px 40px 12px 16px",
                      fontSize: "16px",
                      color: "#333",
                      backgroundColor: "white",
                      border: "2px solid rgb(195, 190, 182)",
                      borderRadius: "30px",
                      outline: "none",
                      transition: "all 0.3s ease-in-out",
                      boxShadow: "0 4px 10px rgba(91, 113, 51, 0.3)"
                    }}
                    placeholder="Поиск товара"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#d4d9c5";
                      e.target.style.boxShadow = "0 0 8px rgba(91, 113, 51, 0.5)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#475726";
                      e.target.style.boxShadow = "0 4px 10px rgba(91, 113, 51, 0.3)";
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
                      justifyContent: "center"
                    }}
                  >
                    <SearchIcon />
                  </button>
                </Box>

                {search && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '100%',
                      maxHeight: 300,
                      overflowY: 'auto',
                      backgroundColor: 'white',
                      boxShadow: 3,
                      zIndex: 1000,
                      marginTop: 1,
                      borderRadius: 1,
                    }}
                  >
                    {products.length > 0 ? (
                      products.map((product) => (
                        <NavLink className='text-decoration-none text-black' to={`/product/${product.id}`} onClick={() => setSearch('')}>
                          <div key={product.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            <h3>{product.productName}</h3>
                            <p>{product.productDescription}</p>
                          </div>
                        </NavLink>
                      ))
                    ) : (
                      <div style={{ padding: '10px' }}>Товаров не найдено</div>
                    )}
                  </Box>
                )}
              </Box>
              {user && user.role ==="admin" && (
                <Box
                  sx={{
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
                    "@media (max-width: 400px)": {
                      display:"none"
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
              {user ? (
                user.role === "client" && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: "15px" }}>
                      <Box
                        onClick={() => setOpenCart(true)}
                        sx={{
                          backgroundColor: "#FDE910",
                          paddingTop: "7px",
                          paddingBottom: "7px",
                          paddingRight: "20px",
                          paddingLeft: "20px",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "background 0.3s ease",
                          position: "relative",
                          "@media (max-width: 800px)": {
                            borderRadius: "50%",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            paddingRight: "10px",
                            paddingLeft: "10px",
                          },
                          "@media (max-width: 400px)": {
                            borderRadius: "50%",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            paddingRight: "5px",
                            paddingLeft: "5px",
                          },
                        }}
                      >
                        <ShoppingCartIcon sx={{ color: "rgb(52, 51, 50)" }} />
                        <Badge
                          badgeContent={sum}
                          overlap="circular"
                          color="warning"
                          sx={{
                            position: "absolute",
                            top: "10px",
                            right: "17px",
                            backgroundColor: "olive",
                          }}
                        />
                      </Box>

                      <NavLink
                        to="/my_favorites"
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
                            "@media (max-width: 1100px)": { display: "none" }
                          }}
                        >
                          <FavoriteIcon sx={{ color: "rgb(52, 51, 50)" }} />
                        </Box>
                      </NavLink>
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
                        display: "none",
                        justifyContent: "space-around",
                        alignItems: "center",
                        zIndex: 1000,
                        "@media (max-width: 1100px)": {
                          display: "flex",
                        },
                      }}
                    >
                      <NavLink to="/my_orders" style={{ textDecoration: "none", marginTop:"5px" }}>
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

                      <NavLink to="/my_favorites" style={{ textDecoration: "none" }}>
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
                              marginLeft:"20px",
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
                )
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", gap: "15px" }}>
                    <Box
                      onClick={() => setOpenCart(true)}
                      sx={{
                        backgroundColor: "#FDE910",
                        paddingTop: "7px",
                        paddingBottom: "7px",
                        paddingRight: "20px",
                        paddingLeft: "20px",
                        borderRadius: "10px",
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
                      >
                        <ShoppingCartIcon
                          sx={{
                            color: "rgb(52, 51, 50)",
                            marginRight: "10px",
                            marginTop: "3px",
                          }}
                        />
                      </Badge>
                    </Box>

                    <NavLink
                      to="/my_favorites"
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
                        }}
                      >
                        <FavoriteIcon sx={{ color: "rgb(52, 51, 50)" }} />
                      </Box>
                    </NavLink>
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
                      display: "none",
                      justifyContent: "space-around",
                      alignItems: "center",
                      zIndex: 1000,
                      "@media (max-width: 1100px)": {
                        display: "flex",
                      },
                    }}
                  >
                    <NavLink to="/my_orders" style={{ textDecoration: "none", marginTop:"5px" }}>
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

                    <NavLink to="/my_favorites" style={{ textDecoration: "none" }}>
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
                            width: "30px",
                            height: "27px",
                            color: "black",
                            marginLeft:"20px",
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

              )}

              {user && user.role === "admin" && (
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
                    "@media (max-width: 1100px)": {
                      display: "flex",
                    },
                  }}
                >
                  <NavLink to="/private/client_orders" style={{ textDecoration: "none", marginTop:"5px" }}>
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

                  <NavLink to="/private/clients" style={{ textDecoration: "none" }}>
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
                            marginTop:"5px"

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
              <Box sx={{  "@media (max-width: 1100px)": { display: "none" }}}>
                {user ? <ExistsUser /> : <UnknownUser />}
              </Box>
            </Toolbar>
            <Box
              sx={{
                "@media (max-width: 800px)": {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 3 }
              }}
            >
              <Box sx={{
                display:"none",
                "@media (max-width: 800px)": {
                  display:"flex",
                  position: 'relative',
                  width: '100%',
                  maxWidth: 400,
                  marginTop:"-10px",
                  marginBottom:"-10px"
                },
                "@media (max-width: 600px)": {
                  display:"flex",
                  position: 'relative',
                  width: '100%',
                  maxWidth: 400,
                  marginTop:"0px",
                  marginBottom:"-10px"
                },
                "@media (max-width: 400px)": {
                  display:"flex",
                  position: 'relative',
                  width: '100%',
                  maxWidth: 350,
                  marginTop:"0px",
                  marginBottom:"-10px"
                }
              }}>
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "400px",
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
                      e.target.style.boxShadow = "0 0 8px rgba(91, 113, 51, 0.5)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#475726";
                      e.target.style.boxShadow = "0 4px 10px rgba(91, 113, 51, 0.3)";
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
                      justifyContent: "center"
                    }}
                  >
                    <SearchIcon />
                  </button>
                </Box>

                {search && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '100%',
                      maxHeight: 300,
                      overflowY: 'auto',
                      backgroundColor: 'white',
                      boxShadow: 3,
                      zIndex: 1000,
                      marginTop: 1,
                      borderRadius: 1,
                    }}
                  >
                    {products.length > 0 ? (
                      products.map((product) => (
                        <NavLink className='text-decoration-none text-black' to={`/product/${product.id}`} onClick={() => setSearch('')}>
                          <div key={product.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            <h3>{product.productName}</h3>
                            <p>{product.productDescription}</p>
                          </div>
                        </NavLink>
                      ))
                    ) : (
                      <div style={{ padding: '10px' }}>Товаров не найдено</div>
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
