import { Box, Container, Typography } from '@mui/material';
import ByuerBarTopTollBar from '../../components/UI/ByuerBarTopTollBar/ByuerBarTopTollBar.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { useEffect } from 'react';
import { selectDelivery } from '../../store/deliveryPage/deliveryPageSlice.ts';
import { fetchDeliveryPage } from '../../store/deliveryPage/deliveryPageThunk.ts';
import '../../components/TextEditor/styles.css'

const DeliveryPage = () => {
  const delivery = useAppSelector(selectDelivery);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDeliveryPage()).unwrap();
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
            Доставка и оплата
          </Typography>

          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: '16px',
              padding: 4,
              backgroundColor: '#fafafa',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
            }}
          >
            {/* Текстовая часть */}
            <Box sx={{ flex: 1 }}>
              <div
                className="quill-content"
                dangerouslySetInnerHTML={{ __html: delivery?.text || '<p>Информация пока не добавлена.</p>' }}
                style={{ lineHeight: 1.6, fontSize: '16px', color: '#333', marginBottom: '16px' }}
              />
              <div
                className="quill-content"
                dangerouslySetInnerHTML={{ __html: delivery?.price || '' }}
                style={{ lineHeight: 1.6, fontSize: '16px', color: '#333' }}
              />
            </Box>

            {delivery?.map && (
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '450px',
                  height: '450px',
                  flexShrink: 0,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                }}
              >
                <iframe
                  src={delivery.map}
                  width="600px"
                  height="600px"
                  style={{
                    position: 'absolute',
                    top: '-70px',
                    border: 0,
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Box>
            )}
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default DeliveryPage;
