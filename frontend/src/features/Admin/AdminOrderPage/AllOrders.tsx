import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getAllOrders } from '../../../store/orders/ordersThunk';
import { Box, Button, CircularProgress, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import OrderAdminItem from './OrdersItem.tsx';

const AllOrders = () => {
  const dispatch = useAppDispatch();
  const { data, meta } = useAppSelector((state) => state.orders.paginationOrders) || { data: [], meta: { total: 0, perPage: 10, currentPage: 1, lastPage: 1 } };
  const [page, setPage] = useState(1);
  const orders = useAppSelector((state) => state.orders.orders);
  const loading = useAppSelector((state) => state.orders.isLoading);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    dispatch(getAllOrders(page));
  }, [dispatch, page]);

  if (!data) {
    return <CircularProgress />;
  }

  const handleFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  return (
    <>
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>Заказы</Typography>

        <Select
          value={statusFilter}
          onChange={handleFilterChange}
          sx={{ mb: 3, minWidth: 200 }}
        >
          <MenuItem value="All">Все</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Confirmed">Confirmed</MenuItem>
          <MenuItem value="Packed">Packed</MenuItem>
          <MenuItem value="Shipped">Shipped</MenuItem>
          <MenuItem value="Delivered">Delivered</MenuItem>
          <MenuItem value="Returned">Returned</MenuItem>
          <MenuItem value="Canceled">Canceled</MenuItem>
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
