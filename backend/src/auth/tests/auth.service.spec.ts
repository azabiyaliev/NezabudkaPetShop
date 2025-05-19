import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';

jest.mock('bcrypt');
jest.mock('crypto');
jest.mock('google-auth-library');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              findFirst: jest.fn(),
            },
            order: {
              count: jest.fn(),
              updateMany: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'GOOGLE_CLIENT_ID') {
                return 'mock-google-client-id';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);

    (bcrypt.genSalt as jest.Mock).mockResolvedValue('mock-salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('mock-hashed-password');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    (crypto.randomUUID as jest.Mock).mockReturnValue('mock-uuid');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const mockRegisterDto = {
      email: 'test@example.com',
      firstName: 'John',
      secondName: 'Doe',
      password: 'mock-password',
      phone: '+996 555 123 456',
      recaptchaToken: 'mock-token',
    };

    it('should register a new user successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: mockRegisterDto.email,
        firstName: mockRegisterDto.firstName,
        phone: '+996555123456',
        token: 'mock-uuid',
      });

      const result = await service.register(mockRegisterDto);

      expect(result).toMatchObject({
        message: 'Пользователь создан успешно',
        user: {
          email: 'test@example.com',
          firstName: 'John',
        },
      });
    });

    it('should throw ConflictException if phone already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        phone: '+996 555 123 456',
      });

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        new ConflictException(
          `Пользователь с таким номером +996 555 123 456 уже существует`,
        ),
      );
    });
  });

  describe('validateUser', () => {
    const mockLoginDto = {
      email: 'test@example.com',
      password: 'mock-password',
    };

    it('should validate and return user details', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'mock-hashed-password',
        firstName: 'John',
        secondName: 'Doe',
        token: 'mock-old-token',
        role: 'client',
        phone: '+996555123456',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(mockLoginDto);

      expect(result).toEqual(
        expect.objectContaining({
          email: 'test@example.com',
          firstName: 'John',
          token: 'mock-uuid',
        }),
      );
      const prismaUpdateSpy = jest.spyOn(prisma.user, 'update');
      expect(prismaUpdateSpy).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        data: { token: 'mock-uuid' },
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.validateUser(mockLoginDto)).rejects.toThrow(
        new UnauthorizedException(
          'Неверный email или пароль. Проверьте данные и попробуйте снова.',
        ),
      );
    });
  });

  describe('logout', () => {
    it('should logout the user by updating token', async () => {
      const userId = 1;

      await service.logout(userId);

      const prismaUpdateSpy = jest.spyOn(prisma.user, 'update');
      expect(prismaUpdateSpy).toHaveBeenCalledWith({
        where: { id: userId },
        data: { token: 'mock-uuid' },
      });
    });
  });

  describe('findByToken', () => {
    it('should return user by token', async () => {
      const mockUser = { id: 1, token: 'test-token' };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByToken('test-token');

      expect(result).toEqual(mockUser);
      const prismaFindFirst = jest.spyOn(prisma.user, 'findFirst');
      expect(prismaFindFirst).toHaveBeenCalledWith({
        where: { token: 'test-token' },
      });
    });
  });

  describe('verifyGoogleToken', () => {
    it('should verify Google token successfully', async () => {
      const mockPayload = { email: 'test@example.com' };
      const mockVerify = jest.fn().mockResolvedValue({
        getPayload: jest.fn().mockReturnValue(mockPayload),
      });
      (OAuth2Client.prototype.verifyIdToken as jest.Mock).mockImplementation(
        mockVerify,
      );

      const result = await service.verifyGoogleToken('mock-google-id-token');

      expect(result).toEqual(mockPayload);
      expect(mockVerify).toHaveBeenCalledWith({
        idToken: 'mock-google-id-token',
        audience: 'mock-google-client-id',
      });
    });

    it('should throw UnauthorizedException for invalid token (null payload)', async () => {
      const mockVerify = jest.fn().mockResolvedValue({
        getPayload: jest.fn().mockReturnValue(null),
      });
      (OAuth2Client.prototype.verifyIdToken as jest.Mock).mockImplementation(
        mockVerify,
      );

      await expect(service.verifyGoogleToken('invalid-token')).rejects.toThrow(
        new UnauthorizedException('Google authentication failed'),
      );
    });

    it('should handle Google authentication errors', async () => {
      (OAuth2Client.prototype.verifyIdToken as jest.Mock).mockRejectedValue(
        new Error('Google error'),
      );

      await expect(service.verifyGoogleToken('invalid-token')).rejects.toThrow(
        new UnauthorizedException('Google authentication failed'),
      );
    });
  });
});
