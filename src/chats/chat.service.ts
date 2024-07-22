import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Chat, ChatDocument, Message } from './schemas/chat.schema';
import { OpenAiService } from './openai.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    private readonly openAiService: OpenAiService,
  ) {}

  async sendMessage(
    coupleId: string,
    senderId: string,
    message: string,
    senderType: string,
  ) {
    if (!isValidObjectId(coupleId)) {
      throw new Error('Invalid coupleId');
    }

    const timestamp = new Date();
    const newMessage: Message = {
      senderId: senderType === 'ai' ? null : new Types.ObjectId(senderId),
      senderType,
      message,
      timestamp,
      readBy: [],
    };

    let chat = await this.chatModel.findOne({
      coupleId: new Types.ObjectId(coupleId),
    });
    if (!chat) {
      chat = new this.chatModel({
        coupleId: new Types.ObjectId(coupleId),
        messages: [newMessage],
      });
    } else {
      chat.messages.push(newMessage);
    }

    await chat.save();

    if (senderType === 'user') {
      try {
        const aiResponse = await this.openAiService.sendMessage(message);
        const aiMessage: Message = {
          senderId: null,
          senderType: 'ai',
          message: aiResponse,
          timestamp: new Date(),
          readBy: [],
        };
        chat.messages.push(aiMessage);
        await chat.save();
      } catch (error) {
        console.error('Failed to get response from OpenAI API:', error);
      }
    }

    return chat;
  }

  async getChat(coupleId: string) {
    if (!isValidObjectId(coupleId)) {
      throw new Error('Invalid coupleId');
    }
    return this.chatModel
      .findOne({ coupleId: new Types.ObjectId(coupleId) })
      .exec();
  }
}
