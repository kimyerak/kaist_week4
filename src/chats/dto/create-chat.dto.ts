import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    description: 'The ID of the couple',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsMongoId()
  @IsNotEmpty()
  coupleId: string;

  @ApiProperty({
    description: 'The ID of the sender',
    example: '60d21b4667d0d8992e610c86',
  })
  @IsMongoId()
  @IsNotEmpty()
  senderId: string;

  @ApiProperty({ description: 'The type of the sender', example: 'user' })
  @IsString()
  @IsNotEmpty()
  senderType: string;

  @ApiProperty({ description: 'The message content', example: 'Hello!' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
