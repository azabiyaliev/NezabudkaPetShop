import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectUser } from '../../store/users/usersSlice.ts';
import  { useEffect, useState } from 'react';
import { GetClientOrders, GetGuestOrders, transferGuestOrders } from '../../store/orders/ordersThunk.ts';
import { Alert, Box, CircularProgress, Container, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Typography from '@mui/material/Typography';
import { IOrder } from '../../types';
import dayjs from 'dayjs';
import CustomPagination from '../../components/Pagination/Pagination.tsx';
import ClientOrdersItem from './ClientOrdersItem.tsx';
import { NavLink } from 'react-router-dom';
import { COLORS, FONTS } from '../../globalStyles/stylesObjects.ts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MyOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const loading = useAppSelector((state) => state.orders.isLoading);
  const error = useAppSelector((state) => state.orders.isError);
  const user = useAppSelector(selectUser);
  const guestEmail = localStorage.getItem('guestEmail');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [timeFilter, setTimeFilter] = useState<string>('All');


  useEffect(() => {
    const loadOrders = async () => {
      if (user?.token) {
        await dispatch(GetClientOrders());

        const guestEmail = localStorage.getItem('guestEmail');
        if (guestEmail && guestEmail === user.email) {
          await dispatch(transferGuestOrders(guestEmail));
          localStorage.removeItem('guestEmail');
          await dispatch(GetClientOrders());
        }
      } else {
        const guestEmail = localStorage.getItem('guestEmail');
        if (guestEmail) {
          await dispatch(GetGuestOrders(guestEmail));
        }
      }
    };
    loadOrders()
  }, [dispatch, user]);

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const handleTimeFilterChange = (event: SelectChangeEvent) => {
    setTimeFilter(event.target.value);
  };

  const filterByStatus = (order: IOrder) => {
    return statusFilter === 'All' || order.status === statusFilter;
  };

  const filterByTime = (order: IOrder) => {
    const orderDate = dayjs(order.createdAt);
    if (timeFilter === 'Today') {
      return orderDate.isSame(dayjs(), 'day');
    }
    if (timeFilter === 'Last7Days') {
      return orderDate.isAfter(dayjs().subtract(7, 'day'));
    }
    if (timeFilter === 'Last30Days') {
      return orderDate.isAfter(dayjs().subtract(30, 'day'));
    }
    return true;
  };
  const filteredOrders = orders.filter(order => filterByStatus(order) && filterByTime(order));

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          {error|| 'Ошибка при загрузке заказов'}
        </Alert>
      </Container>
    );
  }

  if (!user && !guestEmail) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          Для просмотра заказов необходимо авторизоваться или оформить заказ
        </Alert>
      </Container>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Container>
        <Typography>У вас пока нет заказов.</Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{my: 5, display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', position: 'relative'}}>
      <NavLink to={`/my_account/users/account/${user?.id}`} style={{
        position: 'absolute',
        left: 1,
        textDecoration: 'none',
        color: COLORS.success,
        fontSize: FONTS.size.lg,
        display: 'flex',
        alignItems: 'center'
      }}>
        <ArrowBackIcon sx={{fontSize: FONTS.size.lg, marginRight: 1}}/>
        Назад
      </NavLink>
      <Typography variant="h4" gutterBottom>
        Мои заказы
      </Typography>

      <Select
        value={statusFilter}
        onChange={handleStatusFilterChange}
        sx={{mb: 3, minWidth: 200}}
      >
        <MenuItem value="All">Все</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Confirmed">Confirmed</MenuItem>
        <MenuItem value="Packed">Packed</MenuItem>
        <MenuItem value="Shipped">Shipped</MenuItem>
        <MenuItem value="Delivered">Delivered</MenuItem>
        <MenuItem value="Returned">Returned</MenuItem>
      </Select>

      <Select
        value={timeFilter}
        onChange={handleTimeFilterChange}
        sx={{minWidth: 200}}
      >
        <MenuItem value="All">За всё время</MenuItem>
        <MenuItem value="Today">Сегодня</MenuItem>
        <MenuItem value="Last7Days">Последние 7 дней</MenuItem>
        <MenuItem value="Last30Days">Последние 30 дней</MenuItem>
      </Select>

      {loading ? (
        <CircularProgress/>
      ) : (
        <CustomPagination
          items={filteredOrders}
          renderItem={(item) => <ClientOrdersItem key={item.id} order={item}/>}
        />
      )}
    </Box>
  );
};

export default MyOrders;
