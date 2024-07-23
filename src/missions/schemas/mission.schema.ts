import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Mission extends Document {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Couple', required: true })
  coupleId: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  mission: string;

  @ApiProperty()
  @Prop({ required: true })
  date: Date;

  @ApiProperty()
  @Prop()
  diary: string;

  @ApiProperty({ type: [String] })
  @Prop([String])
  photos: string[];

  @ApiProperty()
  @Prop()
  aiComment: string;
}

export const MissionSchema = SchemaFactory.createForClass(Mission);
