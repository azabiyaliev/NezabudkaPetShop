import { IconButton, Typography, Box } from '@mui/material';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useAppSelector } from '../../../../app/hooks.ts';
import { selectEditSite } from '../../../../store/editionSite/editionSiteSlice.ts';

const LinkBlockFooter = () => {
  const site = useAppSelector(selectEditSite);

  return (
    <Box
      sx={{
        backgroundColor: "rgb(33, 33, 33)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <Typography sx={{color:"white",  display: "flex"}}>Напишите нам:</Typography>
      <Typography sx={{ color: "white", fontSize: "22px", display: "flex", gap: "6px" }}>
        <AlternateEmailOutlinedIcon sx={{ color: "white" }} />
        <a
          href={`https://mail.google.com/mail/?view=cm&to=${site?.email}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white", textDecoration: "none" }}
        >
          {site?.email}
        </a>
      </Typography>
      <Box sx={{ display: "flex", gap: "15px" }}>
        {site?.instagram && (
          <IconButton
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            sx={{
              color: "lightgray",
            }}
          >
            <InstagramIcon />
          </IconButton>
        )}
        {site?.whatsapp && (
          <IconButton
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            sx={{
              color: "lightgray",
            }}
          >
            <WhatsAppIcon />
          </IconButton>
        )}
      </Box>
      <a
        href={site?.linkAddress || "/"}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "white",
          textDecoration: "none",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            '&:hover': {
              color: "yellow",
            },
          }}
        >
          <NearMeOutlinedIcon sx={{ color: "white" }} />
          {site?.address}
        </Typography>
      </a>
      <Typography sx={{ color: "white", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
        <PhoneIphoneOutlinedIcon sx={{ color: "white" }} />
        <a
          href={`tel:${site?.phone}`}
          style={{ textDecoration: "none", color: "white" }}
        >
          {site?.phone}
        </a>
      </Typography>

    </Box>
  );
};

export default LinkBlockFooter;
