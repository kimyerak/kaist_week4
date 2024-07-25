import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { Couple, CoupleSchema } from './users/schemas/couple.schema';
import { CalendarModule } from './calendar/calendar.module';
import { Calendar, CalendarSchema } from './calendar/schema/calendar.schema';
import { LetterModule } from './letters/letter.module';
import { AwsModule } from './aws.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chats/chat.module';
import { MissionsModule } from './missions/mission.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://newUser:newPassword@localhost:27017/desiredDatabase',
    ),
    MongooseModule.forFeature([{ name: Couple.name, schema: CoupleSchema }]),
    UsersModule,
    CalendarModule,
    LetterModule,
    AwsModule,
    ChatModule,
    MissionsModule,
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
