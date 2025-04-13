import {  List, ListItem, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';


const ByuerBarTopTollBar = () => {

  return (
    <div>
        <List>
          <ListItem component={NavLink} to={`/my_company`}>
            <ListItemText
              primary="O компании"
              className="text-black"
            />
          </ListItem>
          <ListItem component={NavLink} to="/delivery">
            <ListItemText
              primary="Доставка и оплата"
              className="text-black"
            />
          </ListItem>
          <ListItem component={NavLink} to="/bonus_program">
            <ListItemText primary="Бонусная прогорамма" className="text-black" />
          </ListItem>
          <ListItem component={NavLink} to="/contacts">
            <ListItemText primary="Контакты" className="text-black" />
          </ListItem>
        </List>
    </div>
  );
};

export default ByuerBarTopTollBar;