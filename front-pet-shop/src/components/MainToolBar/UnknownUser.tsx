'use client'
import React, { useState } from 'react';

import { PersonCircle } from 'react-bootstrap-icons';
import { makeStyles } from '@mui/styles';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import Link from "next/link";

const useStyles = makeStyles({
    button: {
        color: '#333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '14px',
        padding: '5px 10px',
        '&:hover': {
            backgroundColor: '#f1f1f1',
        },
    },
    menu: {
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    menuItem: {
        color: '#333',
        fontSize: '14px',
        padding: '10px 20px',
        '&:hover': {
            backgroundColor: '#e0e0e0',
        },
    },
    personIcon: {
        fontSize: '30px',
        color: "black",
    },
    label: {
        fontSize: '12px',
        textTransform: 'uppercase',
        marginTop: '5px',
        fontWeight: '600',
    }
});

const UnknownUser = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        console.log('войти')
    };

    return (
        <>
            <Box display="flex" alignItems="center" gap="8px">
                <Button
                    onClick={handleMenuOpen}
                    variant="text"
                    className={classes.button}
                >
                    <PersonCircle className={classes.personIcon} />
                    <Typography className={classes.label}>Войти</Typography>
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    className={classes.menu}
                >
                    <MenuItem onClick={handleMenuClose} className={classes.menuItem}>
                        <Link href="/users/register" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Войти
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose} className={classes.menuItem}>
                        <Link href="/users/register" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Зарегистрироваться
                        </Link>
                    </MenuItem>
                </Menu>
            </Box>
        </>
    );
};

export default UnknownUser;
