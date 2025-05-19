import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getAllOrders } from "../../../store/orders/ordersThunk";
import {
  Box,
  CircularProgress,
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
import { SPACING } from '../../../globalStyles/stylesObjects.ts';

const AllOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const loading = useAppSelector((state) => state.orders.isLoading);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [timeFilter, setTimeFilter] = useState<string>("All");

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


  useEffect(() => {
    document.title = "Все заказы";
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        margin: "30px 0",
        position: "relative",
        "@media (max-width: 1100px)": {
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          position: "sticky",
          top: 20,
          alignSelf: "flex-start",
          zIndex: 1000,
          marginRight: 2,
          "@media (max-width: 900px)": {
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
          "@media (max-width: 1750px)": {
            marginLeft: 0
          },
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
              <MenuItem value="Returned">Возвращен</MenuItem>
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
