import { List, ListItem, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';
import "./Client.css";
import { useAppSelector } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';

const ClientBar = () => {
  const user = useAppSelector(selectUser);
  return (
    <div className="client-bar" >
      {user && user.role === 'client' && (
        <List>
          <ListItem  component={NavLink} to={`/my_account`} >
            <ListItemText primary="Личный кабинет" className='text-black'/>
          </ListItem>
          <ListItem  component={NavLink} to={`/client/users/${user && user.id}`}>
            <ListItemText primary="Мои данные" className='text-black'/>
          </ListItem>
          <ListItem  component={NavLink} to="/my_orders" >
            <ListItemText primary="Мои Заказы" className='text-black'/>
          </ListItem>
          <ListItem  component={NavLink} to="/my_cart">
            <ListItemText primary="Корзина" className='text-black'/>
          </ListItem>
          <ListItem  component={NavLink} to="/my_whishlist">
            <ListItemText primary="Избранные" className='text-black'/>
          </ListItem>
        </List>
      )}

    </div>
  );
};

export default ClientBar;