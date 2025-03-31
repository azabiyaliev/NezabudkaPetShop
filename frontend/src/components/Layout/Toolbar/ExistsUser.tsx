import { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { selectUser, unsetUser } from "../../../store/users/usersSlice.ts";
import {
  addErrorFromSlice,
  clearError,
} from "../../../store/brands/brandsSlice.ts";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";

const ExistsUser = () => {
  const addError = useAppSelector(addErrorFromSlice);
  const dispatch = useAppDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const user = useAppSelector(selectUser);

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  const userLogout = () => {
    dispatch(unsetUser());
  };

  const toggleBrand = (open: boolean) => {
    setIsDrawerOpen(open);
    if (addError !== null) {
      dispatch(clearError());
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          onClick={toggleDrawer(true)}
          sx={{
            color: "black",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <PermIdentityOutlinedIcon
            sx={{ width: "30px", height: "30px", color: "white" }}
          />
          <span style={{ color: "white", fontSize: "16px", fontWeight: "500" }}>
            Мой профиль
          </span>
        </Button>
      </Box>

      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 350,
            padding: 2,
            backgroundColor: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <PermIdentityOutlinedIcon
              sx={{ width: "30px", height: "30px", color: "#45624E" }}
            />
            <span
              style={{ color: "#45624E", fontSize: "18px", fontWeight: "600" }}
            >
              {user && user.firstName} {user && user.secondName}
            </span>
          </Box>
          <Divider />

          {user && user.role === "admin" && (
            <List>
              <ListItem
                component={NavLink}
                to={`/private_account`}
                onClick={toggleDrawer(false)}
              >
                <HomeOutlinedIcon style={{ color: "#45624E" }} />
                <ListItemText primary="Личный кабинет" className="text-black" />
              </ListItem>
              <ListItem
                component={NavLink}
                to={`/private/users/${user.id}`}
                onClick={toggleDrawer(false)}
              >
                <EditNoteOutlinedIcon style={{ color: "#45624E" }} />
                <ListItemText
                  primary="Редактировать профиль"
                  className="text-black"
                />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/private/client_orders"
                onClick={toggleDrawer(false)}
              >
                <CreditScoreOutlinedIcon style={{ color: "#45624E" }} />
                <ListItemText primary="Заказы" className="text-black" />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/private/clients"
                onClick={toggleDrawer(false)}
              >
                <GroupOutlinedIcon style={{ color: "#45624E" }} />
                <ListItemText primary="Клиенты" className="text-black" />
              </ListItem>
              <ListItem
                component={NavLink}
                to={`/edition_site`}
                onClick={toggleDrawer(false)}
              >
                <SettingsSuggestOutlinedIcon style={{ color: "#45624E" }} />
                <ListItemText
                  primary="Редактирование сайта"
                  className="text-black"
                />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/private/brands"
                onClick={() => toggleBrand(false)}
              >
                <ListItemText primary="Бренды" className="text-black" />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/private/all_products"
                onClick={toggleDrawer(false)}
              >
                <ListItemText primary="Товары" className="text-black" />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/private/all_categories"
                onClick={toggleDrawer(false)}
              >
                <ListItemText primary="Все категории" className="text-black" />
              </ListItem>
            </List>
          )}

          {user && user.role === "client" && (
            <List>
              <ListItem
                component={NavLink}
                to={`/my_account`}
                onClick={toggleDrawer(false)}
              >
                <HomeOutlinedIcon style={{ color: "#45624E" }} />
                <ListItemText primary="Личный кабинет" className="text-black" />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/my_orders"
                onClick={toggleDrawer(false)}
              >
                <LocalMallOutlinedIcon style={{ color: "#45624E" }} />
                <ListItemText primary="Мои Заказы" className="text-black" />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/my_cart"
                onClick={toggleDrawer(false)}
              >
                <ShoppingCartOutlinedIcon style={{ color: "#45624E" }} />
                <ListItemText primary="Корзина" className="text-black" />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/my_whishlist"
                onClick={toggleDrawer(false)}
              >
                <FavoriteOutlinedIcon style={{ color: "#45624E" }} />
                <ListItemText primary="Избранные" className="text-black" />
              </ListItem>
            </List>
          )}
          <Divider />
          <ListItem onClick={userLogout} style={{ marginTop: "30px" }}>
            <LogoutOutlinedIcon style={{ color: "#45624E" }} />
            <ListItemText primary="Выйти" className="text-black" />
          </ListItem>
        </Box>
      </Drawer>
    </>
  );
};

export default ExistsUser;
