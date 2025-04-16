import { Box, Typography, IconButton } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import logo_transparent from "../../../assets/logo_transparent.png";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import { useAppSelector, useAppDispatch } from "../../../app/hooks.ts";
import { selectEditSite } from "../../../store/editionSite/editionSiteSlice.ts";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import  { useEffect } from 'react';
import { fetchSite } from '../../../store/editionSite/editionSiteThunk.ts';
import { NavLink } from 'react-router-dom';
import CatygoryFooter from './CatygoryFooter/CatygoryFooter.tsx';
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
        backgroundColor:"rgb(33, 33, 33)"
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
        <Box sx={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
          <NavLink
            to="/"
            className="text-decoration-none d-flex align-items-center gap-2"
          >
            <Box
              component="img"
              src={logo_transparent}
              alt="Nezabudka"
              sx={{
                height: "65px",
                width: "65px",
                cursor: "pointer",
                marginRight: "8px",
                "@media (max-width: 800px)": {
                  height: "50px",
                  width: "50px",
                },
              }}
            />
            <Typography
              sx={{
                fontSize: "28px",
                textTransform: "uppercase",
                fontWeight: "bold",
                fontFamily: "COMIC SANS MS, Roboto, Arial, sans-serif",
                color: "white",
                cursor: "pointer",
                "@media (max-width: 800px)": {
                  fontSize: "26px",
                },
              }}
            >
              Незабудка
            </Typography>
          </NavLink>

          <Box sx={{ marginTop: "12px", flex:"end" }}>
            <CatygoryFooter />
          </Box>
        </Box>

        <Box
          sx={{
            alignItems: "center",
            paddingTop: "20px",
            marginRight: "70px",
          }}
        >
          <a
            href={site?.linkAddress || "/"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "black",
              textDecoration: "none",
            }}
          >
            <Typography sx={{ color: "black", fontSize: "14px" }}>
              <NearMeOutlinedIcon sx={{ color: "black" }} />
              {site?.address}
            </Typography>
          </a>
          <Typography sx={{ color: "black", fontSize: "14px" }}>
            <PhoneIphoneOutlinedIcon sx={{ color: "black", marginRight: "5px" }} />
            <a
              href={`tel:${site?.phone}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              {site?.phone}
            </a>
          </Typography>
          <Typography sx={{ color: "black", fontSize: "14px", display: "flex", alignItems: "center" }}>
            <AlternateEmailOutlinedIcon sx={{ color: "black", marginRight: "4px" }} />
            <a
              href={`https://mail.google.com/mail/?view=cm&to=${site?.email}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "black", textDecoration: "none" }}
            >
              {site?.email}
            </a>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: "10px", marginRight: "20px" }}>
          {site?.instagram && (
            <IconButton
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ color: "black" }}
            >
              <InstagramIcon />
            </IconButton>
          )}

          {site && site.whatsapp && (
            <IconButton
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            sx={{ color: "black" }}
            >
                <WhatsAppIcon />
            </IconButton>
            )}

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
