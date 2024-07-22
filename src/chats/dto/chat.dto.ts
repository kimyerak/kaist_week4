import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class ChatDto {
  @ApiProperty({
    description: 'The ID of the chat',
    example: '60d21b4667d0d8992e610c85',
  })
  _id: string;

  @ApiProperty({
    description: 'The ID of the couple',
    example: '60d21b4667d0d8992e610c85',
  })
  coupleId: string;

  @ApiProperty({
    description: 'The list of messages',
    type: [Object],
    example: [
      {
        senderId: '60d21b4667d0d8992e610c86',
        senderType: 'user',
        message: 'Hello!',
        timestamp: new Date(),
        readBy: [],
      },
    ],
  })
  messages: {
    senderId: Types.ObjectId;
    senderType: string;
    message: string;
    timestamp: Date;
    readBy: Types.ObjectId[];
  }[];
}
