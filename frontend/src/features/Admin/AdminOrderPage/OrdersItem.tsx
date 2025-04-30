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
import { DeliveryMethod } from '../../Order/OrderForm.tsx';

interface Props {
  order: IOrder;
}

export enum OrderStatus {
  Pending = 'Pending',
Confirmed = 'Confirmed',
Packed = 'Packed',
Shipped = 'Shipped',
Delivered = 'Delivered',
  Received = 'Received',
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
        case 'Received':
          return 'success';
      default:
        return 'default';
    }
  };

  const handleDelete = async () => {
    if (order.status === 'Delivered' || order.status === 'Received') {
      await dispatch(deleteOrder(String(order.id)));
      await dispatch(getAllOrders());
      toast.success('Заказ удалён');
    }
  }

  return (
    <Card
      elevation={2}
      sx={{
        mb: 2,
        borderRadius: 2,
        height: 360,
        width: '30%',
        '&:hover': { boxShadow: 3 },
        p: 1
      }}
    >
      <CardContent sx={{ p: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1">
            Заказ #{order.id}
          </Typography>
          <Chip
            label={order.status}
            color={getStatusColor()}
            size="small"
          />
        </Box>

        {isEditingStatus ? (
          <Box display="flex" alignItems="center" mb={1}>
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              size="small"
              sx={{ mr: 1, minWidth: 110 }}
            >
              <MenuItem value={OrderStatus.Pending}>В обработке</MenuItem>
              <MenuItem value={OrderStatus.Confirmed}>Подтвержден</MenuItem>
              <MenuItem value={OrderStatus.Packed}>Упакован</MenuItem>
              {order.deliveryMethod === DeliveryMethod.Delivery && (
                <>
                  <MenuItem value={OrderStatus.Shipped}>Отправлен</MenuItem>
                  <MenuItem value={OrderStatus.Delivered}>Доставлен</MenuItem>
                </>
              )}
              <MenuItem value={OrderStatus.Received}>Получен</MenuItem>
            </Select>

            <Button variant="contained" size="small" onClick={handleSaveStatus} sx={{ mr: 1 }}>
              Сохранить
            </Button>
            <Button variant="outlined" size="small" onClick={() => setIsEditingStatus(false)}>
              Отмена
            </Button>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              disabled={order.status !== 'Delivered' && order.status !== 'Received'}
              size="small"
            >
              Удалить
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsEditingStatus(true)}
            >
              Изменить статус
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        <Typography variant="caption" display="block" gutterBottom>
          <LocationOn fontSize="inherit" sx={{ mr: 0.5 }} />
          {order.address || 'Адрес не указан'}
        </Typography>

        <Typography variant="caption" display="block" gutterBottom>
          {order.deliveryMethod === 'Delivery' ? (
            <LocalShipping fontSize="inherit" sx={{ mr: 0.5 }} />
          ) : (
            <Store fontSize="inherit" sx={{ mr: 0.5 }} />
          )}
          {order.deliveryMethod === 'Delivery' ? 'Доставка' : 'Самовывоз'}
        </Typography>

        <Box mt={1} mb={1}>
          <Typography variant="caption" fontWeight="bold" gutterBottom>
            <Person fontSize="inherit" sx={{ mr: 0.5 }} />
            Клиент:
          </Typography>
          {order.userId ? (
            <>
              <Typography variant="caption">{order.user?.firstName} {order.user?.secondName}</Typography><br/>
              <Typography variant="caption"><Email fontSize="inherit" sx={{ mr: 0.5 }} />{order.user?.email}</Typography><br/>
              <Typography variant="caption"><Phone fontSize="inherit" sx={{ mr: 0.5 }} />{order.user?.phone}</Typography>
            </>
          ) : (
            <>
              <Typography variant="caption">{order.guestName} {order.guestLastName}</Typography><br/>
              <Typography variant="caption"><Email fontSize="inherit" sx={{ mr: 0.5 }} />{order.guestEmail}</Typography><br/>
              <Typography variant="caption"><Phone fontSize="inherit" sx={{ mr: 0.5 }} />{order.guestPhone}</Typography>
            </>
          )}
        </Box>

        <Typography variant="caption" fontWeight="bold" gutterBottom>
          <ShoppingBasket fontSize="inherit" sx={{ mr: 0.5 }} />
          Товары:
        </Typography>

        <List dense sx={{ pt: 0 }}>
          {order.items?.length ? order.items.map((item) => (
            <ListItem key={item.id} sx={{ py: 0.5 }}>
              <ListItemText
                primary={
                  <Typography variant="caption">
                    {item.product
                      ? `${item.product.productName} - ${item.quantity} × ${item.product.productPrice} сом`
                      : `Товар #${item.productId} - ${item.quantity} шт`}
                  </Typography>
                }
              />
              {item.product && (
                <Typography variant="caption" fontWeight="bold">
                  {item.quantity * item.product.productPrice} сом
                </Typography>
              )}
            </ListItem>
          )) : (
            <Typography variant="caption" color="text.secondary">Нет товаров</Typography>
          )}
        </List>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">Итого:</Typography>
          <Typography variant="body2" fontWeight="bold">
            {order.items?.reduce((sum, item) => (
              sum + (item.product ? item.quantity * item.product.productPrice : 0)
            ), 0)} сом
          </Typography>
        </Box>
      </CardContent>
    </Card>

  );
};

export default OrderAdminItem;