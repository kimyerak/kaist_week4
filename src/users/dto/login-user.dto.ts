//login-user.dto

import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class LoginUserDto {
  @ApiProperty({ description: 'The username of the user' })
  username: string;

  @ApiProperty({ description: 'The password of the user' })
  password: string;
}
export class UserResponseDto {
  @ApiProperty({ description: 'The ID of the user' })
  _id: string;

  @ApiProperty({ description: 'The username of the user' })
  username: string;

  @ApiProperty({ description: 'The nickname of the user' })
  nickname: string;

  @ApiProperty({ description: 'The couple ID of the user', nullable: true })
  coupleId: Types.ObjectId | null;
}
