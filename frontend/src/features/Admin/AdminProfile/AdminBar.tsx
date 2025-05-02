import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Divider,
} from '@mui/material';
import {
  EditNote,
  PlaylistAddOutlined,
  ReorderOutlined,
  EditNoteOutlined,
  SettingsSuggestOutlined,
  CreditScoreOutlined,
  AutoGraphOutlined,
  GroupOutlined,
  CategoryOutlined,
  BallotOutlined,
  Diversity2Outlined,
  ListAltOutlined,
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
import AdminNavItem from './AdminNavItem.tsx';
import { userRoleAdmin, userRoleSuperAdmin } from '../../../globalConstants.ts';

const iconSx = { color: "#45624E", mr: 1 };

const AdminBar = () => {
  const company = useAppSelector(selectCompany);
  const delivery = useAppSelector(selectDelivery);
  const bonusProgram = useAppSelector(selectBonusProgram);
  const user = useAppSelector(selectUser);
  const can = usePermission(user);

  return (
    <div
      style={{
        width: 370,
        padding: '12px 20px',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        boxShadow: '0 0 10px rgba(0,0,0,0.05)',
        height: 'fit-content',
        maxHeight: '100vh',
        overflowY: 'auto',
      }}
    >
      {user && can([userRoleSuperAdmin, userRoleAdmin]) && (
        <List
          subheader={
            <ListSubheader
              component="div"
              sx={{
                bgcolor: 'inherit',
                fontWeight: 700,
                pl: 0,
                position: 'static',
              }}
            >
              {can([userRoleSuperAdmin])
                ? `Панель ${user.firstName} ${user.secondName}`
                : 'Панель администратора'}
            </ListSubheader>
          }
          dense
        >
          {can([userRoleAdmin]) && (
            <>
              <ListItem
                component={NavLink}
                to={`/private_account`}
                sx={{pl: 0}}
              >
                <ListItemText
                  primary="Личный кабинет"
                  sx={{ color: 'rgba(46, 46, 46, 0.7)' }}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                />
              </ListItem>
              <Divider sx={{ my: 0.8 }} />
            </>
          )}

          {can([userRoleSuperAdmin]) && (
            <>
              <Divider sx={{ my: 0.8 }} />
            </>
          )}

          <AdminNavItem
            to={`/private/users/${user.id}`}
            icon={<EditNoteOutlined sx={iconSx} />}
            text="Редактирование личного кабинета"
          />
          <AdminNavItem
            to="/edition_site"
            icon={<SettingsSuggestOutlined sx={iconSx} />}
            text="Профиль магазина"
          />
          <AdminNavItem
            to="/private/client_orders"
            icon={<CreditScoreOutlined sx={iconSx} />}
            text="Заказы клиентов"
          />
          {can(['superAdmin']) && (
            <AdminNavItem
              to="/private/order_stats"
              icon={<AutoGraphOutlined sx={iconSx} />}
              text="Статистика заказов"
            />
          )}
          <AdminNavItem
            to="/private/clients"
            icon={<GroupOutlined sx={iconSx} />}
            text="Клиенты"
          />

          {can(['superAdmin']) && (
            <>
              <Divider />
              <ListSubheader sx={{ bgcolor: 'inherit', fontWeight: 600, pl: 0,  position: 'static' }}>Администраторы</ListSubheader>
              <AdminNavItem
                to="/admin-table"
                icon={<ReorderOutlined sx={iconSx} />}
                text="Список администраторов"
              />
              <AdminNavItem
                to="/admin-create"
                icon={<PlaylistAddOutlined sx={iconSx} />}
                text="Создание администратора"
              />
            </>
          )}

          <Divider />
          <ListSubheader sx={{ bgcolor: 'inherit', fontWeight: 600, pl: 0,  position: 'static', }}>Управление контентом</ListSubheader>
          <AdminNavItem
            to={`/my_company/${company?.id}`}
            icon={<EditNote sx={iconSx} />}
            text="О компании"
          />
          <AdminNavItem
            to={`/delivery/${delivery?.id}`}
            icon={<EditNote sx={iconSx} />}
            text="Доставка и оплата"
          />
          <AdminNavItem
            to={`/bonus_program/${bonusProgram?.id}`}
            icon={<EditNote sx={iconSx} />}
            text="Бонусная программа"
          />

          <Divider />
          <ListSubheader sx={{ bgcolor: 'inherit', fontWeight: 600, pl: 0,  position: 'static', }}>Категории</ListSubheader>
          <AdminNavItem
            to="/private/manage_categories"
            icon={<CategoryOutlined sx={iconSx} />}
            text="Управление категориями"
          />

          <Divider />
          <ListSubheader sx={{ bgcolor: 'inherit', fontWeight: 600, pl: 0,  position: 'static', }}>Карусель</ListSubheader>
          <AdminNavItem
            to="/edit-carousel"
            icon={<Diversity2Outlined sx={iconSx} />}
            text="Редактировать карусель"
          />

          <Divider />
          <ListSubheader sx={{ bgcolor: 'inherit', fontWeight: 600, pl: 0,  position: 'static', }}>Бренды</ListSubheader>
          <AdminNavItem
            to="/private/brands"
            icon={<BallotOutlined sx={iconSx} />}
            text="Все бренды"
          />
          <AdminNavItem
            to="/private/add_brand"
            icon={<PlaylistAddOutlined sx={iconSx} />}
            text="Добавить бренд"
          />

          <Divider />
          <ListSubheader sx={{ bgcolor: 'inherit', fontWeight: 600, pl: 0,  position: 'static', }}>Товары</ListSubheader>
          <AdminNavItem
            to="/private/products"
            icon={<ListAltOutlined sx={iconSx} />}
            text="Все товары"
          />
          <AdminNavItem
            to="/private/add_product"
            icon={<PlaylistAddOutlined sx={iconSx} />}
            text="Добавить товар"
          />
        </List>
      )}
    </div>
  );
};

export default AdminBar;
