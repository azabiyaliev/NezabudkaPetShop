import { useState } from 'react';
import {
  Badge,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, usePermission } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { addErrorFromSlice, clearError, } from '../../../store/brands/brandsSlice.ts';
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
import { clearCart } from "../../../store/cart/cartSlice.ts";
import theme from '../../../globalStyles/globalTheme.ts';
import { CheckCircle, User } from 'phosphor-react';

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

  const userLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(clearCart());
      navigate("/", { replace: true });
    } catch (e) {
      console.error("Ошибка при выходе:", e);
    }
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
          "@media (max-width: 900px)": {
            flexDirection: "column",
          },
        }}
      >
        <Box
          onClick={toggleDrawer(true)}
          sx={{
            color: theme.colors.black,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 0,
            cursor: "pointer",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
            },
            "&:focus": {
              backgroundColor: "transparent",
            },
            "&:active": {
              backgroundColor: "transparent",
            },
            "@media (min-width: 900px)": {
              flexDirection: "column",
            },
          }}
        >
          <Box
            sx={{
              display: "none",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              "@media (max-width: 900px)": {
                display: "flex",
              },
            }}
          >
            <Badge
              invisible={!user}
              overlap="circular"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              badgeContent={
                <CheckCircle size={12} weight="fill" color={theme.colors.primary} />
              }
            >
              <User size={30} weight="regular" color={theme.colors.black} />
            </Badge>
          </Box>

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
                alignItems: "center",
                gap: "8px",
                flexDirection: "column",
              },
            }}
          >
            <Tooltip
              title={
                user?.role === "superAdmin"
                  ? "Super Admin"
                  : user?.role === "admin"
                    ? `Admin: ${user.firstName}`
                    : user?.firstName
              }
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: theme.colors.tooltip_color,
                    backdropFilter: 'blur(10px)',
                    fontSize: theme.fonts.size.xs,
                    padding: "6px 10px",
                  },
                },
              }}
            >
              <User
                size={28}
                weight="regular"
                color={theme.colors.white}
              />
            </Tooltip>
          </Box>
        </Box>
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
            <User
              size={28}
              weight="regular"
              color={theme.colors.ICON_GREEN}
            />
            <span
              style={{ color: theme.colors.ICON_GREEN, fontSize: theme.fonts.size.big_default, fontWeight: theme.fonts.weight.medium }}
            >
              {user && user.firstName} {user && user.secondName}
            </span>
          </Box>
          <Divider />

          {user && can(["admin", "superAdmin"]) && (
            <List>
              {can(["admin"]) && (
                <>
                  <ListItem
                    component={NavLink}
                    to={`/private_account`}
                    onClick={toggleDrawer(false)}
                  >
                    <HomeOutlinedIcon
                      style={{ color: theme.colors.ICON_GREEN, marginRight: theme.spacing.xs }}
                    />
                    <ListItemText
                      primary="Личный кабинет"
                     sx={{
                       color: theme.colors.text
                     }}
                    />
                  </ListItem>
                </>
              )}
              {can(["superAdmin"]) && (
                <>
                  <ListItem
                    component={NavLink}
                    to={`/private/order_stats`}
                    onClick={toggleDrawer(false)}
                  >
                    <HomeOutlinedIcon
                      style={{ color: theme.colors.ICON_GREEN, marginRight: theme.spacing.xs }}
                    />
                    <ListItemText
                      primary="Личный кабинет"
                      sx={{
                        color: theme.colors.text
                      }}
                    />
                  </ListItem>
                </>
              )}

              {can(["superAdmin"]) && (
                <>
                  <ListItem
                    component={NavLink}
                    to={`/private/admin-table`}
                    onClick={toggleDrawer(false)}
                  >
                    <AdminPanelSettingsOutlinedIcon
                      style={{ color: theme.colors.ICON_GREEN, marginRight: theme.spacing.xs }}
                    />
                    <ListItemText
                      primary="Администраторы"
                      sx={{
                        color: theme.colors.text
                      }}
                    />
                  </ListItem>
                  <ListItem
                    component={NavLink}
                    to={"/private/order_stats"}
                    onClick={toggleDrawer(false)}
                  >
                    <AutoGraphOutlinedIcon
                      style={{ color: theme.colors.ICON_GREEN, marginRight: theme.spacing.xs }}
                    />
                    <ListItemText
                      primary="Статистика заказов"
                      sx={{
                        color: theme.colors.text
                      }}
                    />
                  </ListItem>
                </>
              )}
              <ListItem
                component={NavLink}
                to="/private/client_orders"
                onClick={toggleDrawer(false)}
              >
                <CreditScoreOutlinedIcon
                  style={{ color: theme.colors.ICON_GREEN, marginRight: theme.spacing.xs }}
                />
                <ListItemText
                  primary="Заказы"
                  sx={{
                    color: theme.colors.text
                  }}
                />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/private/clients"
                onClick={toggleDrawer(false)}
              >
                <GroupOutlinedIcon
                  style={{ color: theme.colors.ICON_GREEN, marginRight: theme.spacing.xs }}
                />
                <ListItemText
                  primary="Клиенты"
                  sx={{
                    color: theme.colors.text
                  }}
                />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/private/brands"
                onClick={() => toggleBrand(false)}
              >
                <BallotOutlinedIcon
                  style={{ color: theme.colors.ICON_GREEN, marginRight: theme.spacing.xs }}
                />
                <ListItemText
                  primary="Бренды"
                  sx={{
                    color: theme.colors.text
                  }}
                />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/private/products"
                onClick={toggleDrawer(false)}
              >
                <ListAltOutlinedIcon
                  style={{ color: theme.colors.ICON_GREEN, marginRight: theme.spacing.xs }}
                />
                <ListItemText
                  primary="Товары"
                  sx={{
                    color: theme.colors.text
                  }}
                />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/private/manage_categories"
                onClick={toggleDrawer(false)}
              >
                <CategoryOutlinedIcon
                  style={{ color: theme.colors.ICON_GREEN, marginRight: theme.spacing.xs }}
                />
                <ListItemText
                  primary="Категории"
                  sx={{
                    color: theme.colors.text
                  }}
                />
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
                <HomeOutlinedIcon
                  style={{ color: theme.colors.ICON_GREEN, marginRight: theme.spacing.xs }}
                />
                <ListItemText
                  primary="Личный кабинет"
                  sx={{
                    color: theme.colors.text
                  }}
                />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/my_orders"
                onClick={toggleDrawer(false)}
              >
                <LocalMallOutlinedIcon
                  style={{ color: theme.colors.ICON_GREEN, marginRight: theme.spacing.xs }}
                />
                <ListItemText
                  primary="Мои Заказы"
                  sx={{
                    color: theme.colors.text
                  }}
                />
              </ListItem>
              <ListItem
                component={NavLink}
                to="/my_cart"
                onClick={toggleDrawer(false)}
              >
                <ShoppingCartOutlinedIcon
                  style={{ color: theme.colors.ICON_GREEN, marginRight: theme.spacing.xs }}
                />
                <ListItemText
                  primary="Корзина"
                  sx={{
                    color: theme.colors.text
                  }}
                />
              </ListItem>
              <ListItem
                component={NavLink}
                to="favorite-products"
                onClick={toggleDrawer(false)}
              >
                <FavoriteOutlinedIcon
                  style={{ color: theme.colors.ICON_GREEN, marginRight: theme.spacing.xs }}
                />
                <ListItemText
                  primary="Избранные"
                  sx={{
                    color: theme.colors.text
                  }}
                />
              </ListItem>
            </List>
          )}
          <Divider />
          <ListItem
            component="button"
            onClick={userLogout}
            style={{
              marginTop: "30px",
              border: "none",
              background: "none",
              padding: 0,
              textAlign: "left",
              width: "100%",
              cursor: "pointer",
            }}
          >
            <LogoutOutlinedIcon
              style={{ color: theme.colors.ICON_GREEN, marginRight: theme.spacing.xs }}
            />
            <ListItemText
              primary="Выйти"
              sx={{
                color: theme.colors.text
              }}
            />
          </ListItem>
        </Box>
      </Drawer>
    </>
  );
};

export default ExistsUser;
