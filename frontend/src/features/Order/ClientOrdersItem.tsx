import { Box, Button, Card, CardContent, CardMedia, Chip, Divider, Typography } from '@mui/material';
import theme from '../../globalStyles/globalTheme.ts';
import { COLORS, FONTS, SPACING } from '../../globalStyles/stylesObjects.ts';
import dayjs from 'dayjs';
import { useAppDispatch } from '../../app/hooks.ts';
import { useNavigate } from 'react-router-dom';
import { IOrder } from '../../types';
import { GetClientOrders, GetGuestOrders, updateOrderStatus } from '../../store/orders/ordersThunk.ts';
import { OrderStatus } from '../Admin/AdminOrderPage/OrdersItem.tsx';
import { enqueueSnackbar } from 'notistack';
import Swal from 'sweetalert2';
import { apiUrl } from '../../globalConstants.ts';
import Grid from '@mui/material/Grid2';

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
      confirmButtonColor: COLORS.warning,
      cancelButtonColor: COLORS.OLIVE_GREEN,
      confirmButtonText: "Да, отменить",
      cancelButtonText: "Нет, оставить",
      customClass: {
        popup: 'beautiful-sweetalert',
      }
    });

    if (result.isConfirmed) {
      try {
        await dispatch(updateOrderStatus({
          orderId: String(order.id),
          updatedStatus: OrderStatus.Canceled,
        }));
        if (order.guestEmail) {
          await dispatch(GetGuestOrders(order.guestEmail));
        } else {
          await dispatch(GetClientOrders());
        }
        enqueueSnackbar('Заказ успешно отменен', { variant: 'success' });
      } catch (error) {
        console.error("Ошибка при отмене заказа:", error);
        enqueueSnackbar('Не удалось отменить заказ. Попробуйте позже.', { variant: 'error' });
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
      Canceled: 'Отменен'
    };
    return statusTranslations[status] || status;
  };

  const getStatusChipProps = (status: OrderStatus): { label: string; color: 'error' | 'warning' | 'success' | 'info' | 'primary' | 'secondary' | 'default'; variant: 'filled' | 'outlined' } => {
    const translatedStatus = translateOrderStatus(status);
    switch (status) {
      case OrderStatus.Canceled:
        return { label: translatedStatus, color: 'error', variant: 'filled' };
      case OrderStatus.Pending:
        return { label: translatedStatus, color: 'warning', variant: 'outlined' };
      case OrderStatus.Confirmed:
      case OrderStatus.Packed:
        return { label: translatedStatus, color: 'info', variant: 'outlined' };
      case OrderStatus.Shipped:
        return { label: translatedStatus, color: 'primary', variant: 'outlined' };
      case OrderStatus.Delivered:
      case OrderStatus.Received:
        return { label: translatedStatus, color: 'success', variant: 'filled' };
      default:
        return { label: translatedStatus, color: 'default', variant: 'outlined' };
    }
  };

  const statusChipProps = getStatusChipProps(order.status as OrderStatus);

  return (
    <Card
      sx={{
        height: 'auto',
        borderRadius: '15px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        mb: SPACING.md,
        backgroundColor: COLORS.white,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
        },
        borderLeft: `5px solid ${statusChipProps.color === 'error' ? COLORS.warning : COLORS.primary}`,
      }}
    >
      <CardContent sx={{
        p: { xs: SPACING.sm, md: SPACING.md },
        '@media (max-width: 754px)': {
          p: SPACING.xs,
        },
      }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: SPACING.sm,
            gap: SPACING.xs,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            fontWeight={FONTS.weight.bold}
            sx={{
              color: COLORS.DARK_GREEN,
              fontSize: { xs: FONTS.size.lg, sm: FONTS.size.default },
              '@media (max-width: 754px)': {
                fontSize: FONTS.size.sm,
              },
            }}
          >
            Заказ №{order.id}
          </Typography>
          <Chip
            label={statusChipProps.label}
            color={statusChipProps.color}
            variant={statusChipProps.variant}
            size="small"
            sx={{
              fontSize: FONTS.size.sm,
              height: 'auto',
              py: 0.5,
              px: 1.5,
              borderRadius: '15px',
              '@media (max-width: 754px)': {
                fontSize: FONTS.size.xs,
              },
            }}
          />
        </Box>

        <Typography variant="body2" color={COLORS.text} sx={{
          mb: SPACING.sm,
          fontSize: { xs: FONTS.size.xs, sm: FONTS.size.sm },
        }}>
          Дата оформления: {dayjs(order.createdAt).format('DD MMMM YYYY, HH:mm')}
        </Typography>

        <Divider sx={{ my: SPACING.sm, borderColor: COLORS.DARK_GRAY }} />

        <Typography variant="subtitle1" fontWeight={FONTS.weight.medium} sx={{
          mb: SPACING.xs,
          color: COLORS.text,
          fontSize: { xs: FONTS.size.sm, sm: FONTS.size.default },
        }}>
          Товары в заказе:
        </Typography>

        <Box
          sx={{
            maxHeight: { xs: 150, sm: 135 },
            overflowY: 'auto',
            pr: 1,
          }}
        >
          {order.items.map((item) => (
            <Box
              key={item.id}
              onClick={() => navigate(`/product/${item.product.id}`)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: { xs: SPACING.xs, sm: SPACING.sm },
                mb: SPACING.xs,
                borderRadius: { xs: '10px', sm: '150px' },
                transition: 'background-color 0.2s ease',
                cursor: 'pointer',
                backgroundColor: COLORS.white,
                '&:hover': {
                  backgroundColor: COLORS.LIGHT_GREEN,
                },
                border: `1px solid ${COLORS.success}`,
              }}
            >
              <CardMedia
                component="img"
                image={apiUrl + '/' + item.product.productPhoto}
                alt={item.product.productName}
                sx={{
                  width: { xs: '50px', sm: '80px' },
                  height: { xs: '50px', sm: '80px' },
                  borderRadius: '10px',
                  mr: { xs: SPACING.xs, sm: SPACING.sm },
                }}
              />
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <Typography
                  title={item.product.productName}
                  sx={{
                    fontWeight: FONTS.weight.medium,
                    fontSize: { xs: FONTS.size.xs, sm: FONTS.size.default },
                    color: COLORS.text,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    mb: 0.5,
                    width: '100%',
                    "@media (max-width: 754px)": {
                      maxWidth: '300px',
                    },
                    "@media (max-width: 454px)": {
                      maxWidth: '200px',
                    },
                  }}
                >
                  {item.product.productName}
                </Typography>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid>
                    <Typography
                      sx={{
                        fontSize: { xs: FONTS.size.xs, sm: FONTS.size.sm },
                        color: COLORS.DARK_GREEN,
                      }}
                    >
                      {item.quantity} шт. × {item.product.productPrice} сом
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography
                      fontWeight={FONTS.weight.bold}
                      sx={{
                        color: COLORS.primary,
                        fontSize: { xs: FONTS.size.xs, sm: FONTS.size.default },
                      }}
                    >
                      {item.quantity * item.product.productPrice} сом
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: SPACING.sm, borderColor: COLORS.DARK_GRAY }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: SPACING.sm,
            mt: SPACING.sm,
          }}
        >
          <Box>
            <Typography
              variant="body1"
              sx={{
                color: COLORS.text,
                fontSize: { xs: FONTS.size.xs, sm: FONTS.size.sm },
              }}
            >
              Сумма заказа:
            </Typography>
            <Typography
              variant="h6"
              component="div"
              fontWeight={FONTS.weight.bold}
              sx={{
                color: COLORS.DARK_GREEN,
                fontSize: { xs: FONTS.size.default, sm: FONTS.size.big_default },
              }}
            >
              {totalAmount} сом
            </Typography>
          </Box>

          {order.status !== OrderStatus.Canceled &&
            order.status !== OrderStatus.Delivered &&
            order.status !== OrderStatus.Received && (
              <Button
                variant="contained"
                onClick={cancelOrder}
                disabled={order.status === OrderStatus.Canceled}
                sx={{
                  backgroundColor: COLORS.warning,
                  color: COLORS.white,
                  '&:hover': {
                    backgroundColor: theme.colors.error || '#C62828',
                  },
                  textTransform: 'none',
                  fontWeight: FONTS.weight.medium,
                  borderRadius: '15px',
                  fontSize: { xs: FONTS.size.xs, sm: FONTS.size.default },
                  width: { xs: '100%', sm: 'auto' },
                  minWidth: { xs: 'unset', sm: '180px' },
                }}
              >
                Отменить заказ
              </Button>
            )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCard;