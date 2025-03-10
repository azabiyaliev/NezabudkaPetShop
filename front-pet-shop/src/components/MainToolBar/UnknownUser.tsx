'use client'
import React, { useState } from 'react';
import { Button, Dropdown } from "react-bootstrap";
import Link from "next/link";
import { PersonCircle } from 'react-bootstrap-icons';

const UnknownUser = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleToggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Button onClick={handleToggleDropdown} variant="link" style={{ color: 'black', display: 'flex', flexDirection: 'column' }}>
                    <PersonCircle style={{ fontSize: '24px', color: 'black' }} />
                    <span style={{ fontSize: '15px', textTransform: 'lowercase' }}>
            Войти
          </span>
                </Button>

                <Dropdown show={showDropdown} onToggle={handleToggleDropdown} align="end">
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} href="/users/login" className="text-decoration-none text-black">
                            Войти
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} href="/users/register" className="text-decoration-none text-black">
                            Зарегистрироваться
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </>
    );
};

export default UnknownUser;
