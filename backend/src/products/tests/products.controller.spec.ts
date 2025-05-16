import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../../auth/auth.service';
import { TokenAuthGuard } from '../../token.auth/token-auth.guard';
import { RolesGuard } from '../../token.auth/token.role.guard';
import { AuthRequest } from '../../types';
import { CreateProductsDto } from '../../dto/createProductsDto';
import { Role } from '@prisma/client';
import { ImageProcessorService } from '../../common/image-processor.service';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  const mockProductsService = {
    addProduct: jest.fn(),
    updateProductItem: jest.fn(),
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

  const mockImageProcessor = {
    convertToWebP: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
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
          provide: ImageProcessorService,
          useValue: mockImageProcessor,
        },
        TokenAuthGuard,
        RolesGuard,
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });
  describe('createProduct', () => {
    it('should create a product', async () => {
      const req: Partial<AuthRequest> = {
        user: {
          id: 1,
          role: Role.admin,
          isProtected: false,
          email: 'test@test.com',
          firstName: 'Test',
          secondName: 'User',
          password: 'hashed-password',
          phone: null,
          token: null,
          googleID: null,
          facebookID: null,
          bonus: 0,
        },
      };

      if (!req.user) {
        throw new Error('User is not authenticated');
      }

      const productDto: CreateProductsDto = {
        productName: 'test product name',
        productPhoto: 'test.jpg',
        productPrice: 100,
        productDescription: 'test description',
        brandId: 1,
        categoryId: [1, 2],
        existence: 'true',
        sales: true,
        startDateSales: new Date(2025, 3, 28),
        endDateSales: new Date(2025, 4, 28),
        productManufacturer: 'test manufacturer',
        productSize: 'test size',
        productWeight: 1.5,
        productAge: '1+',
        productFeedClass: 'Premium',
        promoPercentage: 50,
        promoPrice: 50,
      };

      const mockFile = {
        originalname: 'test.jpg',
        buffer: Buffer.from('mocked file content'),
      } as Express.Multer.File;

      const mockConvertedPath = '/public/productImg/PRODUCT.webp';
      mockImageProcessor.convertToWebP.mockResolvedValue(mockConvertedPath);

      const createProduct = {
        id: 1,
        ...productDto,
        productPhoto: mockConvertedPath,
      };

      mockProductsService.addProduct.mockResolvedValue(createProduct);
      mockAuthService.findByToken.mockResolvedValue(req.user);

      const result = await productsController.createProduct(
        productDto,
        mockFile,
      );

      expect(result).toEqual(createProduct);
      expect(mockProductsService.addProduct).toHaveBeenCalledWith({
        ...productDto,
        productPhoto: mockConvertedPath,
        productPrice: Number(productDto.productPrice),
        brandId: Number(productDto.brandId),
        categoryId: productDto.categoryId.map(Number),
      });
    });
  });
});
