import React from 'react';
import { Card, CardContent, Typography, Divider, Box, CardMedia, Button } from '@mui/material';
import { IOrder } from '../../types';
import dayjs from 'dayjs';
import { apiUrl } from '../../globalConstants.ts';
import { useAppDispatch } from '../../app/hooks.ts';
import { deleteOrder } from '../../store/orders/ordersThunk.ts';
import { toast } from 'react-toastify';

interface Props {
  order: IOrder;
}

const OrderCard: React.FC<Props> = ({ order }) => {
  const dispatch = useAppDispatch();
  const totalAmount = order.items.reduce((sum, item) => sum + item.product.productPrice * item.quantity, 0);

  const cancelOrder = async() => {
      await dispatch(deleteOrder(String(order.id)));
      toast.success('Заказ отменен')
  }
  return (
    <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Заказ №{order.id} — {dayjs(order.createdAt).format('DD.MM.YYYY HH:mm')}
        </Typography>
        <CardMedia
          component="img"
          height="250"
          image={apiUrl + '/' + String(order.items.map(i => i.product.productPhoto))}
          alt={String(order.items.map(i => i.product.productName))}
        />
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Статус: {order.status}
        </Typography>
        <Divider sx={{ my: 1 }} />
        {order.items.map((item) => (
          <Box key={item.id} sx={{ mb: 1 }}>
            <Typography>
              {item.product.productName} — {item.quantity} шт. × {item.product.productPrice} сом
            </Typography>
          </Box>
        ))}
        <Divider sx={{ my: 1 }} />
        <Typography fontWeight="bold">Итого: {totalAmount} сом</Typography>

        <Button
          sx={{backgroundColor: 'red', color: 'white', borderRadius: '10px' }}
          onClick={cancelOrder}>Отменить</Button>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
