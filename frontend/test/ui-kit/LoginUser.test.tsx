import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { userReducer } from '../../src/store/users/usersSlice';
import LoginUser from '../../src/components/Forms/UserFrom/LoginUser';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { LogInMutation } from '../../src/types';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
  ToastContainer: () => <div>ToastContainer</div>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../src/axiosApi', () => ({
  __esModule: true,
  default: {
    post: vi.fn((url: string, data: LogInMutation) => {
      if (data.email === 'test@test.com' && data.password === 'password123') {
        return Promise.resolve({
          data: {
            user: {
              id: 1,
              firstName: 'Test',
              email: 'test@test.com',
              role: 'user',
              token: 'token',
              phone: '+996555123456',
              bonus: 100,
            },
            message: 'Success',
          },
        });
      }
      return Promise.reject({
        response: {
          data: { message: 'Неверный email или пароль.' },
        },
      });
    }),
  },
}));

const createMockStore = (state: { users: ReturnType<typeof userReducer> }) => {
  return configureStore({
    reducer: {
      users: userReducer,
    },
    preloadedState: state,
  });
};

vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => children,
  GoogleLogin: () => <button data-testid="google-login-button">Google</button>,
}));

const googleClientId = 'test-google-client-id';

const renderWithProviders = (ui: React.ReactElement, store: ReturnType<typeof createMockStore>) => {
  return render(
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    </GoogleOAuthProvider>
  );
};

describe('LoginUser component', () => {
  let mockStore: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    mockStore = createMockStore({
      users: {
        user: null,
        users: [],
        usersWithOrderCount: [],
        registerLoading: false,
        registerError: null,
        loginLoading: false,
        loginError: null,
        editLoading: false,
        editError: null,
        passwordCodeLoading: false,
        passwordCodeError: null,
        passwordCodeMessage: null,
        message: null,
        error: null,
        meChecked: false,
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });


  it('renders the login form correctly', () => {
    renderWithProviders(<LoginUser />, mockStore);

    expect(screen.getByText('Вход в аккаунт')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Введите пароль')).toBeInTheDocument();
    expect(screen.getByText('Войти')).toBeInTheDocument();
    expect(screen.getByText('Забыли пароль?')).toBeInTheDocument();
  });

  it('validates email format', () => {
    renderWithProviders(<LoginUser />, mockStore);

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    expect(screen.getByText('Неправильный формат email')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });

    expect(screen.queryByText('Неправильный формат email')).not.toBeInTheDocument();
  });

  it('handles login with valid credentials', async () => {
    renderWithProviders(<LoginUser />, mockStore);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com' },
    });

    fireEvent.change(screen.getByLabelText('Введите пароль'), {
      target: { value: 'password123' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Войти'));
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('handles login errors', async () => {
    renderWithProviders(<LoginUser />, mockStore);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'wrong@test.com' },
    });

    fireEvent.change(screen.getByLabelText('Введите пароль'), {
      target: { value: 'wrongpassword' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Войти'));
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith('Произошла ошибка. Повторите попытку.', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  });

  it('opens password recovery modal', () => {
    renderWithProviders(<LoginUser />, mockStore);

    const passwordRecoveryButton = screen.getByRole('button', { name: /Восстановить пароль/i });
    fireEvent.click(passwordRecoveryButton);

    expect(screen.getByRole('heading', { name: /Восстановить пароль/i })).toBeInTheDocument();
  });

  it('handles Google login', async () => {
    renderWithProviders(<LoginUser />, mockStore);

    const button = screen.getByTestId('google-login-button');
    await act(async () => {
      fireEvent.click(button);
    });
  });

  it('handles Facebook login failure', () => {
    renderWithProviders(<LoginUser />, mockStore);

    const facebookButton = screen.getByText('Facebook');
    fireEvent.click(facebookButton);

    expect(screen.queryByText('Facebook Login failed!')).not.toBeInTheDocument();
  });
});