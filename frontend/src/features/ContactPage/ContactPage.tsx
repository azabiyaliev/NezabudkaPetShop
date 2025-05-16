import ByuerBarTopTollBar from '../../components/UI/ByuerBarTopTollBar/ByuerBarTopTollBar.tsx';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectEditSite } from '../../store/editionSite/editionSiteSlice.ts';
import { useEffect } from 'react';
import { fetchSite } from '../../store/editionSite/editionSiteThunk.ts';
import theme from '../../globalStyles/globalTheme.ts';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Container from '@mui/material/Container';

const ContactPage = () => {
  const site = useAppSelector(selectEditSite)
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(fetchSite());
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
        <Box sx={{mt: 5, width: '100%',}}>
          <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: 600}}>
            Контакты
          </Typography>
          <Box
            sx={{
              p: 4,
              borderRadius: "5px",
              position: "relative",
              display: "flex",
              gap: 4,
              justifyContent: "space-between",
              backgroundColor: theme.colors.rgbaGrey,
              mx: 'auto',
              "@media (max-width: 1115px)": {
                display: 'block',
              },
            }}
          >
            <Box sx={{
              flex: 1,
            }}>
              <Box
                sx={{
                  marginTop: "100px",
                  display: 'grid',
                  gridTemplateColumns: 'max-content 1fr',
                  rowGap: '12px',
                  columnGap: '12px',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '16px',
                  marginLeft: "40px",
                  "@media (max-width: 1115px)": {
                    marginTop: "10px",
                  },
                  "@media (max-width: 500px)": {
                    marginLeft: "5px",
                  },
                  "@media (max-width: 420px)": {
                    fontSize: '14px',
                    marginLeft: "-10px",
                    rowGap: '5px',
                    columnGap: '5px',
                    gridTemplateColumns: 'max-content 0.5fr',
                  },
                }}
              >
                <span><LocationOnIcon sx={{color: theme.colors.DARK_GREEN}}/> <strong>Адрес:</strong></span>
                <span>{site?.address}</span>

                <span><AlternateEmailIcon sx={{color: theme.colors.DARK_GREEN}}/> <strong>Почта:</strong></span>
                <a
                  href={`mailto:${site?.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{color: "black", textDecoration: "none"}}
                >
                  {site?.email}
                </a>

                <span><PhoneIcon sx={{color: theme.colors.DARK_GREEN}}/> <strong>Телефон:</strong></span>
                <a
                  href={`tel:${site?.phone}`}
                  style={{color: "black", textDecoration: "none"}}
                >
                  {site?.phone}
                </a>

                <span><AccessTimeIcon sx={{color: theme.colors.DARK_GREEN}}/> <strong>График:</strong></span>
                <span>{site?.schedule}</span>
              </Box>
              {site?.linkAddress && (
                <a
                  href={site.linkAddress}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: '20px',
                    display: 'inline-block',
                    padding: '8px 16px',
                    backgroundColor: theme.colors.DARK_GREEN,
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 500,
                    marginLeft: "45px",
                  }}
                >
                  Открыть в 2ГИС
                </a>
              )}
            </Box>

            <Box
              sx={{
                width: "580px",
                height: "480px",
                overflow: "hidden",
                borderRadius: "5px",
                boxShadow: 2,
                position: "relative",
                '& iframe' : {
                  width: "800px",
                  height: "550px"
                },
                "@media (max-width: 1115px)": {
                  margin: "20px auto",
                  width: "100%",
                  '& iframe' : {
                    width: "100%",
                  },
                },
                "@media (max-width: 550px)": {
                  height: "275px",
                  '& iframe' : {
                    height: "350px"
                  },
                },
              }}
            >
              <iframe
                src={site?.mapGoogleLink}
                style={{
                  position: "absolute",
                  top: "-60px",
                  border: 0,
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ContactPage;