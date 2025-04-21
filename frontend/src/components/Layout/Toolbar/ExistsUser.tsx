import { useState } from 'react';
import { Box, Button, Divider, Drawer, List, ListItem, ListItemText, Typography, } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { selectUser } from "../../../store/users/usersSlice.ts";
import { usePermission} from '../../../app/hooks.ts';
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
import { logout } from '../../../store/users/usersThunk.ts';

const ExistsUser = () => {
  const addError = useAppSelector(addErrorFromSlice);
  const dispatch = useAppDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const user = useAppSelector(selectUser);
  const can = usePermission(user);
  const navigate = useNavigate();

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  const userLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleBrand = (open: boolean) => {
    setIsDrawerOpen(open);
    if (addError !== null) {
      dispatch(clearError());
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          "@media (min-width: 1100px)": {
            flexDirection: "row",
          },
        }}
      >
        <Button
          onClick={toggleDrawer(true)}
          sx={{
            color: "black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 0,
            gap: "4px",
            "@media (min-width: 1100px)": {
              flexDirection: "row",
              gap: "8px",
            },
          }}
        >
          <PermIdentityOutlinedIcon
            sx={{
              width: "30px",
              height: "30px",
              color: "white",
              "@media (max-width: 1100px)": { color: "black" },
            }}
          />
          {user && (
            <Typography
              sx={{
                color: "white",
                fontSize: "16px",
                fontWeight: "500",
                textTransform: "uppercase",
                "@media (max-width: 1100px)": {
                  color: "black",
                  fontSize: "14px",
                  marginTop: "-10px",
                  marginLeft: 0,
                },
              }}
            >
              {user.role === "superAdmin" ? (
                <span style={{ color: "white" }}>Super Admin</span>
              ) : user.role === "admin" ? (
                <>
                  <span style={{ color: "#ffcc00" }}>Admin:</span> {user.firstName}
                </>
              ) : (
                user.firstName
              )}
            </Typography>
          )}
        </Button>
      </Box>

      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 350,
            padding: 2,
            backgroundColor: "white",
            "@media (max-width: 700px)": {
              width: 250,
            },
            "@media (max-width: 400px)": {
              width: 230,
            },
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

          {user && can(["admin", "superAdmin"]) && (
            <List>
              <ListItem
                component={NavLink}
                to={`/private_account`}
                onClick={toggleDrawer(false)}
              >
                <HomeOutlinedIcon style={{ color: "#45624E" }} />
                <ListItemText primary="Личный кабинет" className="text-black" />
              </ListItem>
              {can(["superAdmin"]) && (
                <>
                  <ListItem component={NavLink} to={`/admin-table`} onClick={toggleDrawer(false)}>
                    <ListItemText primary="Администраторы" className="text-black" />
                  </ListItem>
                  <ListItem component={NavLink} to={`/admin-create`} onClick={toggleDrawer(false)}>
                    <ListItemText primary="Создать администратора" className="text-black"/>
                  </ListItem>
                </>
              )}
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
                  primary="Редактирование инофрмации о магаизине 'Незабудка'"
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

          {user && can(["client"]) && (
            <List>
              <ListItem
                component={NavLink}
                to={`/my_account/users/account/${user?.id}`}
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