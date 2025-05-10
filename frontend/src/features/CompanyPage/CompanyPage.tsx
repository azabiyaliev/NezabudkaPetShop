import ByuerBarTopTollBar from '../../components/UI/ByuerBarTopTollBar/ByuerBarTopTollBar.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectCompany } from '../../store/companyPage/compantPageSlice.ts';
import { Box, Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import { fetchCompanyPage } from '../../store/companyPage/companyPageThunk.ts';
import theme from '../../globalStyles/globalTheme.ts';

const CompanyPage = () => {
  const company = useAppSelector(selectCompany);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCompanyPage()).unwrap();
  }, [dispatch]);

  return (
    <Container maxWidth="xl">
      <div className="d-flex">
        <div className="col-3 mt-5">
          <ByuerBarTopTollBar />
        </div>

        <div className="col-9 mt-5" style={{ display: 'flex', justifyContent: 'center' }}>
          <Container >
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
              О компании
            </Typography>

            <Box
              sx={{
                borderRadius: '5px',
                padding: 4,
                backgroundColor: theme.colors.rgbaGrey,
                mx: 'auto',
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: company?.text || '<p>Информация пока не добавлена.</p>' }}
                style={{ lineHeight: 1.6, fontSize: '16px', color: '#333' }}
              />
            </Box>
          </Container>
        </div>
      </div>
    </Container>
  );
};

export default CompanyPage;
