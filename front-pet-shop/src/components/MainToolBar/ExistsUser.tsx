'use client'
import React, { useState } from 'react';
import { Button, Offcanvas, Nav } from 'react-bootstrap';
import Link from "next/link";
import { User } from "@/types";

interface Props {
    user: User;
}

const ExistsUser: React.FC<Props> = ({ user }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = (open: boolean) => () => {
        setIsDrawerOpen(open);
    };

    return (
        <>
            <Button variant="link" onClick={toggleDrawer(true)} style={{ color: 'black' }}>
                {user.firstName && user.secondName}
            </Button>

            <Offcanvas
                show={isDrawerOpen}
                onHide={toggleDrawer(false)}
                placement="end"
                style={{ zIndex: 1050 }}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        {user.firstName} {user.secondName}
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {user && user.role === 'admin' && (
                        <Nav defaultActiveKey="/" className="flex-column">
                            <Link href="/private" onClick={toggleDrawer(false)}>Личный кабинет</Link>
                            <Link href="/private/client_orders" onClick={toggleDrawer(false)}>Заказы</Link>
                            <Link href="/private/clients" onClick={toggleDrawer(false)}>Клиенты</Link>
                            <Link href="/private/edit_site" onClick={toggleDrawer(false)}>Редактирование сайта</Link>
                            <Link href="/private/add_brand" onClick={toggleDrawer(false)}>Добавить бренд</Link>
                            <Link href="/private/all_products" onClick={toggleDrawer(false)}>Все товары</Link>
                            <Link href="/private/all_categories" onClick={toggleDrawer(false)}>Все категории</Link>
                        </Nav>
                    )}

                    <Nav defaultActiveKey="/" className="flex-column">
                        <Link href="/client/my_profile" onClick={toggleDrawer(false)}>Личный кабинет</Link>
                        <Link href="/client/my_orders" onClick={toggleDrawer(false)}>Мои Заказы</Link>
                        <Link href="/client/my_cart" onClick={toggleDrawer(false)}>Корзина</Link>
                        <Link href="/client/my_whishlist" onClick={toggleDrawer(false)}>Избранные</Link>
                        <Button>Выйти</Button>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default ExistsUser;
