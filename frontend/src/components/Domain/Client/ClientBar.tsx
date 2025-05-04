import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks.ts";
import { selectUser } from "../../../store/users/usersSlice.ts";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import { COLORS } from '../../../globalStyles/stylesObjects.ts';

const ClientBar = () => {
  const user = useAppSelector(selectUser);
  return (
    <Box
      sx={{
        borderRight: "1px solid lightgray",
        paddingRight: "20px",
        height: "100%",
        "@media (max-width: 900px)": {
          borderRight: 'none',
        },
      }}
    >
      {user && user.role === "client" && (
        <Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              textAlign: "center",
              fontWeight: 600,
              paddingBottom: 2,
              "@media (max-width: 900px)": {
                borderBottom: `1px solid ${COLORS.DARK_GREEN}`,
              },
            }}
          >
            Мой аккаунт
          </Typography>
          <List>
            <ListItem
              component={NavLink}
              to={`/my_account/users/account/${user && user.id}`}
            >
              <HomeOutlinedIcon
                style={{ color: "#45624E", marginRight: "10px" }}
              />
              <ListItemText primary="Личный кабинет" className="text-black" />
            </ListItem>
            <ListItem component={NavLink} to={`/client/users/${user && user.id}`}>
              <SettingsSuggestOutlinedIcon
                style={{ color: `${COLORS.ICON_GREEN}`, marginRight: "10px" }}
              />
              <ListItemText
                primary="Редактирование личного кабинета"
                className="text-black"
              />
            </ListItem>
            <ListItem component={NavLink} to="/my_orders">
              <LocalMallOutlinedIcon
                style={{ color: `${COLORS.ICON_GREEN}`, marginRight: "10px" }}
              />
              <ListItemText primary="Мои Заказы" className="text-black" />
            </ListItem>
            <ListItem component={NavLink} to="/my_cart">
              <ShoppingCartOutlinedIcon
                style={{ color: `${COLORS.ICON_GREEN}`, marginRight: "10px" }}
              />
              <ListItemText primary="Корзина" className="text-black" />
            </ListItem>
            <ListItem component={NavLink} to="/favorite-products">
              <FavoriteOutlinedIcon
                style={{ color: `${COLORS.ICON_GREEN}`, marginRight: "10px" }}
              />
              <ListItemText primary="Избранные" className="text-black" />
            </ListItem>
          </List>
        </Box>
      )}
    </Box>
  );
};

export default ClientBar;
