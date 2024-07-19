import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { Couple, CoupleSchema } from './users/schemas/couple.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/couple'), // MongoDB 연결 설정
    MongooseModule.forFeature([{ name: Couple.name, schema: CoupleSchema }]),
    UsersModule,
  ],
})
export class AppModule {}
