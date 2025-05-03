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
} from "@mui/material";
import OrderAdminItem from "./OrdersItem.tsx";
import dayjs from "dayjs";
import { IOrder } from "../../../types";
import CustomPagination from "../../../components/Pagination/Pagination.tsx";
import AdminBar from "../AdminProfile/AdminBar.tsx";

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
      return orderDate.isSame(dayjs(), "day");
    }
    if (timeFilter === "Last7Days") {
      return orderDate.isAfter(dayjs().subtract(7, "day").startOf("day"));
    }
    if (timeFilter === "Last30Days") {
      return orderDate.isAfter(dayjs().subtract(30, "day").startOf("day"));
    }
    return true;
  };
  const filteredOrders = orders.filter(
    (order) => filterByStatus(order) && filterByTime(order),
  );

  return (
    <Box
      sx={{
        display: "flex",
        margin: "30px 0",
        "@media (max-width: 900px)": {
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ width: 500, flexShrink: 0, height: "100%",
        "@media (max-width: 900px)": {
          width: "100%",
        },}}>
        <AdminBar />
      </Box>
      <Box>
        <Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", fontWeight: 600 }}
          >
            Заказы
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: "20px",
              alignItems: "baseline",
              justifyContent: "center",
              "@media (max-width: 500px)": {
                flexDirection: "column",
                alignItems: "center",
              },
            }}
          >
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              sx={{ mb: 3, minWidth: 200 }}
            >
              <MenuItem value="All">Все</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Packed">Packed</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Returned">Returned</MenuItem>
            </Select>

            <Select
              value={timeFilter}
              onChange={handleTimeFilterChange}
              sx={{ minWidth: 200 }}
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
        ) : filteredOrders.length === 0 ? (
          <Typography variant="h6" sx={{ mt: 4 }}>
            Заказов за выбранный период нет.
          </Typography>
        ) : (
          <CustomPagination
            items={filteredOrders}
            renderItem={(item) => <OrderAdminItem key={item.id} order={item} />}
            columns={2}
          />
        )}
      </Box>
    </Box>
  );
};

export default AllOrders;
