import { List, ListItem, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";
import "./Client.css";
import { useAppSelector } from "../../../app/hooks.ts";
import { selectUser } from "../../../store/users/usersSlice.ts";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';

const ClientBar = () => {
  const user = useAppSelector(selectUser);
  return (
    <div className="client-bar">
      {user && user.role === "client" && (
        <List>
          <ListItem component={NavLink} to={`/my_account/users/account/${user && user.id}`}>
            <HomeOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Личный кабинет" className="text-black" />
          </ListItem>
          <ListItem component={NavLink} to={`/client/users/${user && user.id}`}>
            <SettingsSuggestOutlinedIcon style={{ color: "#45624E",  marginRight: "10px" }} />
            <ListItemText primary="Редактирование личного кабинета" className="text-black" />
          </ListItem>
          <ListItem component={NavLink} to="/my_orders">
            <LocalMallOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Мои Заказы" className="text-black" />
          </ListItem>
          <ListItem component={NavLink} to="/my_cart">
            <ShoppingCartOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Корзина" className="text-black" />
          </ListItem>
          <ListItem component={NavLink} to="/favorite-products">
            <FavoriteOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Избранные" className="text-black" />
          </ListItem>
        </List>
      )}
    </div>
  );
};

export default ClientBar;
