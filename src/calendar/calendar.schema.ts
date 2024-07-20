import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Calendar extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  coupleId: MongooseSchema.Types.ObjectId;

  @Prop([{ title: { type: String }, date: { type: Date } }])
  anniversaries: { title: string; date: Date }[];

  @Prop()
  daysSinceStart?: number;
}

export const CalendarSchema = SchemaFactory.createForClass(Calendar);
