import { List, ListItem, ListItemText } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';

const ByuerBarTopTollBar = () => {
  const location = useLocation();

  return (
    <div>
      <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 1, width:"250px" }}>
        <ListItem
          component={NavLink}
          to="/my_company"
          sx={{
            p: 1,
            textDecoration: 'none',
            borderBottom:
              location.pathname === '/my_company' ? '1px solid #228B22' : 'none',
            transition: 'border-bottom 0.3s',
          }}
        >
          <ListItemText
            primary="О компании"
            primaryTypographyProps={{
              sx: { color: '#000', fontWeight: 500, fontSize: '1rem' },
            }}
          />
        </ListItem>

        <ListItem
          component={NavLink}
          to="/delivery"
          sx={{
            p: 1,
            textDecoration: 'none',
            borderBottom:
              location.pathname === '/delivery' ? '1px solid #228B22' : 'none',
            transition: 'border-bottom 0.1s',
          }}
        >
          <ListItemText
            primary="Доставка и оплата"
            primaryTypographyProps={{
              sx: { color: '#000', fontWeight: 500, fontSize: '1rem' },
            }}
          />
        </ListItem>

        <ListItem
          component={NavLink}
          to="/bonus_program"
          sx={{
            p: 1,
            textDecoration: 'none',
            borderBottom:
              location.pathname === '/bonus_program' ? '1px solid #228B22' : 'none',
            transition: 'border-bottom 0.3s',
          }}
        >
          <ListItemText
            primary="Бонусная программа"
            primaryTypographyProps={{
              sx: { color: '#000', fontWeight: 500, fontSize: '1rem' },
            }}
          />
        </ListItem>

        <ListItem
          component={NavLink}
          to="/contacts"
          sx={{
            p: 1,
            textDecoration: 'none',
            borderBottom:
              location.pathname === '/contacts' ? '1px solid #228B22' : 'none',
            transition: 'border-bottom 0.3s',
          }}
        >
          <ListItemText
            primary="Контакты"
            primaryTypographyProps={{
              sx: { color: '#000', fontWeight: 500, fontSize: '1rem' },
            }}
          />
        </ListItem>
      </List>
    </div>
  );
};

export default ByuerBarTopTollBar;
