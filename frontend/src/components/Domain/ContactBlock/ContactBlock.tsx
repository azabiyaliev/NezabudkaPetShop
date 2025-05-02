
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
  const site = useAppSelector(selectEditSite)
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSite());
  }, [dispatch]);
  return (
    <div>
      <Box
        sx={{
          p: 4,
          position: "relative",
          display: "flex",
          gap: 4,
          justifyContent: "space-between",
          mx: 'auto',
        }}
      >
        <Box
          sx={{
            flex: 1,
            backgroundColor: theme.colors.rgbaGrey,
            borderRadius: "5px",
            padding: 3,
            marginLeft: "40px",
            minHeight: "450px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
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
              marginTop:"100px"
            }}
          >
            <span><LocationOnIcon sx={{ color: theme.colors.DARK_GREEN }} /> <strong>Адрес:</strong></span>
            <span>{site?.address}</span>

            <span><AlternateEmailIcon sx={{ color: theme.colors.DARK_GREEN }} /> <strong>Почта:</strong></span>
            <a
              href={`mailto:${site?.email}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "black", textDecoration: "none" }}
            >
              {site?.email}
            </a>

            <span><PhoneIcon sx={{ color: theme.colors.DARK_GREEN }} /> <strong>Телефон:</strong></span>
            <a
              href={`tel:${site?.phone}`}
              style={{ color: "black", textDecoration: "none" }}
            >
              {site?.phone}
            </a>

            <span><AccessTimeIcon sx={{ color: theme.colors.DARK_GREEN }} /> <strong>График:</strong></span>
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
          }}
        >
          <iframe
            src={site?.mapGoogleLink}
            width="850px"
            height="850px"
            style={{
              position: "absolute",
              top: "-60px",
              border: 0,
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Box>
      </Box>

    </div>
  );
};

export default ContactBlock;