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

  return (
    <Container maxWidth="xl">
      <Box sx={{
        display: 'flex',
        "@media (max-width: 820px)": {
          display: 'block',
        },
      }}>
        <Box sx={{
          mt: 5,
        }}>
          <ByuerBarTopTollBar />
        </Box>
        <Box sx={{ mt: 5}}>
          <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: 600}}>
            Доставка и оплата
          </Typography>
          <div className="w-100" style={{display: 'flex', justifyContent: 'center'}}>
            <Box
              sx={{
                borderRadius: '5px',
                padding: 4,
                backgroundColor: theme.colors.rgbaGrey,
                "@media (max-width: 820px)": {
                  padding: 2,
                },
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
                    order: {xs: 1, md: 2},
                    float: "right",
                    '& iframe': {
                      width: "600px",
                      height: "600px"
                    },
                    "@media (max-width: 1115px)": {
                      display: 'none',
                    },
                  }}
                >
                  <iframe
                    src={delivery.map}
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
                dangerouslySetInnerHTML={{__html: delivery?.text || '<p>Информация пока не добавлена.</p>'}}
                style={{lineHeight: 1.6, fontSize: '16px', color: '#333', marginBottom: '16px'}}
              />
              <div
                className="quill-content"
                dangerouslySetInnerHTML={{__html: delivery?.price || ''}}
                style={{lineHeight: 1.6, fontSize: '16px', color: '#333'}}
              />
              {delivery?.map && (
                <Box
                  sx={{
                    display: 'none',
                    flex: '0 1 450px',
                    width: '100%',
                    maxWidth: '100%',
                    height: '450px',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    order: {xs: 1, md: 2},
                    float: "right",
                    '& iframe': {
                      width: "100%",
                      height: "600px"
                    },
                    "@media (max-width: 1115px)": {
                      display: 'block',
                    },
                    "@media (max-width: 500px)": {
                      height: "350px",
                      '& iframe': {
                        height: "380px"
                      },
                    },
                    "@media (max-width: 400px)": {
                      height: "250px",
                      '& iframe': {
                        height: "350px"
                      },
                    },
                  }}
                >
                  <iframe
                    src={delivery.map}
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
          </div>
        </Box>
      </Box>
    </Container>
  );
};

export default DeliveryPage;
