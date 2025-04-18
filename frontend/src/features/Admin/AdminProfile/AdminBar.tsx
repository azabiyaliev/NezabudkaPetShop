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
import { useState } from 'react';
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ReorderOutlinedIcon from "@mui/icons-material/ReorderOutlined";
import EditNoteIcon from '@mui/icons-material/EditNote';
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import {
  addErrorFromSlice,
  clearError,
} from "../../../store/brands/brandsSlice.ts";
import { useAppDispatch, useAppSelector, usePermission } from '../../../app/hooks.ts';
import { selectUser } from "../../../store/users/usersSlice.ts";

const AdminBar = () => {
  const [openCategories, setOpenCategories] = useState(false);
  const [openCarousel, setOpenCarousel] = useState(false);
  const [openBrands, setOpenBrands] = useState(false);
  const [openProducts, setOpenProducts] = useState(true);
  const addError = useAppSelector(addErrorFromSlice);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const can = usePermission(user);

  const handleCategoriesClick = () => {
    setOpenCategories(!openCategories);
  };

  const handleCarouselClick = () => {
    setOpenCarousel(!openCarousel);
  };

  const handleBrandsClick = () => {
    setOpenBrands(!openBrands);
  };

  const handleProductsClick = () => {
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
          {user && can(['superAdmin']) && (
            <ListItem component={NavLink} to="/private/order_stats">
              <ListItemText primary="Статистика" className="text-black" />
            </ListItem>
          )}
          <ListItem component={NavLink} to="/private/clients">
            <ListItemText primary="Клиенты" className="text-black" />
          </ListItem>

          <ListItemButton onClick={handleCategoriesClick} sx={{ marginLeft: "15px" }}>
            <ListItemText primary="Категории" />
            {openCategories ? <ExpandLess /> : <KeyboardArrowRightIcon />}
          </ListItemButton>
          <Collapse in={openCategories} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 3 }} component={NavLink} to="/private/manage_categories">
                <ListItemIcon>
                  <ReorderOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Управление категориями" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton onClick={handleCarouselClick} sx={{ marginLeft: "15px" }}>
            <ListItemText primary="Карусель" />
            {openCarousel ? <ExpandLess /> : <KeyboardArrowRightIcon />}
          </ListItemButton>
          <Collapse in={openCarousel} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 3 }} component={NavLink} to="/private/brands">
                <ListItemIcon>
                  <PlaylistAddOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Добавить изображение в карусель" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 3 }} component={NavLink} to="/private/add_brand" onClick={() => addError !== null ? dispatch(clearError()) : null}>
                <ListItemIcon>
                  <EditNoteIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText primary="Редактирование каруселя" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton onClick={handleBrandsClick} sx={{ marginLeft: "15px" }}>
            <ListItemText primary="Бренды" />
            {openBrands ? <ExpandLess /> : <KeyboardArrowRightIcon />}
          </ListItemButton>
          <Collapse in={openBrands} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 1 }}>
                <ListItem component={NavLink} to="/private/brands">
                  <ListItemIcon>
                    <ReorderOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Все бренды" className="text-black" />
                </ListItem>
              </ListItemButton>
              <ListItemButton sx={{ pl: 1 }}>
                <ListItem
                  component={NavLink}
                  to="/private/add_brand"
                  onClick={() => addError !== null ? dispatch(clearError()) : null}
                >
                  <ListItemIcon>
                    <PlaylistAddOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Добавить бренд" className="text-black" />
                </ListItem>
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton onClick={handleProductsClick} sx={{ marginLeft: "15px" }}>
            <ListItemText primary="Товары" />
            {openProducts ? <ExpandLess /> : <KeyboardArrowRightIcon />}
          </ListItemButton>
          <Collapse in={openProducts} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 1 }}>
                <ListItem component={NavLink} to="/private/products">
                  <ListItemIcon>
                    <ReorderOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Все товары" className="text-black" />
                </ListItem>
              </ListItemButton>
              <ListItemButton sx={{ pl: 1 }}>
                <ListItem component={NavLink} to="/private/add_product">
                  <ListItemIcon>
                    <PlaylistAddOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Добавить товар" className="text-black" />
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