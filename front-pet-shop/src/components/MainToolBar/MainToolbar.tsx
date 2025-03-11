'use client'
import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Container, Typography, IconButton, InputBase, Badge, Box, Button } from '@mui/material';
import { Search, ShoppingCart, Favorite, Phone } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import LogoPic from '../../../public/logo.jpg';
import Cookies from "js-cookie";
import { Nav, Offcanvas } from 'react-bootstrap';
import UnknownUser from "@/components/MainToolBar/UnknownUser";

interface User {
    firstName: string;
    secondName: string;
    role: string;
}

const MainToolbar = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const userCookie = Cookies.get('user');
        console.log('User cookie:', userCookie);

        if (userCookie) {
            const userData = JSON.parse(userCookie);
            console.log('Parsed user data:', userData);
            setUser(userData);
        } else {
            console.log('No user cookie found');
        }
    }, []);

    const toggleDrawer = (open: boolean) => () => {
        setIsDrawerOpen(open);
    };

    return (
        <div>
            <Box sx={{  padding: '5px 0' }}>
                <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <Link href='/'>
                            <IconButton>
                                <Phone />
                            </IconButton>
                        </Link>
                        <Typography variant="body2">11:00 - 19:00 без выходных</Typography>
                    </Box>
                    <Typography variant="body2">Call us: +123456789</Typography>
                </Container>
            </Box>

            <AppBar
                position="sticky"
                sx={{
                    boxShadow: 'none',
                    paddingBottom: '10px',
                    paddingTop: '10px',
                    backgroundColor: '#FFF8E1',
                    borderBottom: '3px solid #FFEB3B',
                    borderTop: '3px solid #FFEB3B',
                    zIndex: isDrawerOpen ? 0 : 1100,
                }}
            >
                <Container>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <Image src={LogoPic} alt="Nezabудка" width={86} height={86} />
                            <Typography variant="h5" sx={{ color: 'black', fontFamily: 'COMIC SANS MS, sans-serif', marginLeft: 1, textTransform: 'uppercase' }}>
                                Незабудка
                            </Typography>
                        </Link>

                        <Box sx={{ display: 'flex', alignItems: 'center', width: '300px', border: '1px solid #d3d3d3', borderRadius: '4px' }}>
                            <InputBase
                                placeholder="Поиск товаров"
                                sx={{ paddingLeft: 2, width: '100%' }}
                            />
                            <IconButton sx={{
                                backgroundColor: '#FFEB3B',
                                height: '100%',
                                borderRadius: '0',
                                padding: "10px,10px"
                            }}>
                                <Search />
                            </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <Link href="/client/my_cart" style={{ textDecoration: 'none' }}>
                                <IconButton>
                                    <Badge badgeContent={4} color="primary">
                                        <ShoppingCart />
                                    </Badge>
                                </IconButton>
                            </Link>

                            <Link href="/client/my_favorites" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                                <IconButton>
                                    <Badge badgeContent={2} color="error">
                                        <Favorite />
                                    </Badge>
                                </IconButton>
                            </Link>

                            {user ? (
                                <Button onClick={toggleDrawer(true)} style={{ color: 'black' }}>
                                    Мой аккаунт
                                </Button>
                            ) : (
                                <UnknownUser />
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Offcanvas
                show={isDrawerOpen}
                onHide={toggleDrawer(false)}
                placement="end"
                style={{ zIndex: 1050 }}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title style={{ fontFamily: 'COMIC SANS MS, sans-serif', marginLeft: '20px', marginTop: '10px' }}>
                        {user?.firstName} {user?.secondName}
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <hr />
                <Offcanvas.Body>
                    {user && user.role === 'admin' && (
                        <Nav defaultActiveKey="/" className="flex-column" style={{ padding: '15px' }}>
                            <Link href="/admin/cabinet" onClick={toggleDrawer(false)}>
                                <Button variant="text"  sx={{ textAlign: 'left', padding: '10px', color: 'rgb(119, 119, 119)' }}>
                                    Личный кабинет админа
                                </Button>
                            </Link>
                            <Link href="/admin/client_orders" onClick={toggleDrawer(false)}>
                                <Button variant="text"  sx={{ textAlign: 'left', padding: '10px', color: 'rgb(119, 119, 119)' }}>
                                    Заказы
                                </Button>
                            </Link>
                            <Link href="/admin/clients" onClick={toggleDrawer(false)}>
                                <Button variant="text"  sx={{textAlign: 'left', padding: '10px', color: 'rgb(119, 119, 119)' }}>
                                    Наши клиенты
                                </Button>
                            </Link>

                            <Link href="/admin/add_brand" onClick={toggleDrawer(false)}>
                                <Button variant="text"  sx={{ textAlign: 'left', padding: '10px', color: 'rgb(119, 119, 119)'}}>
                                    Добавить бренд
                                </Button>
                            </Link>
                            <Link href="/admin/all_products" onClick={toggleDrawer(false)}>
                                <Button variant="text"  sx={{ textAlign: 'left', padding: '10px', color: 'rgb(119, 119, 119)' }}>
                                    Все товары
                                </Button>
                            </Link>
                            <Link href="/admin/all_categories" onClick={toggleDrawer(false)}>
                                <Button variant="text"  sx={{ textAlign: 'left', padding: '10px', color: 'rgb(119, 119, 119)' }}>
                                    Все категории
                                </Button>
                            </Link>
                            <Link href="/admin/edit_site" onClick={toggleDrawer(false)}>
                                <Button variant="text"  sx={{ textAlign: 'left', padding: '10px', color: 'rgb(119, 119, 119)' }}>
                                    Редактирование сайта
                                </Button>
                            </Link>
                            <Button
                                variant="contained"
                                fullWidth
                                color="error"
                                sx={{ marginTop: '15px', padding: '10px', fontWeight: 'bold' }}
                                onClick={() => {
                                    Cookies.remove('user');
                                    setUser(null);
                                }}
                            >
                                Выйти
                            </Button>
                        </Nav>
                    )}

                    {user && user.role === 'client' && (
                        <Nav defaultActiveKey="/" className="flex-column" style={{ padding: '15px' }}>
                            <Link href="/client/my_profile" onClick={toggleDrawer(false)}>
                                <Button variant="text" sx={{ textAlign: 'left', padding: '10px', color: 'rgb(119, 119, 119)' }}>
                                    Личный кабинет
                                </Button>
                            </Link>

                            <Link href="/client/my_orders" onClick={toggleDrawer(false)}>
                                <Button variant="text" sx={{ textAlign: 'left', padding: '10px', color: 'rgb(119, 119, 119)' }}>
                                    Мои Заказы
                                </Button>
                            </Link>

                            <Link href="/client/my_cart" onClick={toggleDrawer(false)}>
                                <Button variant="text" sx={{ textAlign: 'left', padding: '10px', color: 'rgb(119, 119, 119)' }}>
                                    Корзина
                                </Button>
                            </Link>

                            <Link href="/client/my_favorites" onClick={toggleDrawer(false)}>
                                <Button variant="text" sx={{ textAlign: 'left', padding: '10px', color: 'rgb(119, 119, 119)' }}>
                                    Избранные
                                </Button>
                            </Link>

                            <Button
                                variant="contained"
                                fullWidth
                                color="error"
                                sx={{ marginTop: '15px', padding: '10px', fontWeight: 'bold' }}
                                onClick={() => {
                                    Cookies.remove('user');
                                    setUser(null);
                                }}
                            >
                                Выйти
                            </Button>
                        </Nav>
                    )}

                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default MainToolbar;
