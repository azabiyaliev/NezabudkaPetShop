import {
  List,
  ListSubheader,
  Divider, Box,
} from '@mui/material';
import {
  useAppSelector,
  usePermission,
} from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
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
import HomeIcon from '@mui/icons-material/Home';
import AdminNavItem from './AdminNavItem.tsx';
import { userRoleAdmin, userRoleSuperAdmin } from '../../../globalConstants.ts';
import theme from '../../../globalStyles/globalTheme.ts';
import HistoryIcon from '@mui/icons-material/History';

const iconSx = { color: theme.colors.primary, mr: theme.spacing.exs };
const AdminBar = () => {
  const user = useAppSelector(selectUser);
  const can = usePermission(user);

  return (
    <Box
      sx={{
        width: 370,
        padding: '12px 20px',
        backgroundColor: '#f9f9f9',
        borderRadius: 2,
        boxShadow: '0 0 10px rgba(0,0,0,0.05)',
        height: 'fit-content',
        maxHeight: '100vh',
        overflowY: 'auto',
        marginBottom: '20px',
        '@media (max-width: 900px)': {
          width: '100%',
          padding: '16px',
          borderRadius: 1,
          height: 'auto',
          maxHeight: 'none',
        },
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
                <AdminNavItem
                  to={`/private_account`}
                  icon={<HomeIcon sx={iconSx} />}
                  text="Личный кабинет"
                />
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
            to="/private/edition_site"
            icon={<SettingsSuggestOutlined sx={iconSx} />}
            text="Профиль магазина"
          />
          <Divider />
          <ListSubheader sx={{ bgcolor: 'inherit', fontWeight: 600, pl: 0,  position: 'static' }}>Заказы</ListSubheader>
          <AdminNavItem
            to="/private/history_orders"
            icon={<HistoryIcon sx={iconSx} />}
            text="История Заказов"
          />
          <AdminNavItem
            to="/private/client_inprocess_orders"
            icon={<CreditScoreOutlined sx={iconSx} />}
            text="Активные Заказы"
          />

          {can(['superAdmin']) && (
            <AdminNavItem
              to="/private/order_stats"
              icon={<AutoGraphOutlined sx={iconSx} />}
              text="Статистика заказов"
            />
          )}
          <Divider/>
          <AdminNavItem
            to="/private/clients"
            icon={<GroupOutlined sx={iconSx} />}
            text="Клиенты"
          />

          {can(['superAdmin']) && (
            <>
              <AdminNavItem
                to={`/private/admin_info`}
                icon={<EditNoteOutlined sx={iconSx} />}
                text="Информация для администрации"
              />

              <AdminNavItem
                to={`/private/client_info`}
                icon={<EditNoteOutlined sx={iconSx} />}
                text="Информация для клиента"
              />
            </>
          )}

          {can(['superAdmin']) && (
            <>
              <Divider />
              <ListSubheader sx={{ bgcolor: 'inherit', fontWeight: 600, pl: 0,  position: 'static' }}>Администраторы</ListSubheader>
              <AdminNavItem
                to="/private/admin-table"
                icon={<ReorderOutlined sx={iconSx} />}
                text="Список администраторов"
              />
              <AdminNavItem
                to="/private/admin-create"
                icon={<PlaylistAddOutlined sx={iconSx} />}
                text="Создание администратора"
              />
            </>
          )}

          <Divider />
          <ListSubheader sx={{ bgcolor: 'inherit', fontWeight: 600, pl: 0,  position: 'static', }}>Управление контентом</ListSubheader>
          <AdminNavItem
            to={`/private/my_company`}
            icon={<EditNote sx={iconSx} />}
            text="О компании"
          />
          <AdminNavItem
            to={`/private/delivery`}
            icon={<EditNote sx={iconSx} />}
            text="Доставка и оплата"
          />
          <AdminNavItem
            to={`/private/bonus_program`}
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
            to="/private/edit-carousel"
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
    </Box>
  );
};

export default AdminBar;
