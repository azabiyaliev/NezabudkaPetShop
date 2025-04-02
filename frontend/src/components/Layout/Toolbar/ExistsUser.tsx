import  { useState } from 'react';
import { Box, Button, Drawer, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectUser, unsetUser } from "../../../store/users/usersSlice.ts";
import { addErrorFromSlice, clearError } from '../../../store/brands/brandsSlice.ts';


const ExistsUser = () => {
  const addError = useAppSelector(addErrorFromSlice);
  const dispatch = useAppDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const user = useAppSelector(selectUser);

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  const userLogout = () => {
    dispatch(unsetUser());
  };

  const toggleBrand = (open: boolean) => {
    setIsDrawerOpen(open);
    if (addError !== null) {
      dispatch(clearError());
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button onClick={toggleDrawer(true)} style={{ color: 'black' }}>
          Мой профиль
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
            {user?.firstName} {user?.secondName}
          </Typography>
          <Divider />

          {user && user.role === 'admin' || user && user.role === 'superAdmin' && (
            <List>
              <ListItem  component={NavLink} to={`/private_account`} onClick={toggleDrawer(false)}>
                <ListItemText primary="Личный кабинет" className='text-black'/>
              </ListItem>
              <ListItem  component={NavLink} to={`/admin-table`} onClick={toggleDrawer(false)}>
                <ListItemText primary="Администраторы" className='text-black'/>
              </ListItem>
              <ListItem  component={NavLink} to={`/admin-create`} onClick={toggleDrawer(false)}>
                <ListItemText primary="Создать администратора" className='text-black'/>
              </ListItem>
              <ListItem  component={NavLink} to={`/private/users/${user.id}`} onClick={toggleDrawer(false)}>
                <ListItemText primary="Редактировать профиль" className='text-black'/>
              </ListItem>
              <ListItem  component={NavLink} to="/private/client_orders" onClick={toggleDrawer(false)}>
                <ListItemText primary="Заказы" className='text-black'/>
              </ListItem>
              <ListItem  component={NavLink} to="/private/clients" onClick={toggleDrawer(false)}>
                <ListItemText primary="Клиенты" className='text-black'/>
              </ListItem>
              <ListItem  component={NavLink} to={`/edition_site`} onClick={toggleDrawer(false)}>
                <ListItemText primary="Редактирование сайта" className='text-black'/>
              </ListItem>
              <ListItem  component={NavLink} to="/private/brands" onClick={() => toggleBrand(false)}>
                <ListItemText primary="Бренды" className='text-black' />
              </ListItem>
              <ListItem  component={NavLink} to="/private/all_products" onClick={toggleDrawer(false)}>
                <ListItemText primary="Товары" className='text-black'/>
              </ListItem>
              <ListItem  component={NavLink} to="/private/all_categories" onClick={toggleDrawer(false)}>
                <ListItemText primary="Все категории" className='text-black'/>
              </ListItem>
            </List>
          )}

          {user && user.role === 'client' && (
            <List>
              <ListItem  component={NavLink} to={`/my_account`} onClick={toggleDrawer(false)}>
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
            </List>
          )}
          <ListItem onClick={userLogout}>
            <ListItemText primary="Выйти" className='text-black'/>
          </ListItem>
        </Box>
      </Drawer>
    </>
  );
};

export default ExistsUser;