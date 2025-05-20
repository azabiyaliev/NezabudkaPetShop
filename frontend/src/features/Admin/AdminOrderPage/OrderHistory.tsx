import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getAllProcessingOrders } from "../../../store/orders/ordersThunk";
import {
  Box, CircularProgress,
  Typography,
} from '@mui/material';
import AdminBar from "../AdminProfile/AdminBar.tsx";
import { SPACING } from '../../../globalStyles/stylesObjects.ts';
import OrderHistoryItem from './OrderHistoryItem.tsx';

const OrderInProcess = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const loading = useAppSelector((state) => state.orders.isLoading);

  useEffect(() => {
    dispatch(getAllProcessingOrders(false));
  }, [dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

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
            История заказов
          </Typography>
        </Box>

        <Box sx={{ width: "100%", maxWidth: 1110, mt: SPACING.md }}>
          <OrderHistoryItem orders={orders}/>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderInProcess;