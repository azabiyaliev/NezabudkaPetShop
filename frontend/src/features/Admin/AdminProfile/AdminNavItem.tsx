import { ListItemButton, ListItemText } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import theme from '../../../globalStyles/globalTheme.ts';

interface Props {
  to: string;
  icon: ReactNode;
  text: string;
}

const AdminNavItem = ({ to, icon, text }: Props) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <ListItemButton
      component={NavLink}
      to={to}
      sx={{
        pl: 5,
        backgroundColor: isActive ? "#D0F0C0" : "transparent",
        borderLeft: isActive ? `4px solid ${theme.colors.primary} ` : "4px solid transparent",
        '& .MuiListItemText-root': {
          fontWeight: isActive ? "bold" : "normal",
        }
      }}
    >
      {icon}
      <ListItemText primary={text} />
    </ListItemButton>
  );
};

export default AdminNavItem;
