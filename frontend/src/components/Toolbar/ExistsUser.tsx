import React, { useState } from 'react';
import { Box, Button, Drawer, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { User } from '../../types';
import { useAppDispatch } from '../../app/hooks';
import { unsetUser } from '../../features/users/usersSlice';

interface Props {
  user: User;
}

const ExistsUser: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  const userLogout = () => {
    dispatch(unsetUser());
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button onClick={toggleDrawer(true)} style={{ color: 'black' }}>
          {user.firstName}  {user.secondName}
        </Button>
      </Box>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{
            width: 250,
            padding: 2
        }}>
          <Typography
            variant="h6"
            sx={{
              marginBottom: 2
          }}>
            {user.firstName} {user.secondName}
          </Typography>
          <Divider />

          {user && user.role === 'admin' && (
            <List>
              <ListItem  component={NavLink} to={`/private_account}`} onClick={toggleDrawer(false)}>
                <ListItemText primary="Личный кабинет" className='text-black'/>
              </ListItem>
              <ListItem  component={NavLink} to={`/users/${user.id}`} onClick={toggleDrawer(false)}>
                <ListItemText primary="Редактировать профиль" className='text-black'/>
              </ListItem>
              <ListItem  component={NavLink} to="/private/client_orders" onClick={toggleDrawer(false)}>
                <ListItemText primary="Заказы" className='text-black'/>
              </ListItem>
              <ListItem  component={NavLink} to="/private/clients" onClick={toggleDrawer(false)}>
                <ListItemText primary="Клиенты" className='text-black'/>
              </ListItem>
              <ListItem  component={NavLink} to="/private/edit_site" onClick={toggleDrawer(false)}>
                <ListItemText primary="Редактирование сайта" className='text-black'/>
              </ListItem>
              <ListItem  component={NavLink} to="/private/add_brand" onClick={toggleDrawer(false)}>
                <ListItemText primary="Добавить бренд" className='text-black' />
              </ListItem>
              <ListItem  component={NavLink} to="/private/all_products" onClick={toggleDrawer(false)}>
                <ListItemText primary="Все товары" className='text-black'/>
              </ListItem>
              <ListItem  component={NavLink} to="/private/all_categories" onClick={toggleDrawer(false)}>
                <ListItemText primary="Все категории" className='text-black'/>
              </ListItem>
            </List>
          )}

          <List>
            <ListItem  component={NavLink} to="/my_profile" onClick={toggleDrawer(false)}>
              <ListItemText primary="Личный кабинет" className='text-black'/>
            </ListItem>
            <ListItem  component={NavLink} to="/my_orders" onClick={toggleDrawer(false)}>
              <ListItemText primary="Мои Заказы" className='text-black'/>
            </ListItem>
            <ListItem  component={NavLink} to="/my_cart" onClick={toggleDrawer(false)}>
              <ListItemText primary="Корзина" className='text-black'/>
            </ListItem>
            <ListItem  component={NavLink} to="/my_whishlist" onClick={toggleDrawer(false)}>
              <ListItemText primary="Избранные" className='text-black'/>
            </ListItem>
            <ListItem onClick={userLogout}>
              <ListItemText primary="Выйти" className='text-black'/>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default ExistsUser;