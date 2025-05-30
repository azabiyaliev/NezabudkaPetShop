import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { RolesGuard } from '../token.auth/token.role.guard';
import { Roles } from '../roles/roles.decorator';
import { AuthRequest, RequestUser } from '../types';
import { CreateDto, UpdateDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get('orders/clients')
  async getClientsWithOrderCount() {
    return this.userService.getClientsWithOrderCount();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('superAdmin')
  @Post()
  async create(@Body() createDto: CreateDto) {
    return this.userService.createAdmin(createDto);
  }

  @Post('send-password-code')
  async sendPasswordResetCode(@Body() body: { email: string }) {
    return this.userService.sendPasswordResetLink(body.email);
  }

  @Post('validate-reset-code')
  async validateResetCode(@Body() body: { email: string; resetToken: string }) {
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new NotFoundException('Пользователь с таким email не найден');
    }
    return this.userService.validateResetToken(user.id, body.resetToken);
  }

  @Put('change-password')
  async changePassword(
    @Body() body: { resetToken: string; newPassword: string },
  ) {
    try {
      const passwordResetRecord =
        await this.userService.findPasswordResetRecordByToken(body.resetToken);

      if (!passwordResetRecord) {
        throw new NotFoundException(
          'Неверная ссылка или срок действия ссылки истек',
        );
      }

      const userId = passwordResetRecord.userId;

      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      await this.userService.validateResetToken(userId, body.resetToken);
      return this.userService.resetPasswordByToken(userId, body.newPassword);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @UseGuards(TokenAuthGuard)
  @Patch('new-password')
  async changeAuthorizedPassword(
      @Req() req: Request & { user: RequestUser },
      @Body() body: { currentPassword?: string; newPassword: string },
  ) {
    if (!body.currentPassword) {
      throw new BadRequestException('Текущий пароль обязателен');
    }

    const userId = req.user.id;

    return this.userService.updatePassword(
        userId,
        body.currentPassword,
        body.newPassword,
    );
  }

  @Get('superAdmin')
  async findSuper() {
    return this.userService.findSuperAdmin();
  }

  @Get('admins')
  async findAdmins() {
    return this.userService.findALlAdmins();
  }

  @Get('admin/:id')
  async findOneAdmin(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Некорректный ID');
    }
    return this.userService.findOneAdmin(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Некорректный ID');
    }
    return this.userService.findOne(userId);
  }

  @Get('account/:id')
  async findOneAccount(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Некорректный ID');
    }
    return this.userService.findOne(userId);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Некорректный ID');
    }
    return await this.userService.delete(id);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'client', 'superAdmin')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateDto,
    @Req() req: AuthRequest,
  ) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Некорректный ID');
    }
    return await this.userService.update(id, data, req.user);
  }

  @Patch(':id/bonus')
  async updateUserBonus(
    @Param('id') id: string,
    @Body('bonusAmount') bonusAmount: number,
  ): Promise<{ message: string }> {
    const userId = parseInt(id); // Преобразуем id из строки в число
    return this.userService.updateUserBonus(userId, bonusAmount);
  }
}
