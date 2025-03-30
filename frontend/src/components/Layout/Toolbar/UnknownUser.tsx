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
              color: "black",
            }}
          />
          <Typography
            sx={{
              fontSize: "15px",
              textTransform: "lowercase",
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
