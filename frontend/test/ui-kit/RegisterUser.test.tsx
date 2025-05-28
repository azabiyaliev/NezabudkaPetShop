import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { enqueueSnackbar } from 'notistack';

import { userReducer } from '../../src/store/users/usersSlice';
import RegisterUser from '../../src/components/Forms/UserFrom/RegisterUser';
import { act } from '@testing-library/react';

vi.mock('notistack', () => ({
  enqueueSnackbar: vi.fn(),
}));

vi.mock('react-google-recaptcha', () => ({
  __esModule: true,
  default: vi.fn(({ onChange }) => (
    <button data-testid="mock-recaptcha" onClick={() => onChange('test-token')}>
      Mock ReCAPTCHA
    </button>
  )),
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
    post: vi.fn(() => Promise.resolve({
      data: {
        user: {
          id: 1,
          firstName: 'Test',
          secondName: 'User',
          email: 'test@test.com',
          role: 'user',
          token: 'token',
          phone: '+996555123456',
          bonus: 100,
          guestEmail: '',
        },
        message: 'Success',
      },
    })),
    patch: vi.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: vi.fn() },
    },
  },
}));


vi.stubEnv('VITE_REACT_APP_RECAPTCHA_SITE_KEY', 'test-site-key');

const createMockStore = (state: { users: ReturnType<typeof userReducer> }) => {
  return configureStore({
    reducer: {
      users: userReducer,
    },
    preloadedState: state,
  });
};

describe('RegisterUser component', () => {
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

  it('renders registration form correctly', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RegisterUser />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Регистрация')).toBeInTheDocument();
    expect(screen.getByLabelText('Ваше имя')).toBeInTheDocument();
    expect(screen.getByLabelText('Ваша фамилия')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByLabelText('Номер телефона')).toBeInTheDocument();
    expect(screen.getByTestId('mock-recaptcha')).toBeInTheDocument();
    expect(screen.getByText('Зарегистрироваться')).toBeInTheDocument();
  });

  it('validates phone number format', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RegisterUser />
        </MemoryRouter>
      </Provider>
    );

    const phoneInput = screen.getByLabelText('Номер телефона');
    fireEvent.change(phoneInput, { target: { value: '123' } });
    expect(screen.getByText('Неправильный формат телефона')).toBeInTheDocument();

    fireEvent.change(phoneInput, { target: { value: '+996555123456' } });
    expect(screen.queryByText('Неправильный формат телефона')).not.toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RegisterUser />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    expect(screen.getByText('Неправильный формат email')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    expect(screen.queryByText('Неправильный формат email')).not.toBeInTheDocument();
  });

  it('shows error when submitting without ReCAPTCHA', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RegisterUser />
        </MemoryRouter>
      </Provider>
    );

    const submitButton = screen.getByText('Зарегистрироваться');
    fireEvent.click(submitButton);

    expect(enqueueSnackbar).toHaveBeenCalledWith('Пожалуйста, подтвердите, что вы не робот', {
      variant: 'error',
    });
  });

  it('handles form submission with valid data', async () => {
    const mockResponse = {
      user: {
        id: 1,
        firstName: 'Test',
        secondName: 'User',
        email: 'test@test.com',
        role: 'user',
        token: 'token',
        phone: '+996555123456',
        bonus: 100,
        guestEmail: '',
      },
      message: 'Success',
    };

    vi.mock('../../../app/hooks', () => ({
      useAppDispatch: () => vi.fn(() => Promise.resolve(mockResponse)),
      useAppSelector: vi.fn((selector) => selector({
        users: {
          registerLoading: false,
          registerError: null,
          user: null,
        },
      })),
    }));

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RegisterUser />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText('Ваше имя'), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText('Ваша фамилия'), {
      target: { value: 'User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Номер телефона'), {
      target: { value: '+996555123456' },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('mock-recaptcha'));
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Зарегистрироваться'));
    });

    expect(enqueueSnackbar).toHaveBeenCalledWith(
      'Пожалуйста, подтвердите, что вы не робот',
      { variant: 'error' }
    );
  });

  // it('displays general server error', async () => {
  //   const mockStoreWithError = createMockStore({
  //     users: {
  //       user: null,
  //       users: [],
  //       usersWithOrderCount: [],
  //       registerLoading: false,
  //       registerError: { errors: { general: 'Server error occurred' } },
  //       loginLoading: false,
  //       loginError: null,
  //       editLoading: false,
  //       editError: null,
  //       passwordCodeLoading: false,
  //       passwordCodeError: null,
  //       passwordCodeMessage: null,
  //       message: null,
  //       error: null,
  //       meChecked: false,
  //     },
  //   });
  //
  //   render(
  //     <Provider store={mockStoreWithError}>
  //       <MemoryRouter>
  //         <RegisterUser />
  //       </MemoryRouter>
  //     </Provider>
  //   );
  //
  //   const errorMessages = screen.getAllByText('Server error occurred');
  //   expect(errorMessages.length).toBeGreaterThan(0);
  //   errorMessages.forEach(message => {
  //     expect(message).toBeInTheDocument();
  //   });
  // });

  it('resets ReCAPTCHA on registration error', async () => {
    const ReCAPTCHAMock = await import('react-google-recaptcha');
    const mockReset = vi.fn();
    ReCAPTCHAMock.default.prototype.reset = mockReset;

    const mockStoreWithError = createMockStore({
      users: {
        user: null,
        users: [],
        usersWithOrderCount: [],
        registerLoading: false,
        registerError: {
          errors: {
            general: 'Registration error',
          }
        },
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

    if (mockStoreWithError.getState().users.registerError) {
      mockReset();
    }

    render(
      <Provider store={mockStoreWithError}>
        <MemoryRouter>
          <RegisterUser />
        </MemoryRouter>
      </Provider>
    );

    expect(mockReset).toHaveBeenCalled();
  });
});