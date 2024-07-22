import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { OpenAiService } from './openai.service';
import { Chat, ChatSchema } from './schemas/chat.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  controllers: [ChatController],
  providers: [ChatService, OpenAiService],
})
export class ChatModule {}
