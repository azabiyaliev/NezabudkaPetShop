import React, { useState } from 'react';

import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Box, Button, SelectChangeEvent, Select, MenuItem
} from '@mui/material';
import {
  LocalShipping,
  Store,
  Person,
  Email,
  Phone,
  LocationOn,
  ShoppingBasket
} from '@mui/icons-material';
import { IOrder } from '../../../types';
import { useAppDispatch } from '../../../app/hooks.ts';
import { deleteOrder, getAllOrders, updateOrderStatus } from '../../../store/orders/ordersThunk.ts';
import { toast } from 'react-toastify';

interface Props {
  order: IOrder;
}

enum OrderStatus {
  Pending = 'Pending',
Confirmed = 'Confirmed',
Packed = 'Packed',
Shipped = 'Shipped',
Delivered = 'Delivered',
Returned = 'Returned',
Canceled = 'Canceled',
}

const OrderAdminItem: React.FC<Props> = ({ order }) => {
  const dispatch = useAppDispatch();
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const handleStatusChange = (e: SelectChangeEvent) => {
    setSelectedStatus(e.target.value);
  };

  const handleSaveStatus = async () => {
    try {
      await dispatch(updateOrderStatus({
        orderId: String(order.id),
        updatedStatus: selectedStatus
      })).unwrap();
      await dispatch(getAllOrders())
      setIsEditingStatus(false);
      toast.success('Статус заказа обновлен');
    } catch {
      toast.error('Ошибка при обновлении статуса');
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'Canceled':
      case 'Returned':
        return 'error';
      case 'Pending':
        return 'warning';
      case 'Confirmed':
        return 'info';
      case 'Packed':
        return 'primary';
      case 'Shipped':
        return 'secondary';
      case 'Delivered':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleDelete = async () => {
    if (order.status === 'Delivered') {
      await dispatch(deleteOrder(String(order.id)));
      await dispatch(getAllOrders());
      toast.success('Заказ удалён');
    }
  }

  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        borderRadius: 2,
        '&:hover': {
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="div">
            Заказ #{order.id}
          </Typography>
          <Chip
            label={order.status}
            color={getStatusColor()}
            size="small"
          />
        </Box>

        {isEditingStatus ? (
            <Box display="flex" alignItems="center">
              <Select
                value={selectedStatus}
                onChange={handleStatusChange}
                size="small"
                sx={{ mr: 1, minWidth: 120 }}
              >
                <MenuItem value={OrderStatus.Pending}>В обработке</MenuItem>
                <MenuItem value={OrderStatus.Confirmed}>Подтвержден</MenuItem>
                <MenuItem value={OrderStatus.Packed}>Упакован</MenuItem>
                <MenuItem value={OrderStatus.Shipped}>Отправлен</MenuItem>
                <MenuItem value={OrderStatus.Delivered}>Доставлен</MenuItem>
                <MenuItem value={OrderStatus.Canceled}>Отменен</MenuItem>
              </Select>
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveStatus}
                sx={{ mr: 1 }}
              >
                Сохранить
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsEditingStatus(false)}
              >
                Отмена
              </Button>
            </Box>
          ) : (
            <>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          disabled={order.status !== 'Delivered'}
          sx={{
            marginRight: '20px'
          }}
        >
          Удалить заказ
        </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsEditingStatus(true)}
              >
                Изменить статус
              </Button>

        <Divider sx={{ my: 2 }} />

        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <LocationOn fontSize="small" color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
            Адрес: {order.address || 'Не указан'}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary">
            {order.deliveryMethod === 'Delivery' ? (
              <LocalShipping fontSize="small" color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
            ) : (
              <Store fontSize="small" color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
            )}
            Способ получения: {order.deliveryMethod === 'Delivery' ? 'Доставка' : 'Самовывоз'}
          </Typography>
        </Box>

        <Box mb={2} p={2} bgcolor="action.hover" borderRadius={1}>
          <Typography variant="subtitle1" gutterBottom>
            <Person fontSize="small" color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
            Клиент:
          </Typography>
          {order.userId ? (
            <>
              <Typography variant="body2">
                {order.user?.firstName} {order.user?.secondName}
              </Typography>
              <Typography variant="body2">
                <Email fontSize="small" color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
                {order.user?.email}
              </Typography>
              <Typography variant="body2">
                <Phone fontSize="small" color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
                {order.user?.phone}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body2">
                {order.guestName} {order.guestLastName}
              </Typography>
              <Typography variant="body2">
                <Email fontSize="small" color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
                {order.guestEmail}
              </Typography>
              <Typography variant="body2">
                <Phone fontSize="small" color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
                {order.guestPhone}
              </Typography>
            </>
          )}
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          <ShoppingBasket fontSize="small" color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Товары:
        </Typography>

        <List dense>
          {order.items && order.items.length > 0 ? (
            order.items.map((item) => (
              <ListItem key={item.id} sx={{ py: 0.5 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      {item.product ? (
                        `${item.product.productName} - ${item.quantity}шт × ${item.product.productPrice} сом`
                      ) : (
                        `Товар #${item.productId} - ${item.quantity} шт`
                      )}
                    </Typography>
                  }
                  secondary={item.product?.productDescription && (
                    <Typography variant="caption" color="text.secondary">
                      {item.product.productDescription}
                    </Typography>
                  )}
                />
                {item.product && (
                  <Typography variant="body2" fontWeight="bold">
                    {item.quantity * item.product.productPrice} сом
                  </Typography>
                )}
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Нет товаров в заказе
            </Typography>
          )}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between">
          <Typography variant="subtitle1">
            Итого:
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            {order.items?.reduce((sum, item) => {
              return sum + (item.product ? item.quantity * item.product.productPrice : 0);
            }, 0)} сом
          </Typography>
        </Box>
            </>
      )}
      </CardContent>
    </Card>
  );
};

export default OrderAdminItem;