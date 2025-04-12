import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getAllOrders } from '../../../store/orders/ordersThunk';
import { Box, Button, Typography } from '@mui/material';
import OrderAdminItem from './OrdersItem.tsx';
import Grid from '@mui/material/Grid2';

const AllOrders = () => {
  const dispatch = useAppDispatch();
  const { data, meta } = useAppSelector((state) => state.orders.paginationOrders) || { data: [], meta: { total: 0, perPage: 10, currentPage: 1, lastPage: 1 } };
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllOrders(page));
  }, [dispatch, page]);

  if (!data) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <>
    <Grid
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
        gap: 2,
        width: '100%',
      }}
    >
      {data.map((item) => (
        <OrderAdminItem key={item.id} order={item} />
      ))}
    </Grid>
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
