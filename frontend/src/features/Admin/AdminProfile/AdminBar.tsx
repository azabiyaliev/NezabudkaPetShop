import { useState } from "react";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";
import { ExpandLess, KeyboardArrowRight, ReorderOutlined, PlaylistAddOutlined, EditNote } from "@mui/icons-material";
import ModalWindowAddNewPhoto from '../../../components/UI/ModalWindow/ModalWindowAddNewPhoto.tsx';
import { useAppSelector, usePermission } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { selectCompany } from '../../../store/companyPage/compantPageSlice.ts';
import { selectDelivery } from '../../../store/deliveryPage/deliveryPageSlice.ts';
import { selectBonusProgram } from '../../../store/bonusProgramPage/bonusProgramPageSlice.ts';

const AdminBar = () => {
  const company = useAppSelector(selectCompany);
  const delivery = useAppSelector(selectDelivery);
  const bonusProgram = useAppSelector(selectBonusProgram);
  const user = useAppSelector(selectUser);
  const [openCategories, setOpenCategories] = useState(false);
  const [openCarousel, setOpenCarousel] = useState(false);
  const [openBrands, setOpenBrands] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const can = usePermission(user);
  const [openPagesEdit, setOpenPagesEdit ] = useState(false);

  const handleCategoriesClick = () => setOpenCategories(!openCategories);
  const handleCarouselClick = () => setOpenCarousel(!openCarousel);
  const handleBrandsClick = () => setOpenBrands(!openBrands);
  const handleProductsClick = () => setOpenProducts(!openProducts);
  const handelOpenPagesEdit = () => setOpenPagesEdit(!openPagesEdit);

  return (
    <>
      <ModalWindowAddNewPhoto
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <div className="admin-bar">
        {user && can(["admin", "superAdmin"]) && (
          <List>
            <ListItem component={NavLink} to={`/private_account`}>
              <b className="text-uppercase text-black">Личный кабинет</b>
            </ListItem>
            <hr />
            <ListItem component={NavLink} to={`/private/users/${user.id}`}>
              <ListItemText
                primary="Редактирование профиля"
                className="text-black"
              />
            </ListItem>
            <ListItem component={NavLink} to="/edition_site">
              <ListItemText
                primary="Редактирование информации о магазине 'Незабудка'"
                className="text-black"
              />
            </ListItem>

            <ListItemButton onClick={handelOpenPagesEdit}>
              <ListItemText primary="Управление контентом"/>
              {openPagesEdit ? <ExpandLess/> : <KeyboardArrowRight/>}
            </ListItemButton>
            {openPagesEdit && (
              <List component="div" disablePadding>
                <ListItemButton sx={{pl: 3}} component={NavLink} to={`/my_company/${company?.id}`}>
                  <ListItemIcon>
                    <EditNote/>
                  </ListItemIcon>
                  <ListItemText primary='Редактирование страницы "О компании"' />
                </ListItemButton>
                <ListItemButton sx={{pl: 3}} component={NavLink} to={`/delivery/${delivery?.id}`}>
                  <ListItemIcon>
                    <EditNote/>
                  </ListItemIcon>
                  <ListItemText primary='Редактирование страницы "Доставка и оплата"' />
                </ListItemButton>
                <ListItemButton sx={{pl: 3}} component={NavLink} to={`/bonus_program/${bonusProgram?.id}`}>
                  <ListItemIcon>
                    <EditNote/>
                  </ListItemIcon>
                  <ListItemText primary='Редактирование страницы "Бонсуная программа"' />
                </ListItemButton>
              </List>
            )}
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

            <ListItemButton onClick={handleCategoriesClick}>
              <ListItemText primary="Категории"/>
              {openCategories ? <ExpandLess/> : <KeyboardArrowRight/>}
            </ListItemButton>
            {openCategories && (
              <List component="div" disablePadding>
                <ListItemButton sx={{pl: 3}} component={NavLink} to="/private/manage_categories">
                  <ListItemIcon>
                    <ReorderOutlined/>
                  </ListItemIcon>
                  <ListItemText primary="Управление категориями"/>
                </ListItemButton>
              </List>
            )}

            <ListItemButton onClick={handleCarouselClick}>
              <ListItemText primary="Карусель"/>
              {openCarousel ? <ExpandLess/> : <KeyboardArrowRight/>}
            </ListItemButton>
            {openCarousel && (
              <List component="div" disablePadding>
                <ListItemButton sx={{pl: 3}} onClick={() => setIsAddModalOpen(true)}
                >
                  <ListItemIcon>
                    <PlaylistAddOutlined/>
                  </ListItemIcon>
                  <ListItemText primary="Добавить изображение в карусель"/>
                </ListItemButton>
                <ListItemButton sx={{pl: 3}} component={NavLink} to="/edit-carousel">
                  <ListItemIcon>
                    <EditNote/>
                  </ListItemIcon>
                  <ListItemText primary="Редактирование каруселя"/>
                </ListItemButton>
              </List>
            )}



            <ListItemButton onClick={handleBrandsClick}>
              <ListItemText primary="Бренды"/>
              {openBrands ? <ExpandLess/> : <KeyboardArrowRight/>}
            </ListItemButton>
            {openBrands && (
              <List component="div" disablePadding>
                <ListItemButton sx={{pl: 1}} component={NavLink} to="/private/brands">
                  <ListItemIcon>
                    <ReorderOutlined/>
                  </ListItemIcon>
                  <ListItemText primary="Все бренды" className="text-black"/>
                </ListItemButton>
                <ListItemButton sx={{pl: 1}} component={NavLink} to="/private/add_brand">
                  <ListItemIcon>
                    <PlaylistAddOutlined/>
                  </ListItemIcon>
                  <ListItemText primary="Добавить бренд" className="text-black"/>
                </ListItemButton>
              </List>
            )}

            <ListItemButton onClick={handleProductsClick}>
              <ListItemText primary="Товары"/>
              {openProducts ? <ExpandLess/> : <KeyboardArrowRight/>}
            </ListItemButton>
            {openProducts && (
              <List component="div" disablePadding>
                <ListItemButton sx={{pl: 1}} component={NavLink} to="/private/products">
                  <ListItemIcon>
                    <ReorderOutlined/>
                  </ListItemIcon>
                  <ListItemText primary="Все товары" className="text-black"/>
                </ListItemButton>
                <ListItemButton sx={{pl: 1}} component={NavLink} to="/private/add_product">
                  <ListItemIcon>
                    <PlaylistAddOutlined/>
                  </ListItemIcon>
                  <ListItemText primary="Добавить товар" className="text-black"/>
                </ListItemButton>
              </List>
            )}
          </List>
        )}
      </div>
    </>
  );
};

export default AdminBar;