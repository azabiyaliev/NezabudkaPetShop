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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { RolesGuard } from '../token.auth/token.role.guard';
import { Roles } from '../roles/roles.decorator';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
import { RequestUser } from '../types';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Post('send-password-code')
  async sendPasswordResetCode(@Body() body: { email: string }) {
    return this.userService.sendPasswordTheCode(body.email);
  }

  @Post('validate-reset-code')
  async validateResetCode(@Body() body: { email: string; resetCode: string }) {
    const user = await this.userService.findOne(body.email);
    return this.userService.validateResetCode(user.id, body.resetCode);
  }

  @Put('change-password')
  async changePassword(
    @Body() body: { resetCode: string; newPassword: string },
  ) {
    try {
      const passwordResetRecord =
        await this.userService.findPasswordResetRecord(body.resetCode);

      if (!passwordResetRecord) {
        throw new NotFoundException(
          'Неверный код или срок действия кода истек',
        );
      }

      const userId = passwordResetRecord.userId;

      const user = await this.userService.findOne(userId.toString());

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      await this.userService.validateResetCode(userId, body.resetCode);

      return this.userService.updatePassword(userId, body.newPassword);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @UseGuards(TokenAuthGuard)
  @Patch('new-password')
  async changeAuthorizedPassword(
    @Req() req: Request & { user: RequestUser },
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const userId = req.user.id;
    const user = await this.userService.findOne(userId.toString());

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(body.currentPassword, user.password);

    if (!isMatch) {
      throw new HttpException(
        'Неверный текущий пароль',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userService.updatePassword(userId, body.newPassword);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'client')
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<User>) {
    return this.userService.update(id, data);
  }
}
