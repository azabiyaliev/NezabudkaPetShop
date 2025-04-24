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
          "@media (min-width: 900px)": {
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
            color: "black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 0,
            gap: "4px",
            "@media (min-width: 900px)": {
              flexDirection: "row",
              gap: "8px",
            },
          }}
        >
          <AccountCircleIcon
            sx={{
              color: "#343332",
              width: "30px",
              height: "30px",
              "@media (max-width: 1100px)": { color: "#343332" },
            }}
          />
          <Typography
            sx={{
              color: "#343332",
              fontSize: "16px",
              fontWeight: "500",
              textTransform: "uppercase",
              "@media (max-width: 1100px)": {
                color: "black",
                fontSize: "14px",
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
