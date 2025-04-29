import { useEffect, useState } from 'react';
import {
  List, ListItem, ListItemButton, ListItemText,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import EditNote from '@mui/icons-material/EditNote';
import ExpandLess from '@mui/icons-material/ExpandLess';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import PlaylistAddOutlined from '@mui/icons-material/PlaylistAddOutlined';
import ReorderOutlined from '@mui/icons-material/ReorderOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import ModalWindowAddNewPhoto from '../../../components/UI/ModalWindow/ModalWindowAddNewPhoto.tsx';
import { useAppSelector, usePermission } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { selectCompany } from '../../../store/companyPage/compantPageSlice.ts';
import { selectDelivery } from '../../../store/deliveryPage/deliveryPageSlice.ts';
import { selectBonusProgram } from '../../../store/bonusProgramPage/bonusProgramPageSlice.ts';

const getInitialState = (key: string) => localStorage.getItem(key) === 'true';

const AdminBar = () => {
  const company = useAppSelector(selectCompany);
  const delivery = useAppSelector(selectDelivery);
  const bonusProgram = useAppSelector(selectBonusProgram);
  const user = useAppSelector(selectUser);
  const can = usePermission(user);

  const [openCategories, setOpenCategories] = useState(() => getInitialState('openCategories'));
  const [openCarousel, setOpenCarousel] = useState(() => getInitialState('openCarousel'));
  const [openBrands, setOpenBrands] = useState(() => getInitialState('openBrands'));
  const [openProducts, setOpenProducts] = useState(() => getInitialState('openProducts'));
  const [openAdmins, setOpenAdmins] = useState(() => getInitialState('openAdmins'));
  const [openPagesEdit, setOpenPagesEdit] = useState(() => getInitialState('openPagesEdit'));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('openCategories', String(openCategories));
    localStorage.setItem('openCarousel', String(openCarousel));
    localStorage.setItem('openBrands', String(openBrands));
    localStorage.setItem('openProducts', String(openProducts));
    localStorage.setItem('openAdmins', String(openAdmins));
    localStorage.setItem('openPagesEdit', String(openPagesEdit));
  }, [openCategories, openCarousel, openBrands, openProducts, openAdmins, openPagesEdit]);

  return (
    <>
      <ModalWindowAddNewPhoto open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <div className="admin-bar">
        {user && can(["admin", "superAdmin"]) && (
          <List>
            <ListItem component={NavLink} to={`/private_account`}>
              <b className="text-uppercase text-black">Личный кабинет</b>
            </ListItem>
            <hr />
            <ListItem component={NavLink} to={`/private/users/${user.id}`}>
              <EditNoteIcon style={{ color: "#45624E", marginRight: "10px" }} />
              <ListItemText primary="Редактирование личного кабинета" className="text-black" />
            </ListItem>
            <ListItem component={NavLink} to="/edition_site">
              <SettingsSuggestOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
              <ListItemText primary="Редактирование профиля магазина" className="text-black" />
            </ListItem>
            <ListItem component={NavLink} to="/private/client_orders">
              <CreditScoreOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
              <ListItemText primary="Заказы" className="text-black" />
            </ListItem>
            {user && can(['superAdmin']) && (
              <ListItem component={NavLink} to="/private/order_stats">
                <AutoGraphOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
                <ListItemText primary="Статистика" className="text-black" />
              </ListItem>
            )}
            <ListItem component={NavLink} to="/private/clients">
              <GroupOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
              <ListItemText primary="Клиенты" className="text-black" />
            </ListItem>

            {user && can(['superAdmin']) && (
              <>
                <ListItemButton onClick={() => setOpenAdmins(prev => !prev)}>
                  <AdminPanelSettingsOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
                  <ListItemText primary="Администраторы" />
                  {openAdmins ? <ExpandLess /> : <KeyboardArrowRight />}
                </ListItemButton>
                {openAdmins && (
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 5 }} component={NavLink} to="/admin-table">
                      <ReorderOutlined style={{ color: "#45624E", marginRight: "10px" }} />
                      <ListItemText primary="Список администраторов" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 5 }} component={NavLink} to="/admin-create">
                      <PlaylistAddOutlined style={{ color: "#45624E", marginRight: "10px" }} />
                      <ListItemText primary="Создание администратора" />
                    </ListItemButton>
                  </List>
                )}
              </>
            )}

            <ListItemButton onClick={() => setOpenPagesEdit(prev => !prev)}>
              <ReceiptLongOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
              <ListItemText primary="Управление контентом" />
              {openPagesEdit ? <ExpandLess /> : <KeyboardArrowRight />}
            </ListItemButton>
            {openPagesEdit && (
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 5 }} component={NavLink} to={`/my_company/${company?.id}`}>
                  <EditNote style={{ color: "#45624E", marginRight: "10px" }} />
                  <ListItemText primary='О компании' />
                </ListItemButton>
                <ListItemButton sx={{ pl: 5 }} component={NavLink} to={`/delivery/${delivery?.id}`}>
                  <EditNote style={{ color: "#45624E", marginRight: "10px" }} />
                  <ListItemText primary='Доставка и оплата' />
                </ListItemButton>
                <ListItemButton sx={{ pl: 5 }} component={NavLink} to={`/bonus_program/${bonusProgram?.id}`}>
                  <EditNote style={{ color: "#45624E", marginRight: "10px" }} />
                  <ListItemText primary='Бонусная программа' />
                </ListItemButton>
              </List>
            )}

            <ListItemButton onClick={() => setOpenCategories(prev => !prev)}>
              <CategoryOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
              <ListItemText primary="Категории" />
              {openCategories ? <ExpandLess /> : <KeyboardArrowRight />}
            </ListItemButton>
            {openCategories && (
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 5 }} component={NavLink} to="/private/manage_categories">
                  <ReorderOutlined style={{ color: "#45624E", marginRight: "10px" }} />
                  <ListItemText primary="Управление категориями" />
                </ListItemButton>
              </List>
            )}

            <ListItemButton onClick={() => setOpenCarousel(prev => !prev)}>
              <Diversity2OutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
              <ListItemText primary="Карусель" />
              {openCarousel ? <ExpandLess /> : <KeyboardArrowRight />}
            </ListItemButton>
            {openCarousel && (
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 5 }} onClick={() => setIsAddModalOpen(true)}>
                  <PlaylistAddOutlined style={{ color: "#45624E", marginRight: "10px" }} />
                  <ListItemText primary="Добавить изображение" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 5 }} component={NavLink} to="/edit-carousel">
                  <EditNote style={{ color: "#45624E", marginRight: "10px" }} />
                  <ListItemText primary="Редактировать карусель" />
                </ListItemButton>
              </List>
            )}

            <ListItemButton onClick={() => setOpenBrands(prev => !prev)}>
              <BallotOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
              <ListItemText primary="Бренды" />
              {openBrands ? <ExpandLess /> : <KeyboardArrowRight />}
            </ListItemButton>
            {openBrands && (
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 5 }} component={NavLink} to="/private/brands">
                  <ReorderOutlined style={{ color: "#45624E", marginRight: "10px" }} />
                  <ListItemText primary="Все бренды" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 5 }} component={NavLink} to="/private/add_brand">
                  <PlaylistAddOutlined style={{ color: "#45624E", marginRight: "10px" }} />
                  <ListItemText primary="Добавить бренд" />
                </ListItemButton>
              </List>
            )}

            <ListItemButton onClick={() => setOpenProducts(prev => !prev)}>
              <ListAltOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
              <ListItemText primary="Товары" />
              {openProducts ? <ExpandLess /> : <KeyboardArrowRight />}
            </ListItemButton>
            {openProducts && (
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 5 }} component={NavLink} to="/private/products">
                  <ReorderOutlined style={{ color: "#45624E", marginRight: "10px" }} />
                  <ListItemText primary="Все товары" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 5 }} component={NavLink} to="/private/add_product">
                  <PlaylistAddOutlined style={{ color: "#45624E", marginRight: "10px" }} />
                  <ListItemText primary="Добавить товар" />
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
