import { ListItemButton, ListItemText } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { ReactNode } from "react";

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
        backgroundColor: isActive ? "#e0f2f1" : "transparent",
        borderLeft: isActive ? "4px solid #45624E" : "4px solid transparent",
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
