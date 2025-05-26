import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectUser } from "../../store/users/usersSlice.ts";
import { useEffect, useState } from "react";
import {
  GetClientOrders,
  GetGuestOrders,
  transferGuestOrders,
} from "../../store/orders/ordersThunk.ts";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { IOrder } from "../../types";
import dayjs from "dayjs";
import CustomPagination from "../../components/Pagination/Pagination.tsx";
import ClientOrdersItem from "./ClientOrdersItem.tsx";
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS, MEDIA_REQ, SPACING } from '../../globalStyles/stylesObjects.ts';
import image from '../../assets/image_transparent.webp';
import Button from '@mui/joy/Button';
import { OrderStatus } from '../Admin/AdminOrderPage/ProcessingOrderItems.tsx';

const MyOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const loading = useAppSelector((state) => state.orders.isLoading);
  const error = useAppSelector((state) => state.orders.isError);
  const user = useAppSelector(selectUser);
  const guestEmail = localStorage.getItem("guestEmail");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [timeFilter, setTimeFilter] = useState<string>("All");
  const navigate = useNavigate();

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      "All": "Все",
      "Pending": "В обработке",
      "Confirmed": "Подтвержден",
      "Packed": "Упакован",
      "Shipped": "Отправлен",
      "Delivered": "Доставлен",
      "Canceled": "Отменен",
    };
    return statusLabels[status] || status;
  };

  useEffect(() => {
    document.title = "Мои заказы";
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      if (user) {
        await dispatch(GetClientOrders());

        const guestEmail = localStorage.getItem("guestEmail");
        if (guestEmail && guestEmail === user.email) {
          await dispatch(transferGuestOrders(guestEmail));
          localStorage.removeItem("guestEmail");
          await dispatch(GetClientOrders());
        }
      } else {
        const guestEmail = localStorage.getItem("guestEmail");
        if (guestEmail) {
          await dispatch(GetGuestOrders(guestEmail));
        }
      }
    };
    loadOrders();
  }, [dispatch, user]);

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const handleTimeFilterChange = (event: SelectChangeEvent) => {
    setTimeFilter(event.target.value);
  };

  const filterByStatus = (order: IOrder) => {
    return statusFilter === "All" || order.status === statusFilter;
  };

  const filterByTime = (order: IOrder) => {
    const orderDate = dayjs(order.createdAt);
    if (timeFilter === "Today") {
      return orderDate.isSame(dayjs(), "day");
    }
    if (timeFilter === "Last7Days") {
      return orderDate.isAfter(dayjs().subtract(7, "day"));
    }
    if (timeFilter === "Last30Days") {
      return orderDate.isAfter(dayjs().subtract(30, "day"));
    }
    return true;
  };
  const filteredAndSortedOrders = orders
    .filter((order) => filterByStatus(order) && filterByTime(order))
    .sort((a, b) => {
      const isACanceled = a.status === OrderStatus.Canceled;
      const isBCanceled = b.status === OrderStatus.Canceled;

      if (isACanceled && !isBCanceled) return 1;
      if (!isACanceled && isBCanceled) return -1;

      return dayjs(b.createdAt).diff(dayjs(a.createdAt));
    });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} sx={{color: COLORS.primary || COLORS.success}} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Ошибка при загрузке заказов"}</Alert>
      </Container>
    );
  }

  if (!user && !guestEmail) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          sx={{
            textAlign: 'center',
            marginTop: 10,
            [`@media (maxWidth: ${MEDIA_REQ.tablet.md})`]: {
              marginTop: 6,
            },
            [`@media (maxWidth: 375px)`]: {
              marginTop: 4,
            },
          }}
        >
          <Typography variant="h3" sx={{
            fontWeight: FONTS.weight.bold,
            fontSize: FONTS.size.xxl,
            color: COLORS.text,
            mb: SPACING.sm,
            [`@media (max-width: ${MEDIA_REQ.tablet.md})`]: {
              fontSize: FONTS.size.xxl,
            },
            "@media (max-width: 375px)": {
              fontSize: '24px',
              fontWeight: 400,
            },
          }}>
            Мои заказы
          </Typography>
          <Typography sx={{ mb: SPACING.sm }}>
            Для просмотра заказов необходимо авторизоваться или оформить заказ
          </Typography>
          <img
            width="200"
            height="200"
            src={image}
            alt="shopping-cart-emoji"
            style={{ marginBottom: SPACING.sm }}
          />
          <Typography
            variant="body1"
            sx={{
              color: COLORS.GRAY_BROWN,
              fontSize: FONTS.size.big_default,
              maxWidth: 600,
              margin: '0 auto',
              [`@media (maxWidth: ${MEDIA_REQ.mobile.lg})`]: {
                fontSize: FONTS.size.default,
              },
            }}
          >
            Начните делать покупки и порадуйте своего питомца!
          </Typography>
          <Button
            onClick={() => navigate('/all-products')}
            sx={{
              backgroundColor: COLORS.primary,
              borderRadius: "50px",
              color: COLORS.contrastText,
              fontWeight: FONTS.weight.medium,
              padding: SPACING.sm,
              width: "250px",
              marginTop: SPACING.sm,
              "&:hover": {
                backgroundColor: COLORS.DARK_GREEN,
              },
              [`@media (maxWidth: ${MEDIA_REQ.mobile.lg})`]: {
                width: "100%",
                maxWidth: "250px",
              },
            }}
          >
            Каталог товаров
          </Button>
        </Box>
      </Container>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Container maxWidth="xl" sx={{
        position: 'relative',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        [`@media (maxWidth: ${MEDIA_REQ.tablet.md})`]: {
          minHeight: '60vh',
        },
      }}>
        <Box
          sx={{
            textAlign: 'center',
            marginTop: 10,
            [`@media (maxWidth: ${MEDIA_REQ.tablet.md})`]: {
              marginTop: 6,
            },
            [`@media (maxWidth: ${MEDIA_REQ.mobile.lg})`]: {
              marginTop: 4,
            },
          }}
        >
          <Typography variant="h3" sx={{
            fontWeight: FONTS.weight.bold,
            color: COLORS.text,
            mb: SPACING.sm,
            [`@media (maxWidth: ${MEDIA_REQ.tablet.md})`]: {
              fontSize: FONTS.size.xxl,
            },
            [`@media (maxWidth: ${MEDIA_REQ.mobile.lg})`]: {
              fontSize: FONTS.size.xl,
            },
          }}>
            Мои заказы
          </Typography>
          <img
            width="200"
            height="200"
            src={image}
            alt="shopping-cart-emoji"
            style={{ marginBottom: SPACING.sm }}
          />
          <Typography variant="h5" sx={{
            fontWeight: FONTS.weight.bold,
            color: COLORS.text,
            mb: SPACING.sm,
            [`@media (maxWidth: ${MEDIA_REQ.mobile.lg})`]: {
              fontSize: FONTS.size.lg,
            },
          }}>
            У вас пока нет заказов!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: COLORS.GRAY_BROWN,
              fontSize: FONTS.size.big_default,
              maxWidth: 600,
              margin: '0 auto',
              [`@media (maxWidth: ${MEDIA_REQ.mobile.lg})`]: {
                fontSize: FONTS.size.default,
              },
            }}
          >
            Начните делать покупки и порадуйте своего питомца
          </Typography>
          <Button
            onClick={() => navigate('/all-products')}
            sx={{
              backgroundColor: COLORS.primary,
              borderRadius: "50px",
              color: COLORS.contrastText,
              fontWeight: FONTS.weight.medium,
              padding: SPACING.sm,
              width: "250px",
              marginTop: SPACING.sm,
              "&:hover": {
                backgroundColor: COLORS.DARK_GREEN,
              },
              [`@media (maxWidth: ${MEDIA_REQ.mobile.lg})`]: {
                width: "100%",
                maxWidth: "250px",
              },
            }}
          >
            Каталог товаров
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth='xl'>
      <Box
        sx={{
          my: SPACING.lg,
          display: "flex",
          flexDirection: "column",
          gap: SPACING.sm,
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          [`@media (maxWidth: ${MEDIA_REQ.tablet.md})`]: {
            my: SPACING.md,
          },
          [`@media (maxWidth: 375px)`]: {
            my: SPACING.sm,
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: FONTS.weight.bold,
            [`@media (max-width: ${MEDIA_REQ.tablet.md})`]: {
              fontSize: FONTS.size.xxl,
            },
            [`@media (max-width: ${MEDIA_REQ.mobile.lg})`]: {
              fontSize: FONTS.size.default,
            },
          }}
        >
          Мои заказы
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: SPACING.sm,
            alignItems: "center",
            maxWidth: "800px",
            [`@media (maxWidth: ${MEDIA_REQ.mobile.lg})`]: {
              flexDirection: "column",
            },
          }}
        >
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            sx={{
              minWidth: 200,
              [`@media (max-width: ${MEDIA_REQ.mobile.lg})`]: {
                minWidth: "40%",
              },
            }}
          >
            <MenuItem value="All">Все</MenuItem>
            <MenuItem value="Pending">В обработке</MenuItem>
            <MenuItem value="Confirmed">Подтвержден</MenuItem>
            <MenuItem value="Packed">Упакован</MenuItem>
            <MenuItem value="Shipped">Отправлен</MenuItem>
            <MenuItem value="Delivered">Доставлен</MenuItem>
            <MenuItem value="Canceled">Отменен</MenuItem>
          </Select>

          <Select
            value={timeFilter}
            onChange={handleTimeFilterChange}
            sx={{
              minWidth: 200,
              [`@media (max-width: ${MEDIA_REQ.mobile.lg})`]: {
                minWidth: "40%",
              },
            }}
          >
            <MenuItem value="All">За всё время</MenuItem>
            <MenuItem value="Today">Сегодня</MenuItem>
            <MenuItem value="Last7Days">Последние 7 дней</MenuItem>
            <MenuItem value="Last30Days">Последние 30 дней</MenuItem>
          </Select>
        </Box>

        {filteredAndSortedOrders.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              marginTop: 6,
              padding: 4,
              borderRadius: 2,
              backgroundColor: COLORS.background,
              width: '100%',
              maxWidth: 600,
            }}
          >
            <Typography variant="h5" sx={{
              fontWeight: FONTS.weight.medium,
              color: COLORS.text,
              mb: 2,
            }}>
              Заказы не найдены
            </Typography>
            <Typography sx={{
              color: COLORS.GRAY_BROWN,
              mb: 3,
            }}>
              {statusFilter === "All"
                ? "У вас пока нет заказов за выбранный период"
                : `Нет заказов со статусом "${getStatusLabel(statusFilter)}"`}
            </Typography>
            <Button
              onClick={() => {
                setStatusFilter("All");
                setTimeFilter("All");
              }}
              sx={{
                backgroundColor: COLORS.primary,
                color: COLORS.contrastText,
                '&:hover': {
                  backgroundColor: COLORS.DARK_GREEN,
                },
              }}
            >
              Сбросить фильтры
            </Button>
          </Box>
        ) : (
          <CustomPagination
            items={filteredAndSortedOrders}
            columns={3}
            renderItem={(item) => <div key={item.id}><ClientOrdersItem order={item} /> </div>}
          />
        )}
      </Box>
    </Container>
  );
};

export default MyOrders;
