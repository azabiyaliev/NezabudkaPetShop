import { List, ListItem, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';
import './Admin.css'

const AdminBar  = () => {
  return (
    <div className="admin-bar">
      <List>
        <ListItem  component={NavLink} to={`/private_account`}>
          <b className="text-uppercase text-black">Личный кабинет</b>
        </ListItem>
        <hr/>
        <ListItem  component={NavLink} to={`/private`}>
          <ListItemText primary="Редактировать профиль" className='text-black'/>
        </ListItem>
        <ListItem  component={NavLink} to="/private/client_orders" >
          <ListItemText primary="Заказы" className='text-black'/>
        </ListItem>
        <ListItem  component={NavLink} to="/private/clients" >
          <ListItemText primary="Клиенты" className='text-black'/>
        </ListItem>
        <ListItem  component={NavLink} to="/private/edit_site" >
          <ListItemText primary="Редактирование сайта" className='text-black'/>
        </ListItem>
        <ListItem  component={NavLink} to="/private/add_brand">
          <ListItemText primary="Добавить бренд" className='text-black' />
        </ListItem>
        <ListItem  component={NavLink} to="/private/all_products" >
          <ListItemText primary="Все товары" className='text-black'/>
        </ListItem>
        <ListItem  component={NavLink} to="/private/all_categories" >
          <ListItemText primary="Все категории" className='text-black'/>
        </ListItem>
      </List>
    </div>
  );
};

export default AdminBar;