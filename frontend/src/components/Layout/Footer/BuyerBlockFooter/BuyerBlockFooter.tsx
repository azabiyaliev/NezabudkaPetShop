import { Box } from "@mui/material";
import { NavLink } from 'react-router-dom';

const BuyerBlockFooter = () => {
  return (
    <Box sx={{ textAlign: "left" }}>
      <p style={{ color: "lightgray", fontSize: "14px", marginBottom: "8px" }}>
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
                color: "white",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "yellow")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
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