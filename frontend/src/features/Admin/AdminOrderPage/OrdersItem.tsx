import React, { useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Box,
  Button,
  SelectChangeEvent,
  Select,
  MenuItem,
} from "@mui/material";
import {
  LocalShipping,
  Store,
  Person,
  Email,
  Phone,
  LocationOn,
  ShoppingBasket,
} from "@mui/icons-material";
import { IOrder } from "../../../types";
import { useAppDispatch } from "../../../app/hooks.ts";
import {
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
} from "../../../store/orders/ordersThunk.ts";
import { DeliveryMethod } from "../../Order/OrderForm.tsx";
import Swal from "sweetalert2";
import { enqueueSnackbar } from 'notistack';
import theme from '../../../globalStyles/globalTheme.ts';
import ReactHtmlParser from 'html-react-parser';

interface Props {
  order: IOrder;
}

export enum OrderStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Packed = "Packed",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Received = "Received",
  Canceled = "Canceled",
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
      await dispatch(
        updateOrderStatus({
          orderId: String(order.id),
          updatedStatus: selectedStatus,
        }),
      ).unwrap();
      await dispatch(getAllOrders());
      enqueueSnackbar('Статус заказа обновлен', { variant: 'success' });
      setIsEditingStatus(false);
    } catch {
      enqueueSnackbar('Ошибка при обновлении статуса', { variant: 'error' });
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

  const getStatusColor = (status: OrderStatus): 'error' | 'warning' | 'success' | 'info' | 'default' | 'primary' | 'secondary' => {
    const colorMap: Record<OrderStatus, 'error' | 'warning' | 'success' | 'info' | 'default' | 'primary' | 'secondary'> = {
      Canceled: 'error',
      Pending: 'warning',
      Confirmed: 'info',
      Packed: 'primary',
      Shipped: 'secondary',
      Delivered: 'success',
      Received: 'success',
    };

    return colorMap[status] || 'default';
  };


  const handleDelete = async () => {
    if (order.status !== "Delivered" && order.status !== "Received") return;

    const result = await Swal.fire({
      title: "Удалить заказ?",
      text: "Вы уверены, что хотите удалить этот заказ? Это действие необратимо.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.colors.warning,
      cancelButtonColor: theme.colors.OLIVE_GREEN,
      confirmButtonText: "Удалить",
      cancelButtonText: "Отмена",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteOrder(String(order.id))).unwrap();
        await dispatch(getAllOrders());
        enqueueSnackbar('Заказ успешно удалён!', { variant: 'success' });
      } catch (error) {
        console.error("Ошибка при удалении заказа:", error);
        enqueueSnackbar('Заказ не удалось удалить', { variant: 'success' });
      }
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        mb: 2,
        borderRadius: 2,
        width: "100%",
        minWidth: 250,
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        "@media (max-width: 1355px)": {
          flexBasis: "48%",
          maxWidth: "48%",
        },
        "@media (max-width: 955px)": {
          flexBasis: "75%",
          maxWidth: "75%",
        },
        "@media (max-width: 900px)": {
          flexBasis: "48%",
          maxWidth: "48%",
        },
        "@media (max-width: 875px)": {
          flexBasis: "100%",
          maxWidth: "100%",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" component="div">
              Заказ #{order.id}
            </Typography>
            <Chip
              label={translateOrderStatus(order.status as OrderStatus)}
              color={getStatusColor(order.status as OrderStatus)}
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
                disabled={
                  order.deliveryMethod === DeliveryMethod.PickUp &&
                  (selectedStatus === OrderStatus.Shipped ||
                    selectedStatus === OrderStatus.Delivered)
                }
              >
                <MenuItem value={OrderStatus.Pending}>В обработке</MenuItem>
                <MenuItem value={OrderStatus.Confirmed}>Подтвержден</MenuItem>
                <MenuItem value={OrderStatus.Packed}>Упакован</MenuItem>
                <MenuItem
                  value={OrderStatus.Shipped}
                  disabled={order.deliveryMethod === DeliveryMethod.PickUp}
                >
                  Отправлен
                </MenuItem>
                <MenuItem
                  value={OrderStatus.Delivered}
                  disabled={order.deliveryMethod === DeliveryMethod.PickUp}
                >
                  Доставлен
                </MenuItem>
                <MenuItem value={OrderStatus.Received}>Получен</MenuItem>
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  "@media (max-width: 1285px)": {
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1
                  },
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDelete}
                  disabled={
                    order.status !== "Delivered" && order.status !== "Received"
                  }
                  sx={{
                    "@media (max-width: 1285px)": {
                      width: "100%",
                    },
                  }}
                >
                  Удалить заказ
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditingStatus(true)}
                  disabled={order.status === OrderStatus.Canceled}
                  sx={{
                    "@media (max-width: 1285px)": {
                      width: "100%",
                    },
                  }}
                >
                  Изменить статус
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box mb={2}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  <LocationOn
                    fontSize="small"
                    color="action"
                    sx={{ verticalAlign: "middle", mr: 1 }}
                  />
                  Адрес: {order.address || "Не указан"}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {order.deliveryMethod === "Delivery" ? (
                    <LocalShipping
                      fontSize="small"
                      color="action"
                      sx={{ verticalAlign: "middle", mr: 1 }}
                    />
                  ) : (
                    <Store
                      fontSize="small"
                      color="action"
                      sx={{ verticalAlign: "middle", mr: 1 }}
                    />
                  )}
                  Способ получения:{" "}
                  {order.deliveryMethod === "Delivery"
                    ? "Доставка"
                    : "Самовывоз"}
                </Typography>
              </Box>

              <Box
                bgcolor="action.hover"
                borderRadius={1}
                sx={{
                  mb: 2,
                  p: 2,
                  "@media (max-width: 900px)": {
                    p: 1,
                  },
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  <Person
                    fontSize="small"
                    color="action"
                    sx={{ verticalAlign: "middle", mr: 1 }}
                  />
                  Клиент:
                </Typography>
                {order.userId ? (
                  <>
                    <Typography variant="body2">
                      {order.user?.firstName} {order.user?.secondName}
                    </Typography>
                    <Typography variant="body2">
                      <Email
                        fontSize="small"
                        color="action"
                        sx={{ verticalAlign: "middle", mr: 1 }}
                      />
                      {order.user?.email}
                    </Typography>
                    <Typography variant="body2">
                      <Phone
                        fontSize="small"
                        color="action"
                        sx={{ verticalAlign: "middle", mr: 1 }}
                      />
                      {order.user?.phone}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="body2">
                      {order.guestName} {order.guestLastName}
                    </Typography>
                    <Typography variant="body2">
                      <Email
                        fontSize="small"
                        color="action"
                        sx={{ verticalAlign: "middle", mr: 1 }}
                      />
                      {order.guestEmail}
                    </Typography>
                    <Typography variant="body2">
                      <Phone
                        fontSize="small"
                        color="action"
                        sx={{ verticalAlign: "middle", mr: 1 }}
                      />
                      {order.guestPhone}
                    </Typography>
                  </>
                )}
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                <ShoppingBasket
                  fontSize="small"
                  color="action"
                  sx={{ verticalAlign: "middle", mr: 1 }}
                />
                Товары:
              </Typography>

              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  maxHeight: 290,
                  mb: 2,
                }}
              >
                <List dense>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <ListItem key={item.id} sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={
                            <Typography variant="body2">
                              {`${item.productName} - ${item.quantity} шт × ${item.sales ? item.promoPrice?.toLocaleString('ru-RU').replace(/,/g, ' ') : item.productPrice?.toLocaleString('ru-RU').replace(/,/g, ' ')} сом ${item.sales ? `по акции ${item.promoPercentage}%` : ''}`}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {item.productDescription ? ReactHtmlParser(item.productDescription) : null}
                                {item.productId === null ? <span style={{color: 'red', marginTop: 1}}>Данный товар был удален!</span> : null}
                              </Typography>
                            </>
                          }
                        />
                        <Typography variant="body2" fontWeight="bold" sx={{ml: 1}}>
                          {(
                            item.quantity *
                            (item.sales
                                ? (item.promoPrice ?? 0)
                                : (item.productPrice ?? 0)
                            )
                          ).toLocaleString('ru-RU').replace(/,/g, ' ')} сом
                        </Typography>
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Нет товаров в заказе
                    </Typography>
                  )}
                </List>
              </Box>

              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" mt="auto">
                <Typography variant="subtitle1">Использовано бонусов:</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {order.bonusUsed ? order.bonusUsed.toLocaleString('ru-RU').replace(/,/g, ' ') : 0} сом
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt="auto">
                <Typography variant="subtitle1">Итого:</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {order.totalPrice.toLocaleString('ru-RU').replace(/,/g, ' ')} сом
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};

export default OrderAdminItem;
