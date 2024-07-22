import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    description: 'The ID of the couple',
    example: '60d21b4667d0d8992e610c85',
  })
  coupleId: string;

  @ApiProperty({
    description: 'The ID of the sender',
    example: '60d21b4667d0d8992e610c86',
  })
  senderId: string;

  @ApiProperty({ description: 'The type of the sender', example: 'user' })
  senderType: string;

  @ApiProperty({ description: 'The message content', example: 'Hello!' })
  message: string;
}