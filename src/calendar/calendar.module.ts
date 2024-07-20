import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Couple, CoupleSchema } from '../users/schemas/couple.schema';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { Calendar, CalendarSchema } from './calendar.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Couple.name, schema: CoupleSchema }]),
    MongooseModule.forFeature([
      { name: Calendar.name, schema: CalendarSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [CalendarService],
  controllers: [CalendarController],
})
export class CalendarModule {}
