import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Couple extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  user1Id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  user2Id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop([{ title: { type: String }, date: { type: Date } }])
  anniversaries: { title: string; date: Date }[];
}

export const CoupleSchema = SchemaFactory.createForClass(Couple);
