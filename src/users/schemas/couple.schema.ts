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

CoupleSchema.pre('save', function (next) {
  if (this.isNew) {
    const startDate = this.startDate;
    const days = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    const years = [1, 2, 3];
    this.anniversaries = [];

    days.forEach((day) => {
      const anniversaryDate = new Date(startDate);
      anniversaryDate.setDate(anniversaryDate.getDate() + day);
      this.anniversaries.push({ title: `${day}일`, date: anniversaryDate });
    });

    years.forEach((year) => {
      const anniversaryDate = new Date(startDate);
      anniversaryDate.setFullYear(anniversaryDate.getFullYear() + year);
      this.anniversaries.push({ title: `${year}주년`, date: anniversaryDate });
    });
  }
  next();
});
