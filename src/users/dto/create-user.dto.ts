import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The username of the user' })
  username: string;

  @ApiProperty({ description: 'The password of the user' })
  password: string;

  @ApiProperty({ description: 'The nickname of the user' })
  nickname: string;

  @ApiProperty({ description: 'The username of the partner', required: false })
  partnerUsername?: string;

  @ApiProperty({
    description: 'The start date of the relationship',
    required: false,
  })
  startDate?: Date;
}
