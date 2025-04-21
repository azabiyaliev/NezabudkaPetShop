import ByuerBarTopTollBar from '../../components/UI/ByuerBarTopTollBar/ByuerBarTopTollBar.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectCompany } from '../../store/companyPage/compantPageSlice.ts';
import { Box, Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import { fetchCompanyPage } from '../../store/companyPage/companyPageThunk.ts';

const CompanyPage = () => {
  const company = useAppSelector(selectCompany);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCompanyPage()).unwrap();
  }, [dispatch]);

  return (
    <div className="d-flex">
      <div className="col-3 mt-5">
        <ByuerBarTopTollBar />
      </div>

      <div className="col-9 mt-5" style={{ display: 'flex', justifyContent: 'center' }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 4,
              textAlign: 'center',
              color: 'black',
            }}
          >
            О компании
          </Typography>

          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: '16px',
              padding: 4,
              backgroundColor: '#fafafa',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
              minHeight: '300px',
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
  );
};

export default CompanyPage;
