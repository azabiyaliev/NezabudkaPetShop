import React from 'react';

import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Box
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

interface Props {
  order: IOrder;
}

const OrderAdminItem: React.FC<Props> = ({ order }) => {
  const getStatusColor = () => {
    switch (order.status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'inProcess':
        return 'info';
      case 'delivered':
        return 'primary';
      default:
        return 'default';
    }
  };

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
            order.items.map((item, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
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
      </CardContent>
    </Card>
  );
};

export default OrderAdminItem;