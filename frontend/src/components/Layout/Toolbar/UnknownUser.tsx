import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem, useMediaQuery,
} from '@mui/material';
import { User } from "phosphor-react";
import theme from '../../../globalStyles/globalTheme.ts';

const UnknownUser = () => {
  const guestEmail = localStorage.getItem('guestEmail');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery("(max-width:900px)");


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
            color: theme.colors.black,
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
          <User
            size={28}
            weight="regular"
            color={isMobile ? theme.colors.black : theme.colors.white}
          />
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
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: theme.colors.menu_bg_color,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: 'rgb(38, 57, 77) 0px 20px 30px -10px',
            borderRadius: '12px',
            padding: '8px 0',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <MenuItem sx={{color: theme.colors.white}} component={NavLink} to="/login" onClick={handleClose}>
          Войти
        </MenuItem>
        <MenuItem sx={{color:  theme.colors.white}} component={NavLink} to="/register" onClick={handleClose}>
          Зарегистрироваться
        </MenuItem>

        <MenuItem>
          <NavLink to={`/my_orders?email=${guestEmail}`} className="text-decoration-none text-white">
            Мои заказы
          </NavLink>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UnknownUser;
