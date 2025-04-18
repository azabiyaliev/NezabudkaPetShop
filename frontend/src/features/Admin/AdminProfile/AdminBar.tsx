import { useState } from "react";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";
import { ExpandLess, KeyboardArrowRight, ReorderOutlined, PlaylistAddOutlined, EditNote } from "@mui/icons-material";

const AdminBar = () => {
  const [openCategories, setOpenCategories] = useState(false);
  const [openCarousel, setOpenCarousel] = useState(false);
  const [openBrands, setOpenBrands] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);

  const handleCategoriesClick = () => setOpenCategories(!openCategories);
  const handleCarouselClick = () => setOpenCarousel(!openCarousel);
  const handleBrandsClick = () => setOpenBrands(!openBrands);
  const handleProductsClick = () => setOpenProducts(!openProducts);

  return (
    <div className="admin-bar">
      <List>
        <ListItem component={NavLink} to="/private_account">
          <b className="text-uppercase text-black">Личный кабинет</b>
        </ListItem>
        <hr />
        <ListItem component={NavLink} to="/private/users/1">
          <ListItemText primary="Редактировать профиль" className="text-black" />
        </ListItem>

        <ListItemButton onClick={handleCategoriesClick}>
          <ListItemText primary="Категории" />
          {openCategories ? <ExpandLess /> : <KeyboardArrowRight />}
        </ListItemButton>
        {openCategories && (
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 3 }} component={NavLink} to="/private/manage_categories">
              <ListItemIcon>
                <ReorderOutlined />
              </ListItemIcon>
              <ListItemText primary="Управление категориями" />
            </ListItemButton>
          </List>
        )}

        <ListItemButton onClick={handleCarouselClick}>
          <ListItemText primary="Карусель" />
          {openCarousel ? <ExpandLess /> : <KeyboardArrowRight />}
        </ListItemButton>
        {openCarousel && (
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 3 }} component={NavLink} to="/private/brands">
              <ListItemIcon>
                <PlaylistAddOutlined />
              </ListItemIcon>
              <ListItemText primary="Добавить изображение в карусель" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 3 }} component={NavLink} to="/private/add_brand">
              <ListItemIcon>
                <EditNote />
              </ListItemIcon>
              <ListItemText primary="Редактирование каруселя" />
            </ListItemButton>
          </List>
        )}

        <ListItemButton onClick={handleBrandsClick}>
          <ListItemText primary="Бренды" />
          {openBrands ? <ExpandLess /> : <KeyboardArrowRight />}
        </ListItemButton>
        {openBrands && (
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 1 }} component={NavLink} to="/private/brands">
              <ListItemIcon>
                <ReorderOutlined />
              </ListItemIcon>
              <ListItemText primary="Все бренды" className="text-black" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 1 }} component={NavLink} to="/private/add_brand">
              <ListItemIcon>
                <PlaylistAddOutlined />
              </ListItemIcon>
              <ListItemText primary="Добавить бренд" className="text-black" />
            </ListItemButton>
          </List>
        )}

        <ListItemButton onClick={handleProductsClick}>
          <ListItemText primary="Товары" />
          {openProducts ? <ExpandLess /> : <KeyboardArrowRight />}
        </ListItemButton>
        {openProducts && (
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 1 }} component={NavLink} to="/private/products">
              <ListItemIcon>
                <ReorderOutlined />
              </ListItemIcon>
              <ListItemText primary="Все товары" className="text-black" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 1 }} component={NavLink} to="/private/add_product">
              <ListItemIcon>
                <PlaylistAddOutlined />
              </ListItemIcon>
              <ListItemText primary="Добавить товар" className="text-black" />
            </ListItemButton>
          </List>
        )}
      </List>
    </div>
  );
};

export default AdminBar;