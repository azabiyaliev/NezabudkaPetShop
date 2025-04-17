import React from 'react';
import { Card, CardContent, Typography, Divider, Box } from '@mui/material';
import { IOrder } from '../../types';
import dayjs from 'dayjs';

interface Props {
  order: IOrder;
}

const OrderCard: React.FC<Props> = ({ order }) => {
  const totalAmount = order.items.reduce((sum, item) => sum + item.orderAmount, 0);

  return (
    <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Заказ №{order.id} — {dayjs(order.createdAt).format('DD.MM.YYYY HH:mm')}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Статус: {order.status}
        </Typography>
        <Divider sx={{ my: 1 }} />
        {order.items.map((item, idx) => (
          <Box key={idx} sx={{ mb: 1 }}>
            <Typography>
              {item.product.title} — {item.quantity} шт. × {item.product.productPrice} сом
            </Typography>
          </Box>
        ))}
        <Divider sx={{ my: 1 }} />
        <Typography fontWeight="bold">Итого: {totalAmount} сом</Typography>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
