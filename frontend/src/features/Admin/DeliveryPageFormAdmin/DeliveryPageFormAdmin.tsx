import { useAppDispatch } from '../../../app/hooks.ts';
import { useEffect } from 'react';
import { fetchDeliveryPage } from '../../../store/deliveryPage/deliveryPageThunk.ts';
import { Box } from '@mui/material';
import AdminBar from '../AdminProfile/AdminBar.tsx';
import DeliveryPageForm from '../../../components/Forms/DeliveryPageFrom/DeliveryPageFrom.tsx';

const DeliveryPageFormAdmin = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDeliveryPage())
      .unwrap()
      .catch((error) => {
        console.error("Error fetching site data:", error);
      });
  }, [dispatch]);
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
      <Box sx={{ minWidth: 240 }}>
        <AdminBar />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <DeliveryPageForm/>
        </Box>
      </Box>
    </Box>
  );
};

export default DeliveryPageFormAdmin;