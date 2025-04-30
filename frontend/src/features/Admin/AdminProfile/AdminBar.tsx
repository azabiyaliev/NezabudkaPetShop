import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { EditNote, PlaylistAddOutlined, ReorderOutlined } from '@mui/icons-material';
import {
  useAppSelector,
  usePermission,
} from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { selectCompany } from '../../../store/companyPage/compantPageSlice.ts';
import { selectDelivery } from '../../../store/deliveryPage/deliveryPageSlice.ts';
import { selectBonusProgram } from '../../../store/bonusProgramPage/bonusProgramPageSlice.ts';

import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
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
import { selectAdminInfo } from '../../../store/adminInfo/adminInfoSlice.ts';
import { selectClientInfo } from "../../../store/clientInfo/clientInfoSlice.ts";

const AdminBar = () => {
  const company = useAppSelector(selectCompany);
  const delivery = useAppSelector(selectDelivery);
  const bonusProgram = useAppSelector(selectBonusProgram);
  const adminInfo = useAppSelector(selectAdminInfo);
  const clientInfo = useAppSelector(selectClientInfo);
  const user = useAppSelector(selectUser);
  const can = usePermission(user);

  return (
    <div className="admin-bar">
      {user && can(['admin', 'superAdmin']) && (
        <List>
          <ListItem component={NavLink} to={`/private_account`}>
            <b className="text-uppercase text-black">Личный кабинет</b>
          </ListItem>
          <hr />
          <ListItem component={NavLink} to={`/private/users/${user.id}`}>
            <EditNoteOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Редактирование личного кабинета" className="text-black" />
          </ListItem>

          {can(['superAdmin']) && (
            <>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 5 }} component={NavLink} to={`/admin_info/${adminInfo?.id}`}>
                  <EditNoteOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
                  <ListItemText primary="Информация для администрации" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 5 }} component={NavLink} to={`/client_info/${clientInfo?.id}`}>
                  <EditNoteOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
                  <ListItemText primary="Информация для клиентов" />
                </ListItemButton>
              </List>
            </>
          )}
          <ListItem component={NavLink} to="/edition_site">
            <SettingsSuggestOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Редактирование профиля магазина" className="text-black" />
          </ListItem>
          <ListItem component={NavLink} to="/private/client_orders">
            <CreditScoreOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Заказы" className="text-black" />
          </ListItem>
          {can(['superAdmin']) && (
            <ListItem component={NavLink} to="/private/order_stats">
              <AutoGraphOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
              <ListItemText primary="Статистика" className="text-black" />
            </ListItem>
          )}
          <ListItem component={NavLink} to="/private/clients">
            <GroupOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Клиенты" className="text-black" />
          </ListItem>

          {can(['superAdmin']) && (
            <>
              <ListItem>
                <AdminPanelSettingsOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
                <ListItemText primary="Администраторы" />
              </ListItem>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 5 }} component={NavLink} to={'/admin-table'}>
                  <ReorderOutlined style={{ color: "#45624E", marginRight: "10px" }} />
                  <ListItemText primary="Список администраторов" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 5 }} component={NavLink} to={'/admin-create'}>
                  <PlaylistAddOutlined style={{ color: "#45624E", marginRight: "10px" }} />
                  <ListItemText primary="Создание администратора" />
                </ListItemButton>
              </List>
            </>
          )}

          <ListItem>
            <ReceiptLongOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Управление контентом" />
          </ListItem>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 5 }} component={NavLink} to={`/my_company/${company?.id}`}>
              <EditNote style={{ color: "#45624E", marginRight: "10px" }} />
              <ListItemText primary='Редактирование страницы "О компании"' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 5 }} component={NavLink} to={`/delivery/${delivery?.id}`}>
              <EditNote style={{ color: "#45624E", marginRight: "10px" }} />
              <ListItemText primary='Редактирование страницы "Доставка и оплата"' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 5 }} component={NavLink} to={`/bonus_program/${bonusProgram?.id}`}>
              <EditNote style={{ color: "#45624E", marginRight: "10px" }} />
              <ListItemText primary='Редактирование страницы "Бонсуная программа"' />
            </ListItemButton>
          </List>

          <ListItem>
            <CategoryOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Категории" />
          </ListItem>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 5 }} component={NavLink} to="/private/manage_categories">
              <ReorderOutlined style={{ color: "#45624E", marginRight: "10px" }} />
              <ListItemText primary="Управление категориями" />
            </ListItemButton>
          </List>

          <ListItem>
            <Diversity2OutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Карусель" />
          </ListItem>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 5 }} component={NavLink} to="/edit-carousel">
              <EditNote style={{ color: "#45624E", marginRight: "10px" }} />
              <ListItemText primary="Редактирование каруселя" />
            </ListItemButton>
          </List>

          <ListItem>
            <BallotOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Бренды" />
          </ListItem>
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

          <ListItem>
            <ListAltOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Товары" />
          </ListItem>
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
        </List>
      )}
    </div>
  );
};

export default AdminBar;