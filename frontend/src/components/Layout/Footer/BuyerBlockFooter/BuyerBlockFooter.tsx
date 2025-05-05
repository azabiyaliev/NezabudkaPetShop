import { Box } from "@mui/material";
import { NavLink } from 'react-router-dom';
import theme from "../../../../globalStyles/globalTheme";

const BuyerBlockFooter = () => {
  return (
    <Box sx={{ textAlign: "left" }}>
      <p style={{ color: theme.colors.rgbaGrey, fontSize: "14px", marginBottom: "8px", fontWeight:theme.fonts.weight.medium }}>
        Покупателям
      </p>
      <Box component="ul" sx={{ listStyle: "none", padding: 0, margin: 0 }}>
        {[
          { to: "/my_company", label: "О компании" },
          { to: "/delivery", label: "Доставка и оплата" },
          { to: "/bonus_program", label: "Бонусная программа" },
          { to: "/contacts", label: "Контакты" },
        ].map((item) => (
          <Box component="li" key={item.to} sx={{ marginBottom: "4px" }}>
            <NavLink
              to={item.to}
              style={{
                color: theme.colors.white,
                textDecoration: "none",
                transition: "color 0.3s",
                fontSize: "14px",
              }}
            >
              {item.label}
            </NavLink>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BuyerBlockFooter;