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
import { NavLink, useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from "../../globalStyles/stylesObjects.ts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { OrderStatus } from '../Admin/AdminOrderPage/OrdersItem.tsx';
import image from '../../assets/image_transparent.webp';
import Button from '@mui/joy/Button';

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
      if (a.status === OrderStatus.Canceled && b.status !== OrderStatus.Canceled) {
        return 1;
      }
      if (a.status !== OrderStatus.Canceled && b.status === OrderStatus.Canceled) {
        return -1;
      }
      return 0;
    });

  if (loading) {
    return <CircularProgress />;
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
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
            Мои заказы
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Для просмотра заказов необходимо авторизоваться или оформить заказ
          </Typography>
          <img
            width="200"
            height="200"
            src={image}
            alt="shopping-cart-emoji"
            style={{ marginBottom: 20 }}
          />
          <Typography
            variant="body1"
            sx={{
              color: '#706e6a',
              fontSize: '18px',
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            Начните делать покупки и порадуйте своего питомца!
          </Typography>
          <Button
            onClick={() => navigate('/all-products')}
            sx={{
              backgroundColor: "#237803",
              borderRadius: "50px",
              color: "white",
              fontWeight: 600,
              padding: "13px",
              width: "250px",
              marginTop: '20px',
              "&:hover": {
                backgroundColor: "#154902",
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
      <Container maxWidth="xl" sx={{ position: 'relative', minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Box
          sx={{
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
            Мои заказы
          </Typography>
          <img
            width="200"
            height="200"
            src={image}
            alt="shopping-cart-emoji"
            style={{ marginBottom: 20 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
            У вас пока нет заказов!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#706e6a',
              fontSize: '18px',
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            Начните делать покупки и порадуйте своего питомца
          </Typography>
          <Button
            onClick={() => navigate('/all-products')}
            sx={{
              backgroundColor: "#237803",
              borderRadius: "50px",
              color: "white",
              fontWeight: 600,
              padding: "13px",
              width: "250px",
              marginTop: '20px',
              "&:hover": {
                backgroundColor: "#154902",
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
    <Container maxWidth="xl">
      <Box
        sx={{
          my: 5,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <NavLink
          to={`/my_account/users/account/${user?.id}`}
          style={{
            position: "absolute",
            left: 1,
            textDecoration: "none",
            color: COLORS.success,
            fontSize: FONTS.size.lg,
            display: "flex",
            alignItems: "center",
          }}
        >
          <ArrowBackIcon sx={{ fontSize: FONTS.size.lg, marginRight: 1 }} />
          Назад
        </NavLink>
        <Typography
          variant="h4"
          sx={{
            "@media (max-width: 480px)": {
              fontSize: FONTS.size.lg
            },
          }}
        >
          Мои заказы
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            sx={{
              minWidth: 200,
              "@media (max-width: 480px)": {
                minWidth: 120,
              },
            }}
          >
            <MenuItem value="All">Все</MenuItem>
            <MenuItem value="Pending">В обработке</MenuItem>
            <MenuItem value="Confirmed">Подтвержден</MenuItem>
            <MenuItem value="Packed">Упакован</MenuItem>
            <MenuItem value="Shipped">Отрпавлен</MenuItem>
            <MenuItem value="Delivered">Доставлен</MenuItem>
            <MenuItem value="Canceled">Отменен</MenuItem>
          </Select>

          <Select
            value={timeFilter}
            onChange={handleTimeFilterChange}
            sx={{
              minWidth: 200,
              "@media (max-width: 480px)": {
                minWidth: 120,
              },
            }}
          >
            <MenuItem value="All">За всё время</MenuItem>
            <MenuItem value="Today">Сегодня</MenuItem>
            <MenuItem value="Last7Days">Последние 7 дней</MenuItem>
            <MenuItem value="Last30Days">Последние 30 дней</MenuItem>
          </Select>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          <CustomPagination
            items={filteredAndSortedOrders}
            renderItem={(item) => <ClientOrdersItem key={item.id} order={item} />}
          />
        )}
      </Box>
    </Container>
  );
};

export default MyOrders;
