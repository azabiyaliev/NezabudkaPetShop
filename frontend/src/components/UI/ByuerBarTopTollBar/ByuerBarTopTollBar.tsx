import { List, ListItem, ListItemText } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { Box } from '@mui/joy';

const ByuerBarTopTollBar = () => {
  const location = useLocation();

  return (
    <Box>
      <List sx={{
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: "250px",
        "@media (max-width: 820px)": {
          width: "100%",
        },
      }}>
        <ListItem
          component={NavLink}
          to="/my_company"
          sx={{
            p: 1,
            textDecoration: 'none',
            borderBottom:
              location.pathname === '/my_company' ? '1px solid #228B22' : 'none',
            transition: 'border-bottom 0.3s',
            width: '80%',
            "@media (max-width: 820px)": {
              width: "100%",
              textAlign: 'center',
            },
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
            transition: 'border-bottom 0.3s',
            width: '80%',
            "@media (max-width: 820px)": {
              width: "100%",
              textAlign: 'center',
            },
          }}
        >
          <ListItemText
            primary="Доставка и оплата"
            primaryTypographyProps={{
              sx: { color: '#000', fontWeight: 500, fontSize: '1rem'},
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
            width: '80%',
            "@media (max-width: 820px)": {
              width: "100%",
              textAlign: 'center',
            },
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
            width: '80%',
            "@media (max-width: 820px)": {
              width: "100%",
              textAlign: 'center',
            },
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
    </Box>
  );
};

export default ByuerBarTopTollBar;
