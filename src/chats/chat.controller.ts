import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatDto } from './dto/chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message' })
  @ApiBody({ type: CreateChatDto })
  @ApiResponse({
    status: 201,
    description: 'The message has been sent.',
    type: ChatDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendMessage(@Body() createChatDto: CreateChatDto) {
    const { coupleId, senderId, message, topic } = createChatDto;
    return this.chatService.sendMessage(coupleId, senderId, message, topic);
  }

  @Get(':coupleId')
  @ApiOperation({ summary: 'Get chat messages for a couple' })
  @ApiParam({ name: 'coupleId', description: 'The ID of the couple' })
  @ApiResponse({
    status: 200,
    description: 'The chat messages have been retrieved.',
    type: [ChatDto],
  })
  async getChat(@Param('coupleId') coupleId: string) {
    return this.chatService.getChat(coupleId);
  }
}
