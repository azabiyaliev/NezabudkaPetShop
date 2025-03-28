import {
  Badge,
  badgeClasses,
  Box,
  Container,
  styled,
  Toolbar
} from '@mui/material';
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
import { selectUser } from '../../../store/users/usersSlice.ts';
import { useEffect, useState } from 'react';
import CustomCart from '../../Domain/CustomCart/CustomCart.tsx';
import { cartsFromSlice } from '../../../store/cart/cartSlice.ts';
import { getCart } from '../../../store/cart/cartThunk.ts';
import { selectProducts } from '../../../store/products/productsSlice.ts';
import { getProducts } from '../../../store/products/productsThunk.ts';
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
  const products = useAppSelector(selectProducts);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    if (search) {
      dispatch(getProducts(debouncedSearch));
    } else {
      dispatch(getProducts(''));
    }

    dispatch(getCart()).unwrap();
  }, [dispatch, debouncedSearch, search]);


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
            <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
              <input
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  padding: "12px 16px",
                  fontSize: "16px",
                  color: "#fff",
                  backgroundColor: "#5b7133",
                  border: "2px solid #475726",
                  borderRadius: "12px",
                  outline: "none",
                  transition: "all 0.3s ease-in-out",
                  boxShadow: "0 4px 10px rgba(91, 113, 51, 0.3)",
                }}
                placeholder="Поиск товара"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = "#d4d9c5";
                  e.target.style.boxShadow = "0 0 8px rgba(91, 113, 51, 0.5)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#475726";
                  e.target.style.boxShadow = "0 4px 10px rgba(91, 113, 51, 0.3)";
                }}
              />

              {search && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    maxHeight: 300,
                    overflowY: 'auto',
                    backgroundColor: 'white',
                    boxShadow: 3,
                    zIndex: 1000,
                    marginTop: 1,
                    borderRadius: 1,
                  }}
                >
                  {products.length > 0 ? (
                    products.map((product) => (
                      <NavLink className='text-decoration-none text-black' to={`/product/${product.id}`} onClick={() => setSearch('')}>
                      <div key={product.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <h3>{product.productName}</h3>
                        <p>{product.productDescription}</p>
                      </div>
                      </NavLink>
                    ))
                  ) : (
                    <div style={{ padding: '10px' }}>Товаров не найдено</div>
                  )}
                </Box>
              )}
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
