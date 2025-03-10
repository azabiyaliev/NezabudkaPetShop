'use client'
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Link from "next/link";
import { ToastContainer as RBToastContainer } from 'react-bootstrap';
import { Lock } from 'react-bootstrap-icons';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {registerUser} from "@/app/api/users";
import {GlobalError} from "@/types";

const regPhone = /^(\+996|0)\s?\d{3}\s?\d{3}\s?\d{3}$/;
const regEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/;

export default function Register(){
    const [form, setForm] = useState({
        firstName: '',
        secondName: '',
        email: '',
        password: '',
        phone: '',
    });

    const [phoneError, setPhoneError] = useState<{ phone?: string }>({});
    const [emailError, setEmailError] = useState<{ email?: string }>({});

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toast.success('Регистрация успешна!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        },
        onError: (error: GlobalError) => {
            toast.error(error?.error|| 'Ошибка регистрации!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    });

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prevState) => ({ ...prevState, [name]: value }));

        if (name === "phone") {
            if (regPhone.test(value)) {
                setPhoneError((prevState) => ({ ...prevState, phone: "" }));
            } else {
                setPhoneError((prevState) => ({
                    ...prevState,
                    phone: "Неправильный формат номера телефона",
                }));
            }
        }

        if (name === "email") {
            if (regEmail.test(value)) {
                setEmailError((prevState) => ({ ...prevState, email: "" }));
            } else {
                setEmailError((prevState) => ({
                    ...prevState,
                    email: "Неправильный формат email",
                }));
            }
        }
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        const { firstName, secondName, email, password, phone } = form;

        if (!firstName.trim() || !secondName.trim() || !email.trim() || !password.trim() || !phone.trim()) {
            toast.error("Пожалуйста, заполните все поля.");
            return;
        }

        mutation.mutate(form);
    };

    return (
        <div>
            <Container className="d-flex justify-content-center mt-5">
                <Row className="justify-content-center">
                    <Col xs={12} sm={8} md={6}>
                        <div
                            className="p-4"
                            style={{
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                border: '2px solid #FFEB3B',
                            }}
                        >
                            <div className="d-flex justify-content-center mb-3">
                                <Lock size={40} color="black" />
                            </div>
                            <h2 className="text-center" style={{ color: 'black' }}>
                                Регистрация
                            </h2>

                            <Form onSubmit={submitHandler}>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ваше имя"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={inputChangeHandler}
                                        isInvalid={Boolean(phoneError.phone)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ваша фамилия"
                                        name="secondName"
                                        value={form.secondName}
                                        onChange={inputChangeHandler}
                                        isInvalid={Boolean(phoneError.phone)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        name="email"
                                        value={form.email}
                                        onChange={inputChangeHandler}
                                        isInvalid={Boolean(emailError.email)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {emailError.email}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="password"
                                        placeholder="Придумайте пароль"
                                        name="password"
                                        value={form.password}
                                        onChange={inputChangeHandler}
                                        isInvalid={Boolean(phoneError.phone)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Номер телефона"
                                        name="phone"
                                        value={form.phone}
                                        onChange={inputChangeHandler}
                                        isInvalid={Boolean(phoneError.phone)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {phoneError.phone}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button
                                    type="submit"
                                    variant="warning"
                                    className="w-100"
                                    style={{ color: 'black', fontWeight: 'bold' }}
                                >
                                    Зарегистрироваться
                                </Button>

                                <Row className="mt-3 text-center">
                                    <Col>
                                        <Link href="/users/login" style={{ color: 'black' }}>
                                            У вас уже есть аккаунт? Войти
                                        </Link>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>

            <RBToastContainer />
        </div>
    );
};
