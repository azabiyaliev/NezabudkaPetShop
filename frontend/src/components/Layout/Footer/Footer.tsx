import { Box, Container, Typography } from '@mui/material';
import logo from "../../../assets/logo-nezabudka.png";
import { useAppDispatch } from "../../../app/hooks.ts";
import { useEffect } from "react";
import { fetchSite } from "../../../store/editionSite/editionSiteThunk.ts";
import { NavLink } from "react-router-dom";
import CatygoryFooter from "./CatygoryFooter/CatygoryFooter.tsx";
import BuyerBlockFooter from "./BuyerBlockFooter/BuyerBlockFooter.tsx";
import CabinetBlockFooter from "./CabinetBlockFooter/CabinetBlockFooter.tsx";
import LinkBlockFooter from "./LinkBlockFooter/LinkBlockFooter.tsx";
import theme from "../../../globalStyles/globalTheme.ts";

const Footer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSite()).unwrap();
  }, [dispatch]);

  const columnStyle = {
    flex: "1 1 200px",
    borderRight: `1px solid ${theme.colors.BORDER_CART}`,
    alignSelf: "stretch",
    boxSizing: "border-box" as const,
    padding: "0 20px",
    '@media (max-width: 900px)': {
      borderRight: "none",
    },
  };

  return (
    <Box
      sx={{
        padding: "50px 10px",
        backgroundColor: theme.colors.FOOTER_COLOR,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <Box sx={columnStyle}>
            <NavLink
              to="/"
              className="text-decoration-none"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Box
                component="img"
                src={logo}
                alt="Nezabudka"
                sx={{
                  height: "50px",
                  width: "50px",
                  cursor: "pointer",
                }}
              />
              <Typography
                sx={{
                  fontSize: theme.fonts.size.lg,
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  color: theme.colors.white,
                  cursor: "pointer",
                }}
              >
                Незабудка
              </Typography>
            </NavLink>
          </Box>

          <Box sx={columnStyle}>
            <CatygoryFooter />
          </Box>
          <Box sx={columnStyle}>
            <BuyerBlockFooter />
          </Box>
          <Box sx={columnStyle}>
            <CabinetBlockFooter />
          </Box>
          <Box
            sx={{
              ...columnStyle,
              borderRight: "none",
            }}
          >
            <LinkBlockFooter />
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: theme.colors.DARK_GRAY,
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          &copy; {new Date().getFullYear()} Nezabudka. Все права защищены.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
