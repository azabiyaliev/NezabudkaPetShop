import { useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks.ts';
import { Box } from '@mui/material';
import AdminBar from '../AdminProfile/AdminBar.tsx';
import { fetchClientInfo } from '../../../store/clientInfo/clientInfoThunk.ts';
import ClientInfoForm from '../../../components/Forms/ClientInfoForm/ClientInfoForm.tsx';


const ClientInfoPagesForm = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchClientInfo())
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
      <Box
        sx={{
          flexShrink: 0,
          height: "100%",
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
          margin: '0 auto',
        }}
      >
        <ClientInfoForm/>
      </Box>
    </Box>
  );
};

export default ClientInfoPagesForm;