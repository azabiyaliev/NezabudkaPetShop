import {
  AppBar, Badge, badgeClasses,
  Box, Button,
  Container, styled,
  Toolbar
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import {useAppSelector} from "../../app/hooks.ts";
import ExistsUser from "./ExistsUser.tsx";
import UnknownUser from "./UnknownUser.tsx";
import TextField from "@mui/material/TextField";
import logo from '../../assets/logo.jpg'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Typography from '@mui/material/Typography';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import './Fonts.css'
import { Search } from '@mui/icons-material';
import { selectEditSite } from '../../features/editionSite/editionSiteSlice.ts';
import React from 'react';
import CustomCart from '../CustomCart/CustomCart.tsx';

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

const MainToolbar = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const user = useAppSelector((state) => state.users.user);
  const editSite = useAppSelector(selectEditSite);
  const editSiteData = editSite!;

  const openCart = () => {
    setOpen(true);
  };

  const closeCart = () => {
    setOpen(false);
  };


  return (
    <>
      <CustomCart openCart={open} closeCart={() => closeCart()}/>
      <Box sx={{
        textAlign: 'right',
        borderBottom: '1px solid #D3D3D3',
        marginBottom: '10px',
        padding: '2px'
      }}>
        <Container>
            <Box sx={{
              display: 'flex',
              justifyContent: 'right',
              gap: '30px',
              alignItems: 'center'
            }}>
              <Box>
                <NavLink to='https://www.instagram.com/nezabudka.zoo/'
                         style={{
                           marginRight: '10px',
                         }}>
                  <InstagramIcon
                  sx={{
                    width: '18px',
                    color: 'black',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: 'yellow',
                    }
                  }}/>
                </NavLink>

                <NavLink to='https://api.whatsapp.com/send?phone=996555338899'
                         style={{
                           marginRight: '10px',
                         }}>
                  <WhatsAppIcon
                    sx={{
                      width: '18px',
                      color: 'black',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: 'yellow',
                      }
                    }}/>
                </NavLink>

               <NavLink content='+996 555 33 88 99' to='/'>
                   <LocalPhoneIcon
                     sx={{
                       width: '18px',
                       color: 'black',
                       transition: 'color 0.3s ease',
                       '&:hover': {
                         color: 'yellow',
                       }
                     }}/>
                </NavLink>
              </Box>
              <Box>
              <Typography
              sx={{
                fontSize: '12px'
              }}>
                11.00 - 19.00 без выходных
              </Typography>
              </Box>
            </Box>
        </Container>
      </Box>
      <AppBar
      sx={{
        backgroundColor: '#fff',
        position: 'static',
        boxShadow: 'none',
        borderBottom: '1px solid yellow',
      }}>
          <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '10px',
          }}>

            <NavLink to='/' className='text-decoration-none d-flex align-items-center gap-2'>
               <Box
               component='img'
               src={logo}
               alt='Nezabudka'
                sx={{
                  height: '86px',
                  width: '86px',
                  cursor: 'pointer',
                }}
               />
              <Typography
              sx={{
                fontFamily: 'font-link',
                color: 'black'
              }}>
                  Незабудка
              </Typography>
            </NavLink>

            <Box>
              <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}>
              <TextField fullWidth label="Поиск" id="fullWidth"/>
                <Button sx={{backgroundColor: 'yellow', height: '56px'}}>
                <Search sx={{
                  color: 'black',
                  }}/>
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Button variant='text'
                onClick={() => openCart()}
                sx={{
                  marginRight: '15px',
                  '&:hover': {
                    background: 'inherit'
                }
              }}>
                <ShoppingCartIcon fontSize="small"
                                  sx={{
                                    color: 'black',
                                    transition: 'color 0.2s ease',
                                    '&:hover': {
                                      color: 'yellow',
                                      background: 'inherit'
                                    }
                                  }}/>
                <CartBadge badgeContent={1} color="success" overlap="circular" />
             </Button>

              <NavLink to='/my_favorites' className='text-decoration-none'>
                <FavoriteIcon fontSize="small"
                                  sx={{
                                    color: 'black',
                                    transition: 'color 0.2s ease',
                                    '&:hover': {
                                      color: 'yellow',
                                    }
                                  }}/>
                <CartBadge badgeContent={1} color="success" overlap="circular" />
              </NavLink>
            </Box>

            {user ? (
              <>
                <ExistsUser user={user}
                            editSite={editSiteData}
                />
              </>
            ) : (
              <>
                <UnknownUser/>
              </>
            )}
          </Toolbar>
      </AppBar>
    </>
  );
};

export default MainToolbar;