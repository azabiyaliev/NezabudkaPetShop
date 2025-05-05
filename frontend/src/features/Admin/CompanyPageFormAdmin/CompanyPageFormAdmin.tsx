import { useAppDispatch } from '../../../app/hooks.ts';
import { useEffect } from 'react';
import { fetchCompanyPage } from '../../../store/companyPage/companyPageThunk.ts';
import { Box } from '@mui/material';
import AdminBar from '../AdminProfile/AdminBar.tsx';
import CompanyPageFrom from '../../../components/Forms/CompanyPageFrom/CompanyPageFrom.tsx';

const CompanyPageFormAdmin = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCompanyPage())
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
            <CompanyPageFrom />
          </Box>
        </Box>
      </Box>
  );
};

export default CompanyPageFormAdmin;