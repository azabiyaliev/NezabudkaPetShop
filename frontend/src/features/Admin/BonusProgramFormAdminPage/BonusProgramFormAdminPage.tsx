import { useAppDispatch } from '../../../app/hooks.ts';
import { useEffect } from 'react';
import { fetchBonusPage } from '../../../store/bonusProgramPage/bonusProgramPageThunk.ts';
import { Box } from '@mui/material';
import AdminBar from '../AdminProfile/AdminBar.tsx';
import BonusProgramForm from '../../../components/Forms/BonusProgramForm/BonusProgramForm.tsx';


const BonusProgramFormAdminPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBonusPage())
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
          <BonusProgramForm />
        </Box>
      </Box>

    </Box>
  );
};

export default BonusProgramFormAdminPage;