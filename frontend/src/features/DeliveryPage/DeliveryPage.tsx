import { Box, Container, Typography } from '@mui/material';
import ByuerBarTopTollBar from '../../components/UI/ByuerBarTopTollBar/ByuerBarTopTollBar.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { useEffect } from 'react';
import { selectDelivery } from '../../store/deliveryPage/deliveryPageSlice.ts';
import { fetchDeliveryPage } from '../../store/deliveryPage/deliveryPageThunk.ts';
import '../../components/TextEditor/styles.css'
import theme from '../../globalStyles/globalTheme.ts';

const DeliveryPage = () => {
  const delivery = useAppSelector(selectDelivery);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDeliveryPage()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    document.title = `Доставка и оплата`;
  }, []);


  return (
    <Container maxWidth="xl">
      <div className="d-flex">
        <div className="col-3 mt-5">
          <ByuerBarTopTollBar />
        </div>
        <div className="col-9 mt-5" style={{ display: 'flex', justifyContent: 'center' }}>
          <Container>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
              Доставка и оплата
            </Typography>

            <Box
              sx={{
                borderRadius: '5px',
                padding: 4,
                backgroundColor: theme.colors.rgbaGrey,
              }}
            >
              {delivery?.map && (
                <Box
                  sx={{
                    flex: '0 1 450px',
                    width: '100%',
                    maxWidth: '450px',
                    height: '450px',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    order: { xs: 1, md: 2 },
                    float: "right",
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
          </Container>
        </div>
      </div>
    </Container>
  );
};

export default DeliveryPage;
