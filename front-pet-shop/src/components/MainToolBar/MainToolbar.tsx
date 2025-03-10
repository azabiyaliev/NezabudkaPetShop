'use client'
import React, {useEffect, useState} from 'react';
import { AppBar, Toolbar, Container, Typography, IconButton, InputBase, Badge, Box } from '@mui/material';
import { Search, ShoppingCart, Favorite, Phone } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import LogoPic from '../../../public/logo.jpg';
import ExistsUser from "@/components/MainToolBar/ExistsUser";
import UnknownUser from "@/components/MainToolBar/UnknownUser";
import Cookies from "js-cookie";

const MainToolbar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        }
    }, []);

    return (
        <div>
            <Box sx={{ backgroundColor: '#f0f0f0', padding: '5px 0' }}>
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

            <AppBar position="sticky" sx={{ boxShadow: 'none', paddingBottom: '10px', paddingTop: '10px', backgroundColor: 'white', borderBottom: '3px solid #FFEB3B' }}>
                <Toolbar>
                    <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Логотип */}
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <Image src={LogoPic} alt="Nezabudka" width={86} height={86} />
                            <Typography variant="h5" sx={{ color: 'black', fontFamily: 'COMIC SANS MS, sans-serif', marginLeft: 1, textTransform: 'uppercase' }}>
                                Незабудка
                            </Typography>
                        </Link>

                        {/* Поиск */}
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '300px', border: '1px solid #d3d3d3', borderRadius: '4px' }}>
                            <InputBase
                                placeholder="Поиск"
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

                        <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
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
                                <Typography variant="body2" sx={{ marginLeft: 1, color: '#333' }}>Избранное</Typography>
                            </Link>
                        </Box>
                    </Container>
                </Toolbar>
                {user ? (
                    <ExistsUser user={user} />
                ) : (
                    <UnknownUser />
                )}
            </AppBar>
        </div>
    );
};

export default MainToolbar;
