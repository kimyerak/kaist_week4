import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(
    @Body('coupleId') coupleId: string,
    @Body('senderId') senderId: string,
    @Body('message') message: string,
    @Body('senderType') senderType: string,
  ) {
    return this.chatService.sendMessage(
      coupleId,
      senderId,
      message,
      senderType,
    );
  }

  @Get(':coupleId')
  async getChat(@Param('coupleId') coupleId: string) {
    return this.chatService.getChat(coupleId);
  }
}
