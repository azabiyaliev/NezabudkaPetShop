import { Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../../../app/hooks.ts';
import { selectUser } from '../../../../store/users/usersSlice.ts';

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
      { to: "/private/client_orders", label: "Заказы" },
      { to: "/private/clients", label: "Клиенты" }
    );
  } else if (user.role === "superAdmin") {
    links.push(
      { to: "/private/order_stats", label: "Статистика" },
      { to: "/private/products", label: "Товары" },
      { to: "/private/client_orders", label: "Заказы" },
      { to: "/private/clients", label: "Клиенты" }
    );
  }

  return (
    <Box sx={{ textAlign: "left" }}>
      <p style={{ color: "lightgray", fontSize: "14px", marginBottom: "8px" }}>
        Кабинет покупателя
      </p>
      <Box component="ul" sx={{ listStyle: "none", padding: 0, margin: 0 }}>
        {links.map((item) => (
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

export default CabinetBlockFooter;
