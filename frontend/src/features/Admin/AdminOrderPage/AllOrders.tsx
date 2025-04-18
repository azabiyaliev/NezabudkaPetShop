import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getAllOrders } from '../../../store/orders/ordersThunk';
import { Box, Button, CircularProgress, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import OrderAdminItem from './OrdersItem.tsx';
import dayjs from 'dayjs';
import { IOrder } from '../../../types';

const AllOrders = () => {
  const dispatch = useAppDispatch();
  const { data, meta } = useAppSelector((state) => state.orders.paginationOrders) ||
  { data: [],
    meta: {
    total: 0,
      perPage: 10,
      currentPage: 1,
      lastPage: 1
  }
  };
  const [page, setPage] = useState(1);
  const orders = useAppSelector((state) => state.orders.orders);
  const loading = useAppSelector((state) => state.orders.isLoading);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [timeFilter, setTimeFilter] = useState<string>('All');

  useEffect(() => {
    dispatch(getAllOrders(page));
  }, [dispatch, page]);

  if (!data) {
    return <CircularProgress />;
  }

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

  return (
    <>
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>Заказы</Typography>

        <Select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          sx={{ mb: 3, minWidth: 200 }}
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
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="All">За всё время</MenuItem>
          <MenuItem value="Today">Сегодня</MenuItem>
          <MenuItem value="Last7Days">Последние 7 дней</MenuItem>
          <MenuItem value="Last30Days">Последние 30 дней</MenuItem>
        </Select>

        {loading ? (
          <CircularProgress />
        ) : (
          filteredOrders.map((order) => (
            <OrderAdminItem key={order.id} order={order} />
          ))
        )}
      </Box>
  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
    <Button
      variant="contained"
      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
      disabled={page === 1}
    >
      Назад
    </Button>

    <Typography sx={{ alignSelf: 'center' }}>
      Страница {meta.currentPage} из {meta.lastPage}
    </Typography>

    <Button
      variant="contained"
      onClick={() => setPage((prev) => Math.min(prev + 1, meta.lastPage))}
      disabled={page === meta.lastPage}
    >
      Вперёд
    </Button>
  </Box>
    </>
  );
};

export default AllOrders;
