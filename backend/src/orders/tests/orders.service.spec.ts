import { OrdersService } from '../orders.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TelegramService } from '../../telegram/telegram.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from '../../dto/createOrderDto';
import { UpdateStatusDto } from '../../dto/update-status.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaService;
  let telegram: TelegramService;

  const mockPrisma = {
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    statistic: {
      upsert: jest.fn(),
    },
    products: {
      update: jest.fn(),
    },
  };

  const mockTelegram = {
    sendMessage: jest.fn().mockImplementation(() => Promise.resolve({})),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: TelegramService, useValue: mockTelegram },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);
    telegram = module.get<TelegramService>(TelegramService);

    jest.clearAllMocks();
  });

  describe('transferGuestOrdersToUser', () => {
    it('should transfer guest orders to user', async () => {
      const guestEmail = 'guest@test.com';
      const userId = 1;
      const mockOrders = [
        {
          id: 1,
          userId,
          items: [],
        },
      ];

      mockPrisma.order.updateMany.mockResolvedValue({ count: 1 });
      jest
        .spyOn(service, 'getUserOrders')
        .mockImplementation(() => Promise.resolve(mockOrders as any));

      const result = await service.transferGuestOrdersToUser(
        guestEmail,
        userId,
      );
      expect(result).toEqual(mockOrders);
      const prismaService = () =>
        prisma.order.updateMany({
          where: {
            guestEmail,
            userId: null,
          },
          data: {
            userId,
            guestEmail: null,
          },
        });
      expect(prismaService).not.toThrow();
    });
  });

  describe('getOrderStats', () => {
    it('should return order statistics', async () => {
      const mockStats = {
        id: 1,
        totalOrders: 10,
        deliveryStatistic: 5,
        pickUpStatistic: 5,
      };

      mockPrisma.statistic.upsert.mockResolvedValue(mockStats);

      const result = await service.getOrderStats();
      expect(result).toEqual(mockStats);
    });
  });

  describe('createOrder', () => {
    const mockCreateOrderDto: CreateOrderDto = {
      items: [
        {
          productId: 1,
          products: {
            productName: 'Test Product',
            productPrice: 100,
            productDescription: 'Test Description',
            categoryId: [1],
            productPhoto: 'test.jpg',
          },
          orderAmount: 100,
          quantity: 2,
        },
      ],
      paymentMethod: 'ByCard',
      deliveryMethod: 'Delivery',
      address: 'Test Address',
      guestEmail: 'guest@test.com',
      guestPhone: '+996555123456',
      guestName: 'Guest',
      recaptchaToken: 'token',
      totalPrice: 200,
    };

    it('should create order for guest', async () => {
      const mockOrder = {
        id: 1,
        ...mockCreateOrderDto,
        userId: null,
        user: null,
        items: mockCreateOrderDto.items.map((item) => ({
          ...item,
          orderAmount: item.orderAmount * item.quantity,
        })),
      };

      mockPrisma.order.create.mockResolvedValue(mockOrder);
      mockPrisma.statistic.upsert.mockResolvedValue({ id: 1, totalOrders: 1 });
      mockTelegram.sendMessage.mockResolvedValue({});

      const result = await service.createOrder(mockCreateOrderDto);

      expect(result).toEqual(mockOrder);
      const prismaService = () => service.createOrder(mockCreateOrderDto);
      expect(prismaService).not.toThrow();
      expect(mockTelegram.sendMessage).toHaveBeenCalledWith(
        expect.stringContaining(`Новый заказ: #${mockOrder.id}`),
      );
      expect(mockTelegram.sendMessage).toHaveBeenCalledWith(
        expect.stringContaining(
          `Адрес: ${mockOrder.deliveryMethod === 'PickUp' ? 'Самовывоз' : mockOrder.address}`,
        ),
      );
      expect(mockTelegram.sendMessage).toHaveBeenCalledWith(
        expect.stringContaining(`Способ оплаты: ${mockOrder.paymentMethod}`),
      );
      expect(mockTelegram.sendMessage).toHaveBeenCalledWith(
        expect.stringContaining(`Заказчик: ${mockOrder.guestName}`),
      );
      expect(mockTelegram.sendMessage).toHaveBeenCalledWith(
        expect.stringContaining(
          `Итого: ${mockOrder.items.reduce((sum, item) => sum + item.orderAmount, 0)} сом`,
        ),
      );
    });

    it('should create order for user', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        email: 'user@test.com',
        phone: '+996555123456',
        firstName: 'User',
        bonus: 50,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.order.create.mockResolvedValue({
        id: 1,
        userId,
        items: [],
      });
      mockPrisma.user.update.mockResolvedValue({
        ...mockUser,
        bonus: mockUser.bonus - 20,
      });

      const result = await service.createOrder(
        {
          ...mockCreateOrderDto,
          bonusUsed: 20,
        },
        userId,
      );
      expect(result).toBeDefined();
      const prismaService = () =>
        prisma.order.update({
          where: { id: userId },
          data: { bonusUsed: { decrement: 20 } },
        });
      expect(prismaService).not.toThrow();
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 999;
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.createOrder(mockCreateOrderDto, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if not enough bonus', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        bonus: 10,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.createOrder(
          {
            ...mockCreateOrderDto,
            bonusUsed: 20,
          },
          userId,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const orderId = 1;
      const updateStatus: UpdateStatusDto = { status: 'Pending' };
      const mockOrder = {
        id: orderId,
        status: 'Processing',
        items: [],
      };

      mockPrisma.order.update.mockResolvedValue(mockOrder);

      const result = await service.updateStatus(updateStatus, orderId);
      expect(result).toEqual(mockOrder);
    });

    it('should update product stats when status is Delivered', async () => {
      const orderId = 1;
      const updateStatus: UpdateStatusDto = { status: 'Delivered' };
      const mockOrder = {
        id: orderId,
        status: 'Delivered',
        items: [{ productId: 1, quantity: 2 }],
      };

      mockPrisma.order.update.mockResolvedValue(mockOrder);
      mockPrisma.products.update.mockResolvedValue({});

      await service.updateStatus(updateStatus, orderId);
      expect(mockPrisma.products.update).toHaveBeenCalled();
    });

    it('should send telegram message when status is Canceled', async () => {
      const orderId = 1;
      const updateStatus: UpdateStatusDto = { status: 'Canceled' };
      const mockOrder = {
        id: orderId,
        status: 'Canceled',
        items: [],
      };

      mockPrisma.order.update.mockResolvedValue(mockOrder);

      const result = await service.updateStatus(updateStatus, orderId);
      expect(result).toHaveProperty('telegramMessage');
      expect(mockTelegram.sendMessage).toHaveBeenCalled();
    });

    it('should throw BadRequestException if update fails', async () => {
      const orderId = 1;
      const updateStatus: UpdateStatusDto = { status: 'Pending' };

      mockPrisma.order.update.mockResolvedValue(null);

      await expect(service.updateStatus(updateStatus, orderId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('autoDeletingOrder', () => {
    it('should delete orders older than 10 days', async () => {
      const mockResult = { count: 5 };
      mockPrisma.order.updateMany.mockResolvedValue(mockResult);

      await service.autoDeletingOrder();
      expect(mockPrisma.order.updateMany).toHaveBeenCalled();
    });
  });

  describe('autoDeletingCanceledOrder', () => {
    it('should delete canceled orders older than 7 days', async () => {
      const mockResult = { count: 3 };
      mockPrisma.order.updateMany.mockResolvedValue(mockResult);

      await service.autoDeletingCanceledOrder();
      expect(mockPrisma.order.updateMany).toHaveBeenCalled();
    });
  });
});
