import {
  Badge,
  Box,
  Button,
  Container,
  InputBase,
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
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { selectUser } from "../../../store/users/usersSlice.ts";
import React, { useEffect, useState } from "react";
import CustomCart from "../../Domain/CustomCart/CustomCart.tsx";
import { cartsFromSlice } from "../../../store/cart/cartSlice.ts";
import { getCart } from "../../../store/cart/cartThunk.ts";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

const MainToolbar = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const user = useAppSelector(selectUser);
  const site = useAppSelector(selectEditSite);
  const cart = useAppSelector(cartsFromSlice);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    dispatch(getCart()).unwrap();
  }, [dispatch]);

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
                to="https://go.2gis.com/vbcPZ"
              >
                {site?.address}
              </NavLink>
              <Button
                onClick={onClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "black",
                  gap: "5px",
                  textTransform: "none",
                }}
              >
                <Typography>Покупателям</Typography>
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
                style={{ borderRight: "1px solid black", paddingRight: "10px" }}
              >
                {site && site.phone}
              </Typography>
              <Typography>({site && site.schedule})</Typography>
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
              }}
            >
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
                    }}
                  >
                    Незабудка
                  </Typography>
                </div>
              </NavLink>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "400px",
                    border: "1px solid lightgray",
                    backgroundColor: "white",
                    borderTopLeftRadius: "100px",
                    borderTopRightRadius: "100px",
                    borderBottomLeftRadius: "100px",
                    borderBottomRightRadius: "100px",
                    overflow: "hidden",
                  }}
                >
                  <InputBase
                    placeholder="Поиск товаров"
                    sx={{
                      flex: 1,
                      padding: "10px",
                    }}
                  />
                  <Button
                    sx={{
                      minWidth: "50px",
                      color: "#45624E",
                      borderLeft: "1px solid lightgray",
                      borderRadius: 0,
                      height: "100%",
                    }}
                  >
                    <SearchOutlinedIcon />
                  </Button>
                </Box>
              </Box>
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
                        }}
                      >
                        <ShoppingCartIcon sx={{ color: "rgb(52, 51, 50)" }} />
                        <Badge
                          badgeContent={sum}
                          color="success"
                          overlap="circular"
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
                          }}
                        >
                          <FavoriteIcon sx={{ color: "rgb(52, 51, 50)" }} />
                        </Box>
                      </NavLink>
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
                      <ShoppingCartIcon sx={{ color: "rgb(52, 51, 50)" }} />
                      <Badge
                        badgeContent={sum}
                        color="success"
                        overlap="circular"
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
                        }}
                      >
                        <FavoriteIcon sx={{ color: "rgb(52, 51, 50)" }} />
                      </Box>
                    </NavLink>
                  </Box>
                </Box>
              )}
              {user ? <ExistsUser /> : <UnknownUser />}
            </Toolbar>
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default MainToolbar;
