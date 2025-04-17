import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectUser } from '../../store/users/usersSlice.ts';
import { useEffect } from 'react';
import { GetClientOrders, GetGuestOrders, transferGuestOrders } from '../../store/orders/ordersThunk.ts';
import { Alert, CircularProgress, Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import OrderCard from './ClientOrdersItem.tsx';

const MyOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const loading = useAppSelector((state) => state.orders.isLoading);
  const error = useAppSelector((state) => state.orders.isError);
  const user = useAppSelector(selectUser);
  const guestEmail = localStorage.getItem('guestEmail');

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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>У вас пока нет заказов.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Мои заказы
      </Typography>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </Container>
  );
};

export default MyOrders;
