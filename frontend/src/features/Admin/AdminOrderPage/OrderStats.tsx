import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getStatistics } from "../../../store/orders/ordersThunk";
import ColumnChart from "../../../components/UI/ColumnChart/ColumnChart.tsx";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { Box, Button, CircularProgress, Drawer, IconButton, Paper } from '@mui/material';
import Typography from "@mui/material/Typography";
import AdminBar from "../AdminProfile/AdminBar.tsx";
import MenuIcon from '@mui/icons-material/Menu';

const OrderStats = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orderStats);
  const [isAdminBarOpen, setIsAdminBarOpen] = useState(false);

  useEffect(() => {
    document.title = "Статистика заказов";
  }, []);

  useEffect(() => {
    dispatch(getStatistics());

    const interval = setInterval(() => {
      dispatch(getStatistics());
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (!orders) {
    return <CircularProgress />;
  }

  const percentageCount = (a: number, b: number) => {
    if (b === 0) return "0";
    return ((a / b) * 100).toFixed(1);
  };

  const totalOrderTypes =
    orders.deliveryStatistic +
    orders.pickUpStatistic +
    orders.canceledOrderCount;
  const totalPayments = orders.paymentByCard + orders.paymentByCash;
  const totalBonuses = orders.bonusUsage;

  const rows = [
    {
      id: 1,
      name: "Доставка",
      count: orders.deliveryStatistic,
      percentage: `${percentageCount(orders.deliveryStatistic, totalOrderTypes)}%`,
    },
    {
      id: 2,
      name: "Самовывоз",
      count: orders.pickUpStatistic,
      percentage: `${percentageCount(orders.pickUpStatistic, totalOrderTypes)}%`,
    },
    {
      id: 3,
      name: "Оплата картой",
      count: orders.paymentByCard,
      percentage: `${percentageCount(orders.paymentByCard, totalPayments)}%`,
    },
    {
      id: 4,
      name: "Оплата наличными",
      count: orders.paymentByCash,
      percentage: `${percentageCount(orders.paymentByCash, totalPayments)}%`,
    },
    {
      id: 5,
      name: "Пользование бонусами",
      count: orders.bonusUsage,
      percentage: `${percentageCount(orders.bonusUsage, totalBonuses)}%`,
    },
    {
      id: 6,
      name: "Общее кол-во заказов",
      count: orders.totalOrders,
      percentage: `100%`,
    },
    {
      id: 7,
      name: "Отмененные заказы",
      count: orders.canceledOrderCount,
      percentage: `${percentageCount(orders.canceledOrderCount, totalOrderTypes)}%`,
    },
  ];

  const columns = [
    { field: "name", headerName: "Название", flex: 1 },
    { field: "count", headerName: "Количество", flex: 1 },
    { field: "percentage", headerName: "Проценты", flex: 1 },
  ];

  const toggleAdminBar = () => setIsAdminBarOpen(!isAdminBarOpen);


  return (
    <Box
      sx={{
        display: "flex",
        gap: 4,
        margin: "30px 0",
        position: "relative",
        "@media (max-width: 900px)": {
          flexDirection: "column",
          gap: 2,
        },
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
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          ml: { lg: "250px" },
          "@media (max-width: 900px)": {
            ml: 0,
            width: "100%",
          },
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: 600,
            mt: { xs: 6, lg: 0 }, // Отступ для кнопки меню на мобильных
          }}
        >
          Статистика заказов
        </Typography>

        {/* График */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: "12px",
            minHeight: "400px",
            width: "100%",
            overflow: "hidden",
            "@media (max-width: 600px)": {
              p: 1,
              minHeight: "300px",
            },
          }}
        >
          <Box sx={{ height: "100%", width: "100%" }}>
            <ColumnChart stats={orders} />
          </Box>
        </Paper>

        {/* Таблица */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: "12px",
            overflow: "hidden",
            minHeight: "400px",
            width: "100%",
            mb: 4,
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            hideFooter
            sx={{
              [`& .${gridClasses.cell}`]: {
                py: 2,
              },
              [`& .${gridClasses.row}`]: {
                fontSize: "0.95rem",
              },
              "@media (max-width: 600px)": {
                ".MuiDataGrid-columnHeaders": {
                  display: "none",
                },
              },
            }}
          />
        </Paper>
      </Box>
    </Box>

  );
};

export default OrderStats;
