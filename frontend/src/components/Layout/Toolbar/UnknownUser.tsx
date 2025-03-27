import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";

const UnknownUser = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          onClick={onClick}
          sx={{
            display: "flex",
            flexDirection: "column",
            color: "black",
          }}
        >
          <AccountCircleIcon
            sx={{
              color: "white",
              width: "35px",
              height: "35px",
            }}
          />
          <Typography
            sx={{
              fontSize: "18px",
              textTransform: "lowercase",
              color: "white",
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
      </Menu>
    </>
  );
};

export default UnknownUser;
