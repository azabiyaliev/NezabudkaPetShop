import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const UnknownUser = () => {
  const guestEmail = localStorage.getItem('guestEmail');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          "@media (min-width: 1100px)": {
            flexDirection: "row",
          },
        }}
      >
        <Button
          id="account-button"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{
            display: "flex",
            flexDirection: "column",
            color: "black",
            "@media (min-width: 1100px)": {
              flexDirection: "row",
              gap: "8px",
            },
          }}
        >
          <AccountCircleIcon
            sx={{
              color: "white",
              width: "35px",
              height: "35px",
              "@media (max-width: 1100px)": { color: "black" },
            }}
          />
          <Typography
            sx={{
              fontSize: "18px",
              textTransform: "lowercase",
              color: "white",
              "@media (max-width: 1100px)": {
                color: "black",
                marginLeft: 0,
              },
            }}
          >
            Войти
          </Typography>
        </Button>
      </Box>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem component={NavLink} to="/login" onClick={handleClose}>
          Войти
        </MenuItem>
        <MenuItem component={NavLink} to="/register" onClick={handleClose}>
          Зарегистрироваться
        </MenuItem>

        <MenuItem>
          <NavLink to={`/my_orders?email=${guestEmail}`} className="text-decoration-none text-black">
            Мои заказы
          </NavLink>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UnknownUser;
