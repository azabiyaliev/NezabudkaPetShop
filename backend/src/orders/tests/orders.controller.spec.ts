import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthRequest } from '../../types';
import { CreateOrderDto } from '../../dto/createOrderDto';
import { BadRequestException } from '@nestjs/common';
import { UpdateStatusDto } from '../../dto/update-status.dto';
import { AuthService } from '../../auth/auth.service';
import { TokenAuthGuard } from '../../token.auth/token-auth.guard';
import { RolesGuard } from '../../token.auth/token.role.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { RecaptchaGuard } from '../../recaptcha/recaptcha.guard';
import { RecaptchaService } from '../../recaptcha/recaptcha.service';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: OrdersService;

  const mockOrdersService = {
    getOrderStats: jest.fn(),
    transferGuestOrdersToUser: jest.fn(),
    createOrder: jest.fn(),
    updateStatus: jest.fn(),
    deleteOrder: jest.fn(),
    getAllOrders: jest.fn(),
    getUserOrders: jest.fn(),
  };

  const mockAuthService = {
    findByToken: jest
      .fn()
      .mockResolvedValue({ id: 1, role: 'admin', token: 'test-token' }),
  };

  const mockPrismaService = {
    user: {
      findFirst: jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        phone: '+996555123456',
        firstName: 'Test',
        role: 'admin',
        token: 'test-token',
      }),
    },
  };

  const mockRecaptchaService = {
    verifyToken: jest.fn().mockResolvedValue(true),
  };

  const mockRecaptchaGuard = {
    canActivate: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RecaptchaService,
          useValue: mockRecaptchaService,
        },
        {
          provide: RecaptchaGuard,
          useValue: mockRecaptchaGuard,
        },
        TokenAuthGuard,
        RolesGuard,
      ],
    }).compile();

    ordersController = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  describe('getStatistics', () => {
    it('should return order statistics', async () => {
      const stats = { totalOrders: 100, revenue: 2000 };
      mockOrdersService.getOrderStats.mockResolvedValue(stats);

      const result = await ordersController.getStatistics();

      expect(result).toEqual(stats);
      expect(mockOrdersService.getOrderStats).toHaveBeenCalled();
    });
  });

  describe('transferOrders', () => {
    it('should transfer guest orders to a user', async () => {
      const req = { user: { id: 1 } } as AuthRequest;
      const body = { guestEmail: 'guest@example.com' };
      mockOrdersService.transferGuestOrdersToUser.mockResolvedValue('success');

      const result = await ordersController.transferOrders(req, body);

      expect(result).toEqual('success');
      expect(mockOrdersService.transferGuestOrdersToUser).toHaveBeenCalledWith(
        body.guestEmail,
        req.user.id,
      );
    });
  });

  describe('registerOrder', () => {
    it('should register a user order', async () => {
      const req = { user: { id: 1 } } as AuthRequest;
      const orderDto: CreateOrderDto = {
        items: [],
        address: 'Гоголя 123',
        paymentMethod: 'ByCard',
        deliveryMethod: 'Delivery',
        recaptchaToken: 'token',
        totalPrice: 100,
      };
      const createdOrder = { id: 1, ...orderDto };

      mockOrdersService.createOrder.mockResolvedValue(createdOrder);

      const result = await ordersController.registerOrder(orderDto, req);

      expect(result).toEqual(createdOrder);
      expect(mockOrdersService.createOrder).toHaveBeenCalledWith(
        orderDto,
        req.user.id,
      );
    });
  });

  describe('createGuestOrder', () => {
    it('should create a guest order', async () => {
      const orderDto: CreateOrderDto = {
        items: [],
        address: '123 Guest St',
        deliveryMethod: 'Delivery',
        paymentMethod: 'ByCard',
        recaptchaToken: 'token',
        totalPrice: 100,
      };
      const createdOrder = { id: 2, ...orderDto };

      mockOrdersService.createOrder.mockResolvedValue(createdOrder);

      const result = await ordersController.createGuestOrder(orderDto);

      expect(result).toEqual(createdOrder);
      expect(mockOrdersService.createOrder).toHaveBeenCalledWith(orderDto);
    });

    it('should throw a BadRequestException when creation fails', async () => {
      const orderDto: CreateOrderDto = {
        items: [],
        address: '123 Error St',
        deliveryMethod: 'Delivery',
        paymentMethod: 'ByCard',
        recaptchaToken: 'token',
        totalPrice: 100,
      };

      mockOrdersService.createOrder.mockImplementation(() => {
        throw new Error('Error creating order');
      });

      await expect(ordersController.createGuestOrder(orderDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateOrderStatus', () => {
    it('should update the order status', async () => {
      const orderId = '1';
      const orderDto: UpdateStatusDto = { status: 'Shipped' };
      const updatedOrder = { id: 1, status: 'shipped' };

      mockOrdersService.updateStatus.mockResolvedValue(updatedOrder);

      const result = await ordersController.updateOrderStatus(
        orderId,
        orderDto,
      );

      expect(result).toEqual(updatedOrder);
      expect(mockOrdersService.updateStatus).toHaveBeenCalledWith(
        orderDto,
        Number(orderId),
      );
    });
  });
});
