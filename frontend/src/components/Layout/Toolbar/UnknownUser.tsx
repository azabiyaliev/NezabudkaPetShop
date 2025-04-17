import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";

const UnknownUser = () => {
  const guestEmail = localStorage.getItem('guestEmail');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  // if(!user) return null;
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2,  "@media (min-width: 1100px)": {flexDirection: "row",}}}>
        <Button
          onClick={onClick}
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
                marginLeft:0
              },
            }}
          >
            Войти
          </Typography>
        </Button>
      </Box>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <MenuItem>
          <NavLink to="/login" className="text-decoration-none text-black">
            Войти
          </NavLink>
        </MenuItem>

        <MenuItem>
          <NavLink to="/register" className="text-decoration-none text-black">
            Зарегистрироваться
          </NavLink>
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
