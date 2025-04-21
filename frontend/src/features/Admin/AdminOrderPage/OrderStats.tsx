import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getStatistics } from '../../../store/orders/ordersThunk';
import ColumnChart from '../../../components/UI/ColumnChart/ColumnChart.tsx';
import { DataGrid, gridClasses, GridToolbar } from '@mui/x-data-grid';
import { Box, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';

const OrderStats = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orderStats);

  useEffect(() => {
    dispatch(getStatistics());

    const interval = setInterval(() => {
      dispatch(getStatistics());
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (!orders) {
    return <div>Загрузка...</div>;
  }

  const percentageCount = (a: number, b: number) => {
    if (b === 0) return '0';
    return ((a / b) * 100).toFixed(1);
  };

  const totalOrderTypes = orders.deliveryStatistic + orders.pickUpStatistic + orders.canceledOrderCount;
  const totalPayments = orders.paymentByCard + orders.paymentByCash;
  const totalBonuses = orders.bonusUsage;

  const rows = [
    {id: 1, name: "Доставка", count: orders.deliveryStatistic, percentage: `${percentageCount(orders.deliveryStatistic, totalOrderTypes)}%`},
    {id: 2, name: "Самовывоз", count: orders.pickUpStatistic, percentage: `${percentageCount(orders.pickUpStatistic, totalOrderTypes)}%`},
    {id: 3, name: "Оплата картой", count: orders.paymentByCard, percentage: `${percentageCount(orders.paymentByCard, totalPayments)}%`},
    {id: 4, name: "Оплата наличными", count: orders.paymentByCash, percentage: `${percentageCount(orders.paymentByCash, totalPayments)}%`},
    {id: 5, name: "Пользование бонусами", count: orders.bonusUsage, percentage: `${percentageCount(orders.bonusUsage, totalBonuses)}%`},
    {id: 6, name: "Общее кол-во заказов", count: orders.totalOrders, percentage: `100%`},
    {id: 7, name: "Отмененные заказы", count: orders.canceledOrderCount, percentage: `${percentageCount(orders.canceledOrderCount, totalOrderTypes)}%`},
  ];

  const columns = [
    { field: 'name', headerName: 'Название', flex: 1 },
    { field: 'count', headerName: 'Количество', flex: 1 },
    { field: 'percentage', headerName: 'Проценты', flex: 1 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 4,
          fontWeight: 600,
        }}
      >
        Статистика заказов
      </Typography>

      <Paper
        elevation={3}
        sx={{
          mb: 4,
          p: 2,
          borderRadius: '12px',
        }}
      >
        <ColumnChart stats={orders} />
      </Paper>

      <Paper
        elevation={3}
        sx={{
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          slots={{
            toolbar: GridToolbar,
          }}
          sx={{
            [`& .${gridClasses.cell}`]: {
              py: 2,
            },
            [`& .bold-cell`]: {
              fontWeight: 500,
            },
            '& .MuiDataGrid-toolbarContainer': {
              p: 2,
              pb: 0,
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default OrderStats;
