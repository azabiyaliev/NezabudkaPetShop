import { Box, Typography, IconButton } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import logo_transparent from "../../../assets/logo_transparent.png";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import { useAppSelector, useAppDispatch } from "../../../app/hooks.ts";
import { selectEditSite } from "../../../store/editionSite/editionSiteSlice.ts";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import { useEffect } from 'react';
import { fetchSite } from '../../../store/editionSite/editionSiteThunk.ts';
const Footer = () => {
  const site = useAppSelector(selectEditSite);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSite()).unwrap()
  }, [dispatch]);

  return (
    <Box
      sx={{
        padding: "40px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "1200px",
          padding: "0 20px",
          marginBottom: "20px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="img"
            src={logo_transparent}
            alt="Nezabudka"
            sx={{
              height: "50px",
              width: "50px",
              cursor: "pointer",
              marginRight: "15px",
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "black",
              textTransform: "uppercase",
              fontFamily: "Georgia, sans-serif",
            }}
          >
            Незабудка
          </Typography>
        </Box>

        <Box
          sx={{
            alignItems: "center",
            paddingTop: "20px",
            marginRight: "70px",
          }}
        >
          <Typography sx={{ color: "black", fontSize: "14px" }}>
            <NearMeOutlinedIcon sx={{ color: "black" }} />
            {site?.address}
          </Typography>
          <Typography sx={{ color: "black", fontSize: "14px" }}>
            <PhoneIphoneOutlinedIcon sx={{ color: "black" }} />
            {site?.phone}
          </Typography>
          <Typography sx={{ color: "black", fontSize: "14px" }}>
            <AlternateEmailOutlinedIcon sx={{ color: "black" }} />
            {site?.email}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: "10px", marginRight: "20px" }}>
          <IconButton
            href="https://www.instagram.com/nezabudka.zoo/"
            color="inherit"
            sx={{ color: "black" }}
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            href="https://api.whatsapp.com/send?phone=996555338899"
            color="inherit"
            sx={{ color: "black" }}
          >
            <WhatsAppIcon />
          </IconButton>
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{ color: "lightgray", marginTop: "20px" }}
      >
        &copy; {new Date().getFullYear()} Nezabudka. Все права защищены.
      </Typography>
    </Box>
  );
};

export default Footer;
