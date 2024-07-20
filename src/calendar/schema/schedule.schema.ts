import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Schedule extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Couple', required: true })
  coupleId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  description: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
