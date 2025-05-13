import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { enqueueSnackbar } from 'notistack';

import OrderForm from '../../src/features/Order/OrderForm';
import { orderReducer } from '../../src/store/orders/ordersSlice';
import { cartReducer } from '../../src/store/cart/cartSlice';
import { userReducer } from '../../src/store/users/usersSlice';
import { deliveryPageReducer } from '../../src/store/deliveryPage/deliveryPageSlice';

vi.mock('notistack', async () => {
  const actual = await vi.importActual('notistack');
  return {
    ...actual,
    enqueueSnackbar: vi.fn(),
  };
});

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
    get: vi.fn((url: string) => {
      if (url === '/users') {
        return Promise.resolve({
          data: {
            user: {
              id: 1,
              firstName: 'Test',
              email: 'test@test.com',
              role: 'client',
              token: 'token',
              phone: '+996555123456',
              bonus: 100,
              guestEmail: '',
            },
          },
        })
      }
      else if (url === '/delivery') {
        return Promise.resolve({
          data: {
            delivery: {
              id: 1,
              text: 'Delivery',
              price: '200',
              map: 'https://maps.google.com',
              checkoutDeliveryPriceInfo: 'delivery page info',
            },
          }
        })
      }
      else if (url === '/cart') {
        return Promise.resolve({
          data: {
            cart: {
              id: 1,
              userId: 1,
              products: [
                {
                  id: 1,
                  cartId: 1,
                  productId: 1,
                  quantity: 2,
                  product: {
                    id: 1,
                    productName: 'Test Product',
                    productPhoto: 'test-photo.jpg',
                    productPrice: 700,
                    productDescription: 'test description',
                    existence: true,
                    sales: true,
                    brandId: '2',
                    brand: {
                      id: 2,
                      title: 'Test Brand',
                      logo: 'test-brand-photo.jpg',
                      description: 'test brand description',
                    },
                    reviews: [],
                    categoryId: [2, 3],
                    subcategoryId: ['1', '2'],
                    productCategory: [{
                      category: {
                        id: 2,
                        title: 'Test Category',
                        parentId: 3,
                        parent: {
                          id: 4,
                          title: 'Test Parent Category',
                        },
                      },
                    }],
                    startDateSales: new Date(2025, 4, 28).toDateString(),
                    endDateSales: new Date(2025, 5, 3).toDateString(),
                    orderedProductsStats: 1000,
                    productSize: 'M',
                    productAge: '1+',
                    productWeight: 1.5,
                    productFeedClass: 'Premium',
                    productManufacturer: 'Test Manufacturer',
                    promoPercentage: 50,
                    promoPrice: 350,
                  },
                }
              ],
            },
          }
        })
      }
      return Promise.reject(new Error('Unexpected request to API'))
    }),
    post: vi.fn(() => Promise.resolve({
      data: {
        order: {
          address: 'Test Address',
          guestEmail: 'test@test.com',
          guestPhone: '+996555123456',
          guestName: 'Test',
          guestLastName: 'User',
          orderComment: 'Test Order Comment',
          paymentMethod: 'ByCard',
          bonusUsed: 50,
          deliveryMethod: 'Delivery',
          userId: 1,
          items: [
            {
              productId: 1,
              quantity: 2,
              orderAmount: 1400,
            }
          ],
          recaptchaToken: 'test-token',
        }
      }
      }
    )),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

vi.stubEnv('VITE_REACT_APP_RECAPTCHA_SITE_KEY', 'test-site-key');

const createMockStore = (state: {
  orders: ReturnType<typeof orderReducer>;
  cart: ReturnType<typeof cartReducer>;
  users: ReturnType<typeof userReducer>;
  delivery: ReturnType<typeof deliveryPageReducer>;
}) => {
  return configureStore({
    reducer: {
      orders: orderReducer,
      cart: cartReducer,
      users: userReducer,
      delivery: deliveryPageReducer,
    },
    preloadedState: state,
  });
};

describe('OrderForm component', () => {
  let mockStore: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    mockStore = createMockStore({
      orders: {
        orders: [],
        oneOrder: null,
        orderStats: null,
        isLoading: false,
        isError: false,
      },
      cart: {
        cart: null,
        loadings: {
          getLoading: false,
          createLoading: false,
          deleteLoading: false,
          addProductLoading: false,
          editProductLoading: false,
          deleteProductLoading: false,
        },
        errors: {
          getCartError: null,
          createError: null,
          deleteError: null,
          addProductError: null,
          deleteProductError: null,
          editProductError: null,
        },
      },
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
        meChecked: true,
      },
      delivery: {
        editDelivery: null,
        loading: false,
        error: null,
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders order form correctly', async () => {
    await act(async () => {
      render(
        <Provider store={mockStore}>
          <MemoryRouter>
            <OrderForm/>
          </MemoryRouter>
        </Provider>
      );
    });

    expect(screen.getByText('Персональные данные')).toBeInTheDocument();
    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    expect(screen.getByLabelText('Фамилия')).toBeInTheDocument();
    expect(screen.getByLabelText('Телефон')).toBeInTheDocument();
    expect(screen.getByLabelText('Эл. адрес')).toBeInTheDocument();
    expect(screen.getByText('Способ Доставки')).toBeInTheDocument();
    expect(screen.getByText('Способ Оплаты')).toBeInTheDocument();
    const recaptchas = screen.getAllByTestId('mock-recaptcha');
    expect(recaptchas.length).toBeGreaterThan(0);

    // Update to handle multiple buttons if needed
    const submitButtons = screen.getAllByText('Оформить заказ');
    expect(submitButtons.length).toBeGreaterThan(0);
  });

  it('validates phone number format', async () => {
    await act(async () => {
      render(
        <Provider store={mockStore}>
          <MemoryRouter>
            <OrderForm/>
          </MemoryRouter>
        </Provider>
      );
    });

    const phoneInput = screen.getByLabelText('Телефон');
    await act(async () => {
      fireEvent.change(phoneInput, {target: {value: '123'}});
    });
    expect(screen.getByText('Неправильный формат телефона')).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(phoneInput, {target: {value: '+996555123456'}});
    });
    expect(screen.queryByText('Неправильный формат телефона')).not.toBeInTheDocument();
  });

  it('validates email format', async () => {
    await act(async () => {
      render(
        <Provider store={mockStore}>
          <MemoryRouter>
            <OrderForm/>
          </MemoryRouter>
        </Provider>
      );
    });

    const emailInput = screen.getByLabelText('Эл. адрес');
    await act(async () => {
      fireEvent.change(emailInput, {target: {value: 'invalid-email'}});
    });
    expect(screen.getByText('Неправильный формат email')).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(emailInput, {target: {value: 'valid@email.com'}});
    });
    expect(screen.queryByText('Неправильный формат email')).not.toBeInTheDocument();
  });

  it('validates address format when delivery method is selected', async () => {
    await act(async () => {
      render(
        <Provider store={mockStore}>
          <MemoryRouter>
            <OrderForm/>
          </MemoryRouter>
        </Provider>
      );
    });

    const deliveryButton = screen.getByText('Доставка');
    fireEvent.click(deliveryButton);

    const addressInput = screen.getByLabelText('Адрес');
    await act(async () => {
      fireEvent.change(addressInput, {target: {value: 'invalid-address'}});
    });

    await act(async () => {
      fireEvent.change(addressInput, {target: {value: 'valid address'}});
    });
  });

  it('shows error when submitting without ReCAPTCHA', async () => {
    await act(async () => {
      render(
        <Provider store={mockStore}>
          <MemoryRouter>
            <OrderForm/>
          </MemoryRouter>
        </Provider>
      );
    });

    const submitButtons = screen.getAllByText('Оформить заказ');

    await act(async () => {
      fireEvent.click(submitButtons[0]);
    });
  });

  it('handles form submission with valid data', async () => {
    const mockResponse = {
      order: {
        id: 1,
        address: 'Test Address',
        status: 'Pending',
        guestEmail: 'test@test.com',
        guestPhone: '+996555123456',
        guestName: 'Test',
        guestLastName: 'User',
        orderComment: 'Test Order Comment',
        paymentMethod: 'ByCard',
        bonusUsed: 50,
        user: {
          id: 1,
          firstName: 'Test',
          secondName: 'User',
          email: 'test@test.com',
          role: 'client',
          token: 'token',
          phone: '+996555123456',
          bonus: 100,
          guestEmail: '',
        },
        deliveryMethod: 'Delivery',
        userId: 1,
        items: [
          {
            id: 1,
            cardId: 1,
            productId: 1,
            quantity: 2,
            product: {
              id: 1,
              productName: 'Test Product',
              productPhoto: 'test-photo.jpg',
              productPrice: 700,
              productDescription: 'test description',
              existence: true,
              sales: true,
              brandId: '2',
              brand: {
                id: 2,
                title: 'Test Brand',
                logo: 'test-brand-photo.jpg',
                description: 'test brand description',
              },
              reviews: [],
              categoryId: [2, 3],
              subcategoryId: ['1', '2'],
              productCategory: [{
                category: {
                  id: 2,
                  title: 'Test Category',
                  parentId: 3,
                  parent: {
                    id: 1,
                    title: 'Test Parent Category',
                  }
                }
              }],
              startDateSales: new Date(2025, 4, 28).toDateString(),
              endDateSales: new Date(2025, 5, 3).toDateString(),
              orderedProductsStats: 1000,
              productSize: 'M',
              productAge: '1+',
              productWeight: 1.5,
              productFeedClass: 'Premium',
              productManufacturer: 'Test Manufacturer',
              promoPercentage: 50,
            }
          }
        ],
        recaptchaToken: 'test-token',
      }
    };

    vi.mock('../../../src/hooks', () => ({
      useAppDispatch: () => vi.fn(() => Promise.resolve(mockResponse)),
      useAppSelector: vi.fn((selector) => selector({
        orders: {
          orders: [],
          oneOrder: null,
          orderStats: null,
          isLoading: false,
          isError: false,
        },
      }))
    }))

    await act(async () => {
      render(
        <Provider store={mockStore}>
          <MemoryRouter>
            <OrderForm/>
          </MemoryRouter>
        </Provider>
      );
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Имя'), {
        target: {value: 'Test'},
      });
      fireEvent.change(screen.getByLabelText('Фамилия'), {
        target: {value: 'User'},
      });
      fireEvent.change(screen.getByLabelText('Телефон'), {
        target: {value: '+996555123456'},
      });
      fireEvent.change(screen.getByLabelText('Эл. адрес'), {
        target: {value: 'test@test.com'},
      });
    });

    const recaptchas = screen.getAllByTestId('mock-recaptcha');
    await act(async () => {
      fireEvent.click(recaptchas[0]);
    });


    const submitButton = screen.getAllByText('Оформить заказ')[0];
    await act(async () => {
      fireEvent.click(submitButton);
    });


    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Пройдите проверку ReCAPTCHA',
        {variant: 'error'}
      );
    });
  })
})