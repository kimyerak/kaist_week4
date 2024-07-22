//user.controller.ts

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto, UserResponseDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCoupleDto } from './dto/update-couple.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: '사용순위1 - 회원가입' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Username already exists.' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '사용순위2 - username, password로 로그인' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Invalid credentials.' })
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserResponseDto> {
    try {
      this.logger.log(`Attempting to log in user: ${loginUserDto.username}`);
      const user = await this.usersService.validateUser(loginUserDto);
      this.logger.log(`User logged in successfully: ${loginUserDto.username}`);
      return {
        _id: user._id.toString(),
        username: user.username,
        nickname: user.nickname,
        coupleId: user.coupleId ?? null,
      };
    } catch (error) {
      this.logger.error(
        `Login failed for user: ${loginUserDto.username}`,
        error.stack,
      );
      throw error;
    }
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update user information' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put('couple/:id') // 커플 정보를 업데이트하는 새로운 엔드포인트 추가
  @ApiOperation({ summary: '사용순위3 - 커플등록' })
  @ApiResponse({
    status: 200,
    description: 'The couple information has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User or partner not found.' })
  async updateCouple(
    @Param('id') id: string,
    @Body() updateCoupleDto: UpdateCoupleDto,
  ) {
    return this.usersService.updateCouple(id, updateCoupleDto);
  }
}
