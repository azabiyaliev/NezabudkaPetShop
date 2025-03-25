import { Badge, badgeClasses, Box, Button, Container, InputBase, styled, Toolbar } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import ExistsUser from './ExistsUser.tsx';
import UnknownUser from './UnknownUser.tsx';
import logo from '../../../assets/logo.jpg'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Typography from '@mui/material/Typography';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import './Fonts.css'
import { selectEditSite } from '../../../store/editionSite/editionSiteSlice.ts';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { useEffect, useState } from 'react';
import CustomCart from '../../Domain/CustomCart/CustomCart.tsx';
import { cartsFromSlice } from '../../../store/cart/cartSlice.ts';
import { getCart } from '../../../store/cart/cartThunk.ts';

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

const MainToolbar = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const user = useAppSelector(selectUser);
  const site = useAppSelector(selectEditSite);
  const cart = useAppSelector(cartsFromSlice);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCart()).unwrap();
  }, [dispatch]);

  const closeCart = () => {
    setOpenCart(false);
    navigate('/');
  };

  const checkProductInCart: number[] = cart.map((product) => {
    return product.quantity;
  });

  const sum: number = checkProductInCart.reduce((acc: number, i: number) => {
    acc = acc + i;
    return acc;
  }, 0);

  return (
    <div>
      <CustomCart openCart={openCart} closeCart={closeCart}/>
      <Box sx={{
        textAlign: 'left',
        padding: '15px',
      }}>
        <Container>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '30px',
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
            }}>
              <NavLink
                style={{
                  color: 'black',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                }}
                to='/'
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    backgroundColor: 'rgb(255, 250, 180)',
                    padding: '10px',
                    marginRight: '10px',
                  }}
                >
                  <PhoneInTalkOutlinedIcon
                    sx={{
                      color: 'black',
                      transition: 'color 0.3s ease',
                      width: '24px',
                      height: '24px',
                    }}
                  />
                </div>
                {site?.phone}
              </NavLink>
              <NavLink
                style={{
                  color: 'black',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                }}
                to='/'
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    backgroundColor: 'rgb(255, 250, 180)',
                    padding: '10px',
                    marginRight: '10px',
                  }}
                >
                  <LocationOnOutlinedIcon
                    sx={{
                      color: 'black',
                      transition: 'color 0.3s ease',
                      width: '24px',
                      height: '24px',
                    }}
                  />
                </div>
                {site?.address}
              </NavLink>
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <NavLink to='https://www.instagram.com/nezabudka.zoo/' >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    backgroundColor: 'hsl(50, 100%, 90%)',
                    padding: '10px',
                    marginRight: '10px',
                  }}
                >
                  <InstagramIcon
                    sx={{
                      width: '18px',
                      color: 'black',
                    }}
                  />
                </div>
              </NavLink>
              <NavLink to='https://api.whatsapp.com/send?phone=996555338899' style={{ marginRight: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    backgroundColor: 'hsl(50, 100%, 90%)',
                    padding: '10px',
                    marginRight: '10px',
                  }}
                >
                  <WhatsAppIcon
                    sx={{
                      width: '18px',
                      color: 'black',
                    }}
                  />
                </div>
              </NavLink>
            </Box>
          </Box>
        </Container>
      </Box>
      <hr/>
      <Container>
        <Box
          sx={{
            backgroundColor: 'white',
            position: 'static',
          }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding:'20px',
            }}
          >
            <NavLink to='/' className='text-decoration-none d-flex align-items-center gap-2'>
              <Box
                component='img'
                src={logo}
                alt='Nezabudka'
                sx={{
                  height: '70px',
                  width: '70px',
                  cursor: 'pointer',
                  marginRight: '15px',
                }}
              />
              <div>
                <Typography
                  sx={{
                    fontSize: '28px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    fontFamily: 'Georgia, sans-serif',
                    color: 'black',
                    cursor: 'pointer',
                  }}
                >
                  Незабудка
                </Typography>
                <Typography
                  sx={{
                    marginTop: '10px',
                    fontSize: '12px',
                    fontFamily: 'Montserrat, sans-serif',
                    textTransform: 'uppercase',
                    color: 'black',
                  }}
                >
                  Zoo магазин
                </Typography>
              </div>
            </NavLink>
            <Box>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
              }}>
                <InputBase
                  placeholder="Поиск товаров"
                  sx={{  width: '100%', border: '1px solid lightgray', padding: '5px', borderRight:'none' }}
                />
                <Button sx={{
                  backgroundColor: '#FFEB3B',
                  height: '100%',
                  padding: '10px',
                  color:'black'
                }}>
                  <SearchOutlinedIcon/>
                </Button>
              </Box>
            </Box>
            {user ? user.role === 'client' && (
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <div  className='text-decoration-none me-4'>
                  <ShoppingCartIcon fontSize="small" onClick={() => setOpenCart(true)}
                                    sx={{
                                      color: 'black',
                                      transition: 'color 0.2s ease',
                                      '&:hover': {
                                        color: 'yellow',
                                      },
                                    }} />
                  <CartBadge badgeContent={sum} color="success" overlap="circular" />
                </div>

                <NavLink to='/my_favorites' className='text-decoration-none'>
                  <FavoriteIcon fontSize="small"
                                sx={{
                                  color: 'black',
                                  transition: 'color 0.2s ease',
                                  '&:hover': {
                                    color: 'yellow',
                                  },
                                }} />
                  <CartBadge badgeContent={1} color="success" overlap="circular" />
                </NavLink>
              </Box>
            ) :
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <div  className='text-decoration-none me-4'>
                  <ShoppingCartIcon fontSize="small" onClick={() => setOpenCart(true)}
                                    sx={{
                                      color: 'black',
                                      transition: 'color 0.2s ease',
                                      '&:hover': {
                                        color: 'rgba(250, 179, 1, 1)',
                                      },
                                    }} />
                  <CartBadge badgeContent={sum} color="success" overlap="circular" />
                </div>

                <NavLink to='/my_favorites' className='text-decoration-none'>
                  <FavoriteIcon fontSize="small"
                                sx={{
                                  color: 'black',
                                  transition: 'color 0.2s ease',
                                  '&:hover': {
                                    color: 'rgba(250, 179, 1, 1)',
                                  },
                                }} />
                  <CartBadge badgeContent={1} color="success" overlap="circular" />
                </NavLink>
              </Box>
            }
            {user ? (
              <ExistsUser/>
            ) : (
              <UnknownUser />
            )}
          </Toolbar>
        </Box>
      </Container>
    </div>
  );
};

export default MainToolbar;
