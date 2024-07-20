import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { Couple, CoupleSchema } from './users/schemas/couple.schema';
import { CalendarModule } from './calendar/calendar.module';
import { Calendar, CalendarSchema } from './calendar/schema/calendar.schema';
import { LetterModule } from './letters/letter.module';
import { AwsModule } from './letters/aws.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/couple'), // MongoDB 연결 설정
    MongooseModule.forFeature([{ name: Couple.name, schema: CoupleSchema }]),
    UsersModule,
    CalendarModule,
    LetterModule,
    AwsModule,
    MongooseModule.forFeature([
      { name: Calendar.name, schema: CalendarSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './upload', // 파일 임시 저장소 경로
    }),
  ],
})
export class AppModule {}
