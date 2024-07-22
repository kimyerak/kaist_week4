import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  senderId: Types.ObjectId;

  @Prop({ required: true, enum: ['me', 'partner', 'ai'] })
  senderType: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  readBy: Types.ObjectId[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: Types.ObjectId, ref: 'Couple', required: true })
  coupleId: Types.ObjectId;

  @Prop({ type: [MessageSchema], default: [] })
  messages: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

export type ChatDocument = Chat & Document;
