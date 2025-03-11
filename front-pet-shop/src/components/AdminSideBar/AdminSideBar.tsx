'use client'

import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import Link from "next/link";
import { Button } from "@mui/material";
import Cookies from "js-cookie";
import { User } from "@/types";

export default function AdminSideBar() {
    const [user, setUser] = useState<User | null>(null);
    const [activeLink, setActiveLink] = useState<string>("");

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            const userData = JSON.parse(userCookie);
            setUser(userData);
        }
    }, []);

    const handleLinkClick = (link: string) => {
        setActiveLink(link);
    };

    return (
        <div>
            {user && user.role === 'admin' && (
                <Nav
                    className="flex-column"
                    style={{
                        padding: '15px',
                        borderRight: '2px solid #FFEB3B',
                        width:"23%",
                        marginTop:'30px'
                    }}
                >
                    <Link href="/admin/cabinet" passHref>
                        <Button
                            variant="text"
                            sx={{
                                textAlign: 'left',
                                padding: '10px',
                                color: "rgb(33, 33, 33)",
                                borderBottom: activeLink === "/admin/cabinet" ? "2px solid #FFEB3B" : "none",
                            }}
                            onClick={() => handleLinkClick("/admin/cabinet")}
                        >
                            Личный кабинет админа
                        </Button>
                    </Link>
                    <Link href="/admin/client_orders" passHref>
                        <Button
                            variant="text"
                            sx={{
                                textAlign: 'left',
                                padding: '10px',
                                color: "rgb(33, 33, 33)",
                                borderBottom: activeLink === "/admin/client_orders" ? "2px solid #FFEB3B" : "none",
                            }}
                            onClick={() => handleLinkClick("/admin/client_orders")}
                        >
                            Заказы
                        </Button>
                    </Link>
                    <Link href="/admin/clients" passHref>
                        <Button
                            variant="text"
                            sx={{
                                textAlign: 'left',
                                padding: '10px',
                                color: "rgb(33, 33, 33)",
                                borderBottom: activeLink === "/admin/clients" ? "2px solid #FFEB3B" : "none",
                            }}
                            onClick={() => handleLinkClick("/admin/clients")}
                        >
                            Наши клиенты
                        </Button>
                    </Link>

                    <Link href="/admin/add_brand" passHref>
                        <Button
                            variant="text"
                            sx={{
                                textAlign: 'left',
                                padding: '10px',
                                color: "rgb(33, 33, 33)",
                                borderBottom: activeLink === "/admin/add_brand" ? "2px solid #FFEB3B" : "none",
                            }}
                            onClick={() => handleLinkClick("/admin/add_brand")}
                        >
                            Добавить бренд
                        </Button>
                    </Link>
                    <Link href="/admin/all_products" passHref>
                        <Button
                            variant="text"
                            sx={{
                                textAlign: 'left',
                                padding: '10px',
                                color: "rgb(33, 33, 33)",
                                borderBottom: activeLink === "/admin/all_products" ? "2px solid #FFEB3B" : "none",
                            }}
                            onClick={() => handleLinkClick("/admin/all_products")}
                        >
                            Все товары
                        </Button>
                    </Link>
                    <Link href="/admin/all_categories" passHref>
                        <Button
                            variant="text"
                            sx={{
                                textAlign: 'left',
                                padding: '10px',
                                color: "rgb(33, 33, 33)",
                                borderBottom: activeLink === "/admin/all_categories" ? "2px solid #FFEB3B" : "none",
                            }}
                            onClick={() => handleLinkClick("/admin/all_categories")}
                        >
                            Все категории
                        </Button>
                    </Link>
                    <Link href="/admin/edit_site" passHref>
                        <Button
                            variant="text"
                            sx={{
                                textAlign: 'left',
                                padding: '10px',
                                color: "rgb(33, 33, 33)",
                                borderBottom: activeLink === "/admin/edit_site" ? "2px solid #FFEB3B" : "none",
                            }}
                            onClick={() => handleLinkClick("/admin/edit_site")}
                        >
                            Редактирование сайта
                        </Button>
                    </Link>
                </Nav>
            )}

            {user && user.role === 'client' && (
                <Nav
                    defaultActiveKey="/"
                    className="flex-column"
                    style={{
                        padding: '15px',
                        borderRight: '2px solid #FFEB3B',
                    }}
                >
                    <Link href="/client/my_profile" passHref>
                        <Button
                            variant="text"
                            sx={{
                                textAlign: 'left',
                                padding: '10px',
                                color: "rgb(33, 33, 33)",
                                borderBottom: activeLink === "/client/my_profile" ? "2px solid #FFEB3B" : "none",
                            }}
                            onClick={() => handleLinkClick("/client/my_profile")}
                        >
                            Личный кабинет
                        </Button>
                    </Link>

                    <Link href="/client/my_orders" passHref>
                        <Button
                            variant="text"
                            sx={{
                                textAlign: 'left',
                                padding: '10px',
                                color: "rgb(33, 33, 33)",
                                borderBottom: activeLink === "/client/my_orders" ? "2px solid #FFEB3B" : "none",
                            }}
                            onClick={() => handleLinkClick("/client/my_orders")}
                        >
                            Мои Заказы
                        </Button>
                    </Link>

                    <Link href="/client/my_cart" passHref>
                        <Button
                            variant="text"
                            sx={{
                                textAlign: 'left',
                                padding: '10px',
                                color: "rgb(33, 33, 33)",
                                borderBottom: activeLink === "/client/my_cart" ? "2px solid #FFEB3B" : "none",
                            }}
                            onClick={() => handleLinkClick("/client/my_cart")}
                        >
                            Корзина
                        </Button>
                    </Link>

                    <Link href="/client/my_favorites" passHref>
                        <Button
                            variant="text"
                            sx={{
                                textAlign: 'left',
                                padding: '10px',
                                color: "rgb(33, 33, 33)",
                                borderBottom: activeLink === "/client/my_favorites" ? "2px solid #FFEB3B" : "none",
                            }}
                            onClick={() => handleLinkClick("/client/my_favorites")}
                        >
                            Избранные
                        </Button>
                    </Link>
                </Nav>
            )}
        </div>
    );
}
