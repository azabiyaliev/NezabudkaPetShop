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
    padding: `0 ${theme.spacing.sm}`,
    '@media (max-width: 990px)': {
      borderRight: "none",
      flex: "1 1 300px",
    },
    '@media (max-width: 700px)': {
      borderRight: "none",
      flex: "1 1 200px",
    },
    '@media (max-width: 520px)': {
      borderRight: "none",
      flex: "1 1 250px",
    },
  };

  return (
    <Box
      sx={{
        padding: `${theme.spacing.xxl} ${theme.spacing.xs}`,
        backgroundColor: theme.colors.FOOTER_COLOR,
      }}
    >
      <Container maxWidth="xl">
      <Box sx={{
        display: 'none',
        '@media (max-width:1220px)': {
          display: 'flex',
          pl: 2
        },
      }}>
        <NavLink
          to="/"
          className="text-decoration-none"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Box>
            <Box
              component="img"
              src={logo}
              alt="Nezabudka"
              sx={{
                height: theme.spacing.xxl,
                width: theme.spacing.xxl,
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
          </Box>
        </NavLink>
      </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: theme.spacing.sm,
          }}
        >
          <Box sx={{
            ...columnStyle,
            '@media (max-width: 1220px)': {
             display:"none"
            },
          }}>
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
                  height: theme.spacing.xxl,
                  width: theme.spacing.xxl,
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
            marginTop: theme.spacing.xl,
          }}
        >
          &copy; {new Date().getFullYear()} Nezabudka. Все права защищены.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
