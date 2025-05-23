import { Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../../../app/hooks.ts';
import { selectUser } from '../../../../store/users/usersSlice.ts';
import theme from '../../../../globalStyles/globalTheme.ts';

const CabinetBlockFooter = () => {
  const user = useAppSelector(selectUser);

  const links: { to: string; label: string }[] = [];

  if (!user) {
    links.push(
      { to: "/login", label: "Вход" },
      { to: "/register", label: "Создать учетную запись" },
      { to: "/my_cart", label: "Корзина" },
      { to: "/favorite-products", label: "Избранное" }
    );
  } else if (user.role === "client") {
    links.push(
      { to: "/my_cart", label: "Корзина" },
      { to: "/favorite-products", label: "Избранное" },
      { to: "/my_orders", label: "Мои заказы" }
    );
  } else if (user.role === "admin") {
    links.push(
      { to: "/private_account", label: "Админ панель" },
      { to: "/private/products", label: "Товары" },
      { to: "/private/client_inprocess_orders", label: "Заказы" },
      { to: "/private/clients", label: "Клиенты" }
    );
  } else if (user.role === "superAdmin") {
    links.push(
      { to: "/private/order_stats", label: "Статистика" },
      { to: "/private/products", label: "Товары" },
      { to: "/private/client_inprocess_orders", label: "Заказы" },
      { to: "/private/clients", label: "Клиенты" }
    );
  }

  return (
    <Box sx={{ textAlign: "left" }}>
      {user && (user.role === "admin" || user.role === "superAdmin" )&& (
          <p style={{ color: "lightgray", fontSize: "14px", marginBottom: theme.spacing.xs }}>
            Кабинет администрации
          </p>
      )}

      {user?.role !== "admin" && user?.role !== "superAdmin" && (
          <p style={{ color: theme.colors.rgbaGrey, fontSize:  theme.fonts.size.sm, marginBottom: "8px", fontWeight: theme.fonts.weight.medium }}>
            Кабинет покупателя
          </p>
      )}
      <Box component="ul" sx={{ listStyle: "none", padding: 0, margin: 0 }}>
        {links.map((item) => (
          <Box component="li" key={item.to} sx={{ marginBottom: theme.spacing.exs }}>
            <NavLink
              to={item.to}
              style={{
                color: theme.colors.white,
                textDecoration: "none",
                transition: "color 0.3s",
                fontSize:  theme.fonts.size.sm
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

export default CabinetBlockFooter;
