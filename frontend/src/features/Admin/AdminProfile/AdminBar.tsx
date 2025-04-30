import {
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  EditNote,
  PlaylistAddOutlined,
  ReorderOutlined,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

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
import './Admin.css'

import AdminNavItem from './AdminNavItem.tsx';

const AdminBar = () => {
  const company = useAppSelector(selectCompany);
  const delivery = useAppSelector(selectDelivery);
  const bonusProgram = useAppSelector(selectBonusProgram);
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

          <AdminNavItem
            to={`/private/users/${user.id}`}
            icon={<EditNoteOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />}
            text="Редактирование личного кабинета"
          />
          <AdminNavItem
            to="/edition_site"
            icon={<SettingsSuggestOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />}
            text="Редактирование профиля магазина"
          />
          <AdminNavItem
            to="/private/client_orders"
            icon={<CreditScoreOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />}
            text="Заказы"
          />
          {can(['superAdmin']) && (
            <AdminNavItem
              to="/private/order_stats"
              icon={<AutoGraphOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />}
              text="Статистика"
            />
          )}
          <AdminNavItem
            to="/private/clients"
            icon={<GroupOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />}
            text="Клиенты"
          />

          {can(['superAdmin']) && (
            <>
              <ListItem>
                <AdminPanelSettingsOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
                <ListItemText primary="Администраторы" />
              </ListItem>
              <List component="div" disablePadding>
                <AdminNavItem
                  to="/admin-table"
                  icon={<ReorderOutlined style={{ color: "#45624E", marginRight: "10px" }} />}
                  text="Список администраторов"
                />
                <AdminNavItem
                  to="/admin-create"
                  icon={<PlaylistAddOutlined style={{ color: "#45624E", marginRight: "10px" }} />}
                  text="Создание администратора"
                />
              </List>
            </>
          )}

          <ListItem>
            <ReceiptLongOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Управление контентом" />
          </ListItem>
          <List component="div" disablePadding>
            <AdminNavItem
              to={`/my_company/${company?.id}`}
              icon={<EditNote style={{ color: "#45624E", marginRight: "10px" }} />}
              text='Редактирование страницы "О компании"'
            />
            <AdminNavItem
              to={`/delivery/${delivery?.id}`}
              icon={<EditNote style={{ color: "#45624E", marginRight: "10px" }} />}
              text='Редактирование страницы "Доставка и оплата"'
            />
            <AdminNavItem
              to={`/bonus_program/${bonusProgram?.id}`}
              icon={<EditNote style={{ color: "#45624E", marginRight: "10px" }} />}
              text='Редактирование страницы "Бонусная программа"'
            />
          </List>

          <ListItem>
            <CategoryOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Категории" />
          </ListItem>
          <List component="div" disablePadding>
            <AdminNavItem
              to="/private/manage_categories"
              icon={<ReorderOutlined style={{ color: "#45624E", marginRight: "10px" }} />}
              text="Управление категориями"
            />
          </List>

          <ListItem>
            <Diversity2OutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Карусель" />
          </ListItem>
          <List component="div" disablePadding>
            <AdminNavItem
              to="/edit-carousel"
              icon={<EditNote style={{ color: "#45624E", marginRight: "10px" }} />}
              text="Редактирование карусели"
            />
          </List>

          <ListItem>
            <BallotOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Бренды" />
          </ListItem>
          <List component="div" disablePadding>
            <AdminNavItem
              to="/private/brands"
              icon={<ReorderOutlined style={{ color: "#45624E", marginRight: "10px" }} />}
              text="Все бренды"
            />
            <AdminNavItem
              to="/private/add_brand"
              icon={<PlaylistAddOutlined style={{ color: "#45624E", marginRight: "10px" }} />}
              text="Добавить бренд"
            />
          </List>

          <ListItem>
            <ListAltOutlinedIcon style={{ color: "#45624E", marginRight: "10px" }} />
            <ListItemText primary="Товары" />
          </ListItem>
          <List component="div" disablePadding>
            <AdminNavItem
              to="/private/products"
              icon={<ReorderOutlined style={{ color: "#45624E", marginRight: "10px" }} />}
              text="Все товары"
            />
            <AdminNavItem
              to="/private/add_product"
              icon={<PlaylistAddOutlined style={{ color: "#45624E", marginRight: "10px" }} />}
              text="Добавить товар"
            />
          </List>
        </List>
      )}
    </div>
  );
};

export default AdminBar;
