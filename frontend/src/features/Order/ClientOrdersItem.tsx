import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  CardMedia,
  Button,
  Chip,
} from '@mui/material';
import { IOrder } from '../../types';
import dayjs from 'dayjs';
import { apiUrl } from '../../globalConstants.ts';
import { useAppDispatch } from '../../app/hooks.ts';
import { GetClientOrders, GetGuestOrders, updateOrderStatus } from '../../store/orders/ordersThunk.ts';
import { useNavigate } from 'react-router-dom';
import { OrderStatus } from '../Admin/AdminOrderPage/OrdersItem.tsx';
import { COLORS, FONTS, SPACING } from '../../globalStyles/stylesObjects.ts';
import { enqueueSnackbar } from 'notistack';
import Swal from 'sweetalert2';
import theme from '../../globalStyles/globalTheme.ts';

interface Props {
  order: IOrder;
}

const OrderCard: React.FC<Props> = ({ order }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const totalAmount = order.items.reduce((sum, item) => sum + item.product.productPrice * item.quantity, 0);

  const cancelOrder = async () => {
    const result = await Swal.fire({
      title: "Отменить заказ?",
      text: "Вы уверены, что хотите отменить этот заказ? Это действие нельзя отменить.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.colors.warning,
      cancelButtonColor: theme.colors.OLIVE_GREEN,
      confirmButtonText: "Отменить заказ",
      cancelButtonText: "Отмена",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(updateOrderStatus({
          orderId: String(order.id),
          updatedStatus: OrderStatus.Canceled,
        }));
        await dispatch(GetClientOrders());
        await dispatch(GetGuestOrders(order.guestEmail));
        enqueueSnackbar('Заказ отменен', { variant: 'success' });
      } catch (error) {
        console.error("Ошибка при отмене заказа:", error);
        enqueueSnackbar('Не удалось отменить заказ', { variant: 'error' });
      }
    }
  };

  const translateOrderStatus = (status: OrderStatus): string => {
    const statusTranslations: Record<OrderStatus, string> = {
      Pending: 'В обработке',
      Confirmed: 'Подтвержден',
      Packed: 'Упакован',
      Shipped: 'Отправлен',
      Delivered: 'Доставлен',
      Received: 'Получен',
      Returned: 'Возвращен',
      Canceled: 'Отменен'
    };

    return statusTranslations[status] || status;
  };


  const getStatusColor = (status: OrderStatus): 'error' | 'warning' | 'success' | 'info' | 'default' | 'primary' | 'secondary' => {
    const colorMap: Record<OrderStatus, 'error' | 'warning' | 'success' | 'info' | 'default' | 'primary' | 'secondary'> = {
      Canceled: 'error',
      Pending: 'warning',
      Confirmed: 'info',
      Packed: 'primary',
      Shipped: 'secondary',
      Delivered: 'success',
      Received: 'success',
      Returned: 'error'
    };

    return colorMap[status] || 'default';
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 4,
        overflow: 'hidden',
        mb: 3,
        maxWidth: '700px',
        width: '100%',
        backgroundColor: COLORS.white,
        mx: 'auto',
        '@media (max-width: 750px)': {
          width: '80%',
        },
        '@media (max-width: 480px)': {
          mb: 2,
          width: '50%',
        },
        '@media (max-width: 365px)': {
          width: '50%',
        }
      }}
    >
      <CardContent
        sx={{
          p: SPACING.md,
          '@media (max-width: 768px)': {
            p: SPACING.sm,
          },
          '@media (max-width: 480px)': {
            p: SPACING.xs,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: SPACING.sm,
            gap: SPACING.xs,
            overflowX: 'hidden',
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              color: COLORS.text,
              fontSize: { xs: FONTS.size.lg, sm: FONTS.size.xl },
              lineHeight: 1.2,
              wordWrap: 'break-word',
            }}
          >
            Заказ №{order.id} — {dayjs(order.createdAt).format('DD.MM.YYYY')}
          </Typography>

          <Chip
            label={translateOrderStatus(order.status as OrderStatus)}
            color={getStatusColor(order.status as OrderStatus)}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.9rem' },
              height: 'auto',
              mt: { xs: 1, sm: 0 },
              py: 0.5,
              px: 1.5,
            }}
          />
        </Box>

        <Divider sx={{ my: SPACING.sm }} />

        <Box
          sx={{
            mb: SPACING.sm,
            maxHeight: 155,
            overflowY: 'auto',
            border: `1px solid ${COLORS.BORDER_CART}`,
            borderRadius: 2,
            p: SPACING.xs,
            backgroundColor: COLORS.rgbaGrey,
            '@media (max-width: 480px)': {
              border: 'none',
              backgroundColor: COLORS.white,
              px: 0,
            },
          }}
        >
          {order.items.map((item) => (
            <Box
              key={item.id}
              onClick={() => navigate(`/product/${item.product.id}`)}
              sx={{
                p: SPACING.sm,
                mb: SPACING.xs,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                cursor: 'pointer',
                border: `1px solid ${COLORS.BORDER_CART}`,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 4px 6px ${COLORS.DARK_GRAY}`,
                  backgroundColor: COLORS.background,
                },
                '@media (max-width: 480px)': {
                  border: 'none',
                  borderBottom: `1px solid ${COLORS.BORDER_CART}`,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  p: SPACING.xs,
                },
              }}
            >
              <CardMedia
                component="img"
                image={apiUrl + '/' + item.product.productPhoto}
                alt={item.product.productName}
                sx={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 2,
                  flexShrink: 0,
                  mr: SPACING.sm,
                  '@media (max-width: 480px)': {
                    width: '60px',
                    height: '60px',
                    mb: SPACING.xs,
                    mr: SPACING.xs,
                  },
                }}
              />

              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <Typography
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: FONTS.weight.medium,
                    fontSize: { xs: FONTS.size.default, sm: FONTS.size.lg },
                    color: COLORS.text,
                  }}
                >
                  {item.product.productName}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: SPACING.xs,
                    '@media (max-width: 480px)': {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: SPACING.xs,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: FONTS.size.xs, sm: FONTS.size.sm },
                      color: COLORS.DARK_GRAY,
                    }}
                  >
                    {item.quantity} × {item.product.productPrice} сом
                  </Typography>

                  <Typography
                    fontWeight="bold"
                    sx={{
                      color: COLORS.text,
                      fontSize: { xs: FONTS.size.default, sm: FONTS.size.lg },
                    }}
                  >
                    {item.quantity * item.product.productPrice} сом
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Divider sx={{ my: SPACING.sm }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: SPACING.sm,
            width: '100%',
            '@media (max-width: 480px)': {
              alignItems: 'flex-start',
            },
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              color: COLORS.text,
              fontSize: { xs: FONTS.size.lg, sm: FONTS.size.xl },
            }}
          >
            Итого: {totalAmount} сом
          </Typography>

          <Button
            variant="contained"
            color="error"
            onClick={cancelOrder}
            sx={{
              textTransform: 'none',
              backgroundColor: COLORS.warning,
              px: SPACING.md,
              py: SPACING.xs,
              borderRadius: SPACING.xs,
              fontSize: { xs: FONTS.size.default, sm: FONTS.size.lg },
              width: { xs: '100%', sm: 'auto' },
            }}
            disabled={order.status === OrderStatus.Canceled}
          >
            Отменить заказ
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
