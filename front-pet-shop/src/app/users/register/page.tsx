'use client'
import React from 'react';
import { Container } from 'react-bootstrap';
import { ToastContainer as RBToastContainer } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { registerUser} from "@/app/api/users";
import {User} from "@/types";
import {DynamicForm, FieldConfig} from "@/components/DynamicForm/DynamicForm";
import {AxiosError} from "axios";
import Cookies from "js-cookie";
import {SubmitHandler} from "react-hook-form";
import {useRouter} from "next/navigation";

interface FormData extends Record<string, unknown> {
    firstName: string;
    secondName: string;
    email: string;
    password: string;
    phone: string;
}


export default function Register(){
    const router = useRouter();

    const formConfig: FieldConfig<FormData>[] = [
        {
            name: 'firstName',
            label: 'Имя',
            type: 'input',
            validation: { required: 'Имя обязателеное' },
        },
        {
            name: 'secondName',
            label: 'Фамилия',
            type: 'input',
            validation: { required: 'Фамилия обязателеная' },
        },
        {
            name: 'email',
            label: 'Email',
            type: 'input',
            validation: { required: 'Email обязателен' },
        },
        {
            name: 'password',
            label: 'Пароль',
            type: 'input',
            validation: { required: 'Пароль обязателен' },
        },
        {
            name: 'phone',
            label: 'Номер телефона',
            type: 'input',
            validation: { required: 'Номер телефона обязателен' },
        },
    ];

    const mutation = useMutation<User, AxiosError, FormData>({
        mutationFn: registerUser,
        onSuccess: (user) => {
            if (user) {
                Cookies.set('user', JSON.stringify(user), { expires: 31, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
                router.push("/");
                toast.success('Регистрация успешна!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        },
        onError: (error: AxiosError) => {
            console.error('Login error:', error);
            toast.error(error.message || 'Ошибка при регистрации!');
        }
    });


    const onSubmit: SubmitHandler<FormData> = (data) => {
        mutation.mutate(data);
    };

    return (
        <div>
            <Container>
                <DynamicForm<FormData>
                    typographyFormTitle={'Регистрация'}
                    buttonSubmitText={'Зарегистрироваться'}
                    config={formConfig}
                    onSubmit={onSubmit}
                    errorText={mutation.isError ? mutation.error.message : undefined}
                />
            </Container>

            <RBToastContainer />
        </div>
    );
};
