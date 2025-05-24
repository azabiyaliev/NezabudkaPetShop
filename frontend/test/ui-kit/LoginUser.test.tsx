import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { userReducer } from '../../src/store/users/usersSlice';
import LoginUser from '../../src/components/Forms/UserFrom/LoginUser';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LogInMutation } from '../../src/types';
import { enqueueSnackbar } from 'notistack';

vi.mock('notistack', async () => {
  const actual = await vi.importActual('notistack');
  return {
    ...actual,
    enqueueSnackbar: vi.fn(),
  };
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockStartGoogleLogin = vi.fn();
vi.mock('@react-oauth/google', async () => {
  const actual = await vi.importActual('@react-oauth/google'); // Important to get other exports if any
  return {
    ...actual, // Spread actual to keep any other exports
    GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => children,
    // You can simplify GoogleLogin if you're not testing its direct rendering here
    GoogleLogin: vi.fn(() => <button data-testid="google-login-button">Google</button>),
    useGoogleLogin: vi.fn(() => {
      return mockStartGoogleLogin;
    }),
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

    expect(enqueueSnackbar).toHaveBeenCalledTimes(1);
    expect(enqueueSnackbar).toHaveBeenCalledWith('Произошла ошибка. Повторите попытку.', {
      variant: "error",
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

    const button = screen.getByRole('button', { name: /google/i })
    await act(async () => {
      fireEvent.click(button);
    });
    expect(mockStartGoogleLogin).toHaveBeenCalled();
  });

  it('handles Facebook login failure', () => {
    renderWithProviders(<LoginUser />, mockStore);

    const facebookButton = screen.getByText('Facebook');
    fireEvent.click(facebookButton);

    expect(screen.queryByText('Facebook Login failed!')).not.toBeInTheDocument();
  });
});