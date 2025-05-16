import { Box } from '@mui/material';
import theme from '../../../globalStyles/globalTheme.ts';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectEditSite } from '../../../store/editionSite/editionSiteSlice.ts';
import { useEffect } from 'react';
import { fetchSite } from '../../../store/editionSite/editionSiteThunk.ts';

const ContactBlock = () => {
  const site = useAppSelector(selectEditSite);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSite());
  }, [dispatch]);

  return (
    <Box
      sx={{
        p: 4,
        position: "relative",
        display: "flex",
        flexDirection: "row", // Блоки будут располагаться рядом
        gap: 4,
        justifyContent: "space-between",
        mx: 'auto',
        '@media (max-width: 900px)': {
          flexDirection: "column", // На мобильных экранах блоки будут располагаться друг под другом
          p: 2,
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.colors.rgbaGrey,
          borderRadius: "5px",
          padding: 3,
          marginLeft: "40px",
          minHeight: "450px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          '@media (max-width: 900px)': {
            marginLeft: 0,
            minHeight: "auto",
            padding: "15px",
          },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'max-content 1fr',
            rowGap: '12px',
            columnGap: '12px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            marginTop: "100px",
            '@media (max-width: 900px)': {
              gridTemplateColumns: '1fr', // Все элементы будут располагаться в одну колонку
              marginTop: '0',
            },
          }}
        >
          <span>
            <LocationOnIcon sx={{ color: theme.colors.DARK_GREEN }} /> <strong>Адрес:</strong>
          </span>
          <span>{site?.address}</span>

          <span>
            <AlternateEmailIcon sx={{ color: theme.colors.DARK_GREEN }} /> <strong>Почта:</strong>
          </span>
          <a
            href={`mailto:${site?.email}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "black", textDecoration: "none" }}
          >
            {site?.email}
          </a>

          <span>
            <PhoneIcon sx={{ color: theme.colors.DARK_GREEN }} /> <strong>Телефон:</strong>
          </span>
          <a
            href={`tel:${site?.phone}`}
            style={{ color: "black", textDecoration: "none" }}
          >
            {site?.phone}
          </a>

          <span>
            <AccessTimeIcon sx={{ color: theme.colors.DARK_GREEN }} /> <strong>График:</strong>
          </span>
          <span>{site?.schedule}</span>
        </Box>
      </Box>

      <Box
        sx={{
          width: "800px",
          height: "450px",
          overflow: "hidden",
          borderRadius: "5px",
          boxShadow: 2,
          position: "relative",
          '@media (max-width: 900px)': {
            width: "100%",
            height: "300px",
          },
        }}
      >
        <iframe
          src={site?.mapGoogleLink}
          width="900"
          height="600"
          style={{
            position: "absolute",
            top: "-60px",
            left: "0",
            border: 0,
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </Box>
    </Box>
  );
};

export default ContactBlock;
