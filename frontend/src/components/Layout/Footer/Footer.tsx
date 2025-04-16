import { Box, Typography } from "@mui/material";
import logo from "../../../../public/logo.png";
import { useAppDispatch } from "../../../app/hooks.ts";
import  { useEffect } from 'react';
import { fetchSite } from '../../../store/editionSite/editionSiteThunk.ts';
import { NavLink } from 'react-router-dom';
import CatygoryFooter from './CatygoryFooter/CatygoryFooter.tsx';
import BuyerBlockFooter from './BuyerBlockFooter/BuyerBlockFooter.tsx';
import CabinetBlockFooter from './CabinetBlockFooter/CabinetBlockFooter.tsx';
import LinkBlockFooter from './LinkBlockFooter/LinkBlockFooter.tsx';
const Footer = () => {
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
        textAlign: "center",
        backgroundColor: "rgb(33, 33, 33)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
          maxWidth: "1200px",
          padding: "0 20px",
          marginBottom: "20px",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <NavLink
            to="/"
            className="text-decoration-none d-flex align-items-center gap-2"
          >
            <Box
              component="img"
              src={logo}
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
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
            flexWrap: "wrap",
            gap: "40px",
          }}
        >
          <CatygoryFooter />
          <Box>
            <BuyerBlockFooter />
          </Box>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <CabinetBlockFooter/>
          </Box>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <LinkBlockFooter/>
          </Box>
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
