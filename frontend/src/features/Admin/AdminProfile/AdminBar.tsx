import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import "./Admin.css";
import { ListItemButton } from "@mui/joy";
import { ExpandLess } from "@mui/icons-material";
import React from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ReorderOutlinedIcon from "@mui/icons-material/ReorderOutlined";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import {
  addErrorFromSlice,
  clearError,
} from "../../../store/brands/brandsSlice.ts";
import { useAppDispatch, useAppSelector, usePermission } from '../../../app/hooks.ts';
import { selectUser } from "../../../store/users/usersSlice.ts";

const AdminBar = () => {
  const [open, setOpen] = React.useState(true);
  const [openProducts, setOpenProducts] = React.useState(true);
  const addError = useAppSelector(addErrorFromSlice);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const can = usePermission(user);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpenProducts(!openProducts);
  };

  return (
    <div className="admin-bar">
      {user && can(["admin", "superAdmin"]) && (
        <List>
          <ListItem component={NavLink} to={`/private_account`}>
            <b className="text-uppercase text-black">Личный кабинет</b>
          </ListItem>
          <hr />
          <ListItem component={NavLink} to={`/private/users/${user.id}`}>
            <ListItemText
              primary="Редактировать профиль"
              className="text-black"
            />
          </ListItem>
          <ListItem component={NavLink} to="/edition_site">
            <ListItemText
              primary="Редактирование сайта"
              className="text-black"
            />
          </ListItem>
          <ListItem component={NavLink} to="/private/client_orders">
            <ListItemText primary="Заказы" className="text-black" />
          </ListItem>
          <ListItem component={NavLink} to="/private/clients">
            <ListItemText primary="Клиенты" className="text-black" />
          </ListItem>

          <ListItemButton
            onClick={handleClick}
            sx={{
              marginLeft: "15px",
            }}
          >
            <ListItemText primary="Категории" />
            {open ? <ExpandLess /> : <KeyboardArrowRightIcon />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 3 }}
                component={NavLink}
                to="/private/all_categories"
              >
                <ListItemIcon>
                  <ReorderOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Все категории" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 3 }}
                component={NavLink}
                to="/private/add_category"
                onClick={() =>
                  addError !== null ? dispatch(clearError()) : null
                }
              >
                <ListItemIcon>
                  <PlaylistAddOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Добавить категорию" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 3 }}
                component={NavLink}
                to="/private/add_subcategory"
                onClick={() =>
                  addError !== null ? dispatch(clearError()) : null
                }
              >
                <ListItemIcon>
                  <PlaylistAddOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Добавить подкатегорию" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            onClick={handleClick}
            sx={{
              marginLeft: "15px",
            }}
          >
            <ListItemText primary="Бренды" />
            {open ? <ExpandLess /> : <KeyboardArrowRightIcon />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 3 }}
                component={NavLink}
                to="/private/brands"
              >
                <ListItemIcon>
                  <ReorderOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Все бренды" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 3 }}
                component={NavLink}
                to="/private/add_brand"
                onClick={() =>
                  addError !== null ? dispatch(clearError()) : null
                }
              >
                <ListItemIcon>
                  <PlaylistAddOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Добавить бренд" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            onClick={handleClose}
            sx={{
              marginLeft: "15px",
            }}
          >
            <ListItemText primary="Товары" />
            {openProducts ? <ExpandLess /> : <KeyboardArrowRightIcon />}
          </ListItemButton>
          <Collapse in={openProducts} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 3 }}>
                <ListItem component={NavLink} to="/private/products">
                  <ListItemText primary="Все товары" className="text-black" />
                </ListItem>
              </ListItemButton>
              <ListItemButton sx={{ pl: 3 }}>
                <ListItem component={NavLink} to="/private/add_product">
                  <ListItemText
                    primary="Добавить товар"
                    className="text-black"
                  />
                </ListItem>
              </ListItemButton>
            </List>
          </Collapse>

        </List>
      )}
    </div>
  );
};

export default AdminBar;
