import {LogInMutation, RegisterMutation, RegisterResponse, User} from "@/types";
import axios from "axios";
import {apiUrl} from "@/globalConstants";


export async function registerUser(registerData: RegisterMutation): Promise<RegisterResponse> {
    try {
        const response = await axios.post<RegisterResponse>(apiUrl + '/auth/register', {
            ...registerData,
        });

        return response.data;
    } catch (error) {
        console.error('Регистрация не удалась', error);
        throw new Error('Регистрация не удалась');
    }
}

export async function loginUser(loginData: LogInMutation): Promise<User> {
    try {
        const response = await axios.post<{message: string; user: User}>(apiUrl + '/auth/login', loginData);
        const userData = response.data.user;

        const user: User = {
            id: userData.id,
            token: userData.token,
            email: userData.email,
            firstName: userData.firstName,
            secondName: userData.secondName,
            role: userData.role,
            phone: userData.phone,
        };

        return user;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.data) {
                throw new Error(error.response?.data?.message || 'Неизвестная ошибка');
            }
        }
        throw new Error('Неизвестная ошибка');
    }
}

