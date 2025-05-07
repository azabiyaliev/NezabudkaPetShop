import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getAllOrders } from "../../../store/orders/ordersThunk";
import {
  Box, Button,
  CircularProgress, Drawer, IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import OrderAdminItem, { OrderStatus } from './OrdersItem.tsx';
import dayjs from "dayjs";
import { IOrder } from "../../../types";
import CustomPagination from "../../../components/Pagination/Pagination.tsx";
import AdminBar from "../AdminProfile/AdminBar.tsx";
import MenuIcon from '@mui/icons-material/Menu';
import { SPACING } from '../../../globalStyles/stylesObjects.ts';

const AllOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const loading = useAppSelector((state) => state.orders.isLoading);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [timeFilter, setTimeFilter] = useState<string>("All");
  const [isAdminBarOpen, setIsAdminBarOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

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
      return orderDate.startOf("day").isSame(dayjs().startOf("day"));
    }

    if (timeFilter === "Last7Days") {
      return orderDate.isAfter(dayjs().subtract(7, "day").startOf("day"));
    }

    if (timeFilter === "Last30Days") {
      return orderDate.isAfter(dayjs().subtract(30, "day").startOf("day"));
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

  const toggleAdminBar = () => setIsAdminBarOpen(!isAdminBarOpen);
  return (
    <Box
      sx={{
        display: "flex",
        margin: "30px 0",
        position: "relative",
      }}
    >
      <IconButton
        onClick={toggleAdminBar}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "block",
          zIndex: 10,
          "@media (min-width: 1360px)": {
            display: "none",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={isAdminBarOpen}
        onClose={toggleAdminBar}
        sx={{
          "& .MuiDrawer-paper": {
            width: 400,
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Admin Panel
          </Typography>
          <AdminBar />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: "auto" }}
            onClick={toggleAdminBar}
          >
            Закрыть
          </Button>
        </Box>
      </Drawer>

      <Box
        sx={{
          flexShrink: 0,
          width: 250,
          height: "100%",
          "@media (max-width: 1360px)": {
            display: "none",
          },
        }}
      >
        <AdminBar />
      </Box>

      <Box
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexWrap: 'wrap',
          marginLeft: SPACING.main_spacing,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            Заказы
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: "20px",
              alignItems: "baseline",
              justifyContent: "center",
              flexWrap: "wrap",
              "@media (max-width: 500px)": {
                flexDirection: "column",
                gap: 2,
              },
            }}
          >
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              sx={{
                mb: {
                  xs: 0,
                  md: 3,
                },
                minWidth: 200,
                "@media (max-width: 600px)": {
                  minWidth: 150,
                },
              }}
            >
              <MenuItem value="All">Все</MenuItem>
              <MenuItem value="Pending">В обработке</MenuItem>
              <MenuItem value="Confirmed">Подтвержден</MenuItem>
              <MenuItem value="Packed">Упакован</MenuItem>
              <MenuItem value="Shipped">Отправлен</MenuItem>
              <MenuItem value="Delivered">Доставлен</MenuItem>
              <MenuItem value="Received">Получен</MenuItem>
              <MenuItem value="Canceled">Отменен</MenuItem>
            </Select>

            <Select
              value={timeFilter}
              onChange={handleTimeFilterChange}
              sx={{
                minWidth: 200,
                "@media (max-width: 600px)": {
                  minWidth: 150,
                },
              }}
            >
              <MenuItem value="All">За всё время</MenuItem>
              <MenuItem value="Today">Сегодня</MenuItem>
              <MenuItem value="Last7Days">Последние 7 дней</MenuItem>
              <MenuItem value="Last30Days">Последние 30 дней</MenuItem>
            </Select>
          </Box>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : filteredAndSortedOrders.length === 0 ? (
          <Typography variant="h6" sx={{ mt: 4 }}>
            Заказов за выбранный период нет.
          </Typography>
        ) : (
          <CustomPagination
            items={filteredAndSortedOrders}
            renderItem={(item) => <OrderAdminItem key={item.id} order={item} />}
            columns={2}
          />
        )}
      </Box>
    </Box>
  );
};

export default AllOrders;
