'use client'
import { DynamicForm, FieldConfig } from "@/components/DynamicForm/DynamicForm";
import { SubmitHandler } from "react-hook-form";
import { Container } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/app/api/users";
import { toast } from "react-toastify";
import { User } from "@/types";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface FormData extends Record<string, unknown> {
    email: string;
    password: string;
}

export default function Login() {
    const router = useRouter();
    const mutation = useMutation<User, AxiosError, FormData>({
        mutationFn: loginUser,
        onSuccess: (user) => {
            if (user) {
                Cookies.set('user', JSON.stringify(user), { expires: 31, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
                router.push("/");
                toast.success('Вы успешно вошли в систему!', {
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
            toast.error(error.message || 'Ошибка при входе!');
        }
    });

    const onSubmit: SubmitHandler<FormData> = (data) => {
        mutation.mutate(data);
    };

    const formConfig: FieldConfig<FormData>[] = [
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
    ];

    return (
        <main>
            <Container>
                <DynamicForm<FormData>
                    typographyFormTitle={'Логин'}
                    buttonSubmitText={'Войти'}
                    config={formConfig}
                    onSubmit={onSubmit}
                    errorText={mutation.isError ? mutation.error.message : undefined}
                />
            </Container>
        </main>
    );
}
