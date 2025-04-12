import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getStatistics } from '../../../store/orders/ordersThunk';
import { Box, Typography } from '@mui/material';
import {  ResponsiveContainer, BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend } from 'recharts';
import AllOrder from './AllOrders.tsx';


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

  const data = [
    { id: 1, name: 'Самовывоз', value: orders.pickUpStatistic },
    { id: 1, name: 'Доставка', value: orders.deliveryStatistic },
  ];

  return (
    <div>
    <div style={{ display: 'flex', gap: '30px', alignItems: 'center', height: 300 }}>
      <div style={{ width: 300, height: 300 }}>
        <Box sx={{ width: '100%', height: 300, mt: 4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </div>

      <div>
        <Typography variant="h5">Статистика заказов</Typography>
        <Typography>
          Самовывоз: <span style={{ color: '#0088FE' }}>{orders.pickUpStatistic}</span>
        </Typography>
        <Typography>
          Доставка: <span style={{ color: '#00C49F' }}>{orders.deliveryStatistic}</span>
        </Typography>
      </div>
    </div>
      <div>
        <AllOrder/>
      </div>
    </div>
  );
};

export default OrderStats;
