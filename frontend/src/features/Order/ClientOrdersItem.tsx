import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  CardMedia,
  Button,
  ListItemText,
  ListItem,
  List,
} from '@mui/material';
import { IOrder } from '../../types';
import dayjs from 'dayjs';
import { apiUrl } from '../../globalConstants.ts';
import { useAppDispatch } from '../../app/hooks.ts';
import { deleteOrder } from '../../store/orders/ordersThunk.ts';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Props {
  order: IOrder;
}

const OrderCard: React.FC<Props> = ({ order }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const totalAmount = order.items.reduce((sum, item) => sum + item.product.productPrice * item.quantity, 0);
  const cancelOrder = async() => {
      await dispatch(deleteOrder(String(order.id)));
      toast.success('Заказ отменен')
  }
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 4,
        overflow: 'hidden',
        mb: 3,
        maxWidth: '100%',
        minWidth: 350,
        width: '100%',
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Заказ №{order.id} — {dayjs(order.createdAt).format('DD.MM.YYYY HH:mm')}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Статус: <b>{order.status}</b>
        </Typography>

        <Divider sx={{ my: 2 }} />

        <List dense disablePadding sx={{ mb: 2 }}>
          {order.items.map((item) => (
            <ListItem
              key={item.id}
              onClick={() => navigate(`/product/${ item.product.id}`)}
              sx={{
                py: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                border: '1px solid #eee',
                marginBottom: 2,
                padding: 2,
              }}
            >
              <CardMedia
                component="img"
                image={apiUrl + '/' + item.product.productPhoto}
                alt={order.items[0]?.product.productName}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 2,
                  cursor: 'pointer',
                  mb: 2,
                  marginRight: 2,
                }}
              />
              <ListItemText
                primary={
                  <Typography variant="body1">
                    {item.product
                      ? `${item.product.productName} — ${item.quantity} × ${item.product.productPrice} сом`
                      : `Товар #${item.productId} — ${item.quantity} шт`}
                  </Typography>
                }
                secondary={
                  item.product?.productDescription && (
                    <Typography variant="caption" color="text.secondary">
                      {item.product.productDescription}
                    </Typography>
                  )
                }
              />
              {item.product && (
                <Typography variant="body1" fontWeight="bold">
                  {item.quantity * item.product.productPrice} сом
                </Typography>
              )}
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Итого: {totalAmount} сом
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={cancelOrder}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Отменить заказ
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
