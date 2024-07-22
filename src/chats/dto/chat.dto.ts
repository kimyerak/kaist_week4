import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class ChatDto {
  @ApiProperty({
    description: 'The ID of the chat',
    example: '60d21b4667d0d8992e610c87',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'The ID of the couple',
    example: '60d21b4667d0d8992e610c85',
  })
  coupleId: Types.ObjectId;

  @ApiProperty({
    description: 'The messages in the chat',
    example: [
      {
        senderId: '60d21b4667d0d8992e610c86',
        senderType: 'user',
        message: 'Hello!',
        timestamp: '2024-07-22T10:46:21.048Z',
        readBy: [],
      },
    ],
  })
  messages: {
    senderId: Types.ObjectId | null;
    message: string;
    timestamp: Date;
    readBy: Types.ObjectId[];
  }[];
}
