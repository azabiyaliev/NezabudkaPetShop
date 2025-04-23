import { useState } from 'react';
import { Box, Button, Divider, Drawer, List, ListItem, ListItemText, Typography, } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, usePermission } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { addErrorFromSlice, clearError, } from '../../../store/brands/brandsSlice.ts';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import { logout } from '../../../store/users/usersThunk.ts';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

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
              color: "#343332",
              "@media (max-width: 1100px)": { color: "#343332" },
            }}
          />
          {user && (
            <Typography
              sx={{
                color: "#343332",
                fontSize: "16px",
                fontWeight: "500",
                textTransform: "uppercase",
                "@media (max-width: 1100px)": {
                  color: "black",
                  fontSize: "14px",
                  marginTop: "7px",
                  marginLeft: 0,
                },
              }}
            >
              {user.role === "superAdmin" ? (
                <span style={{ color: "#343332" }}>Super Admin</span>
              ) : user.role === "admin" ? (
                <>
                  <span style={{ color: "#a82626" }}>Admin:</span> {user.firstName}
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
                <HomeOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
                <ListItemText primary="Личный кабинет" className="text-black" />
              </ListItem>
              {can(["superAdmin"]) && (
                <>
                  <ListItem component={NavLink} to={`/admin-table`} onClick={toggleDrawer(false)}>
                    <AdminPanelSettingsOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
                    <ListItemText primary="Администраторы" className="text-black" />
                  </ListItem>
                  <ListItem component={NavLink} to={'/private/order_stats'} onClick={toggleDrawer(false)}>
                    <AutoGraphOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
                    <ListItemText primary="Статистика заказов" className="text-black"/>
                  </ListItem>
                </>
              )}
              <ListItem
                component={NavLink}
                to="/private/client_orders"
                onClick={toggleDrawer(false)}
              >
                <CreditScoreOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
                <ListItemText primary="Заказы" className="text-black" />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/private/clients"
                onClick={toggleDrawer(false)}
              >
                <GroupOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
                <ListItemText primary="Клиенты" className="text-black" />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/private/brands"
                onClick={() => toggleBrand(false)}
              >
                <BallotOutlinedIcon style={{ color: "#45624E",  marginRight: "10px" }}/>
                <ListItemText primary="Бренды" className="text-black" />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/private/products"
                onClick={toggleDrawer(false)}
              >
                <ListAltOutlinedIcon style={{ color: "#45624E",  marginRight: "10px" }}/>
                <ListItemText primary="Товары" className="text-black" />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/private/manage_categories"
                onClick={toggleDrawer(false)}
              >
                <CategoryOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }}/>
                <ListItemText primary="Категории" className="text-black" />
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
                <HomeOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
                <ListItemText primary="Личный кабинет" className="text-black" />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/my_orders"
                onClick={toggleDrawer(false)}
              >
                <LocalMallOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
                <ListItemText primary="Мои Заказы" className="text-black" />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/my_cart"
                onClick={toggleDrawer(false)}
              >
                <ShoppingCartOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
                <ListItemText primary="Корзина" className="text-black" />
              </ListItem>
              <ListItem
                component={NavLink}
                to="favorite-products"
                onClick={toggleDrawer(false)}
              >
                <FavoriteOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
                <ListItemText primary="Избранные" className="text-black" />
              </ListItem>
            </List>
          )}
          <Divider />
          <ListItem onClick={userLogout} style={{ marginTop: "30px" }}>
            <LogoutOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Выйти" className="text-black" />
          </ListItem>
        </Box>
      </Drawer>
    </>
  );
};

export default ExistsUser;