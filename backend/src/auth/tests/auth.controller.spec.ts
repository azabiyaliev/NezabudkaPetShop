import { Test, TestingModule } from '@nestjs/testing';

import { Request, Response } from 'express';
import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { TokenAuthGuard } from '../../token.auth/token-auth.guard';
import { RecaptchaGuard } from '../../recaptcha/recaptcha.guard';
import { Role } from '@prisma/client';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let prismaService: PrismaService;

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  type MockUser = {
    id: number;
    email: string;
    firstName: string;
    secondName: string;
    password: string;
    phone: string | null;
    token: string | null;
    isProtected: boolean;
    role: Role;
    googleID: string | null;
    facebookID: string | null;
    bonus: number;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            generateUserToken: jest.fn(),
            validateUser: jest.fn(),
            logout: jest.fn(),
            verifyGoogleToken: jest.fn().mockImplementation(() =>
              Promise.resolve({
                iss: 'https://accounts.google.com',
                aud: 'client-id',
                iat: Date.now(),
                exp: Date.now() + 3600,
                email: 'john@example.com',
                sub: 'google-id',
                given_name: 'John',
                family_name: 'Doe',
              }),
            ),
            loginWithFacebook: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn().mockImplementation((data: MockUser) =>
                Promise.resolve({
                  id: 1,
                  email: data.email,
                  firstName: data.firstName,
                  secondName: data.secondName,
                  password: data.password,
                  phone: null,
                  token: null,
                  isProtected: false,
                  role: Role.client,
                  googleID: data.googleID,
                  facebookID: null,
                  bonus: 0,
                }),
              ),
            },
          },
        },
      ],
    })
      .overrideGuard(TokenAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RecaptchaGuard)
      .useValue({ canActivate: () => true })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and set cookies', async () => {
      const registerDto = {
        firstName: 'John',
        secondName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        recaptchaToken: 'token',
      };

      const mockUser = {
        id: 1,
        email: 'john@example.com',
        firstName: 'John',
        secondName: 'Doe',
        password: 'hashed-password',
        phone: '+996555123456',
        token: null,
        isProtected: false,
        role: Role.client,
        googleID: null,
        facebookID: null,
        bonus: 0,
      };

      jest.spyOn(authService, 'register').mockResolvedValue({
        message: 'Пользователь зарегистрирован и авторизован',
        user: mockUser,
      });
      jest.spyOn(authService, 'generateUserToken').mockResolvedValue('token');

      const result = await authController.register(registerDto, mockResponse);

      const registerSpy = jest.spyOn(authService, 'register');
      expect(registerSpy).toHaveBeenCalledWith(registerDto);
      const generateTokenSpy = jest.spyOn(authService, 'generateUserToken');
      expect(generateTokenSpy).toHaveBeenCalledWith(mockUser.id);
      const cookieSpy = jest.spyOn(mockResponse, 'cookie');
      expect(cookieSpy).toHaveBeenCalledWith('token', 'token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 10 * 24 * 60 * 60 * 1000,
      });
      expect(cookieSpy).toHaveBeenCalledWith('tokenPresent', 'true', {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
        maxAge: 10 * 24 * 60 * 60 * 1000,
      });
      expect(result).toEqual({
        message: 'Пользователь зарегистрирован и авторизован',
        user: mockUser,
      });
    });
  });

  describe('login', () => {
    it('should login a user and set cookies', async () => {
      const loginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'test',
        secondName: 'test',
        password: 'hashed-password',
        phone: '+996555123456',
        isProtected: true,
        role: Role.client,
        googleID: null,
        facebookID: null,
        bonus: 50,
        token:
          '123e4567-e89b-12d3-a456-426614174000' as `${string}-${string}-${string}-${string}-${string}`,
      };

      const validateUserSpy = jest
        .spyOn(authService, 'validateUser')
        .mockResolvedValue(mockUser);

      const result = await authController.login(loginDto, mockResponse);

      expect(validateUserSpy).toHaveBeenCalledWith(loginDto);

      const cookieSpy = jest.spyOn(mockResponse, 'cookie');
      expect(cookieSpy).toHaveBeenCalledWith('token', mockUser.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 10 * 24 * 60 * 60 * 1000,
      });
      expect(cookieSpy).toHaveBeenCalledWith('tokenPresent', 'true', {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
        maxAge: 10 * 24 * 60 * 60 * 1000,
      });
      expect(result).toEqual({
        message: 'Вход выполнен успешно',
        user: mockUser,
      });
    });
  });

  describe('logout', () => {
    it('should logout a user and clear cookies', async () => {
      const mockRequest = {
        user: { id: 1 },
      } as unknown as Request;

      jest.spyOn(authService, 'logout').mockResolvedValue(undefined);

      const result = await authController.logout(mockRequest, mockResponse);

      const logoutSpy = jest.spyOn(authService, 'logout');
      expect(logoutSpy).toHaveBeenCalledWith(1);
      const mockResponseSpy = jest.spyOn(mockResponse, 'clearCookie');
      expect(mockResponseSpy).toHaveBeenCalledWith('token');
      expect(mockResponseSpy).toHaveBeenCalledWith('tokenPresent');
      expect(result).toEqual({ message: 'Выход выполнен успешно' });
    });
  });
});
