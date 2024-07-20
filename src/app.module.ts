import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { Couple, CoupleSchema } from './users/schemas/couple.schema';
import { CalendarModule } from './calendar/calendar.module';
import { Calendar, CalendarSchema } from './calendar/schema/calendar.schema';
import { LetterModule } from './letters/letter.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/couple'), // MongoDB 연결 설정
    MongooseModule.forFeature([{ name: Couple.name, schema: CoupleSchema }]),
    UsersModule,
    CalendarModule,
    LetterModule,
    MongooseModule.forFeature([
      { name: Calendar.name, schema: CalendarSchema },
    ]),
  ],
})
export class AppModule {}
