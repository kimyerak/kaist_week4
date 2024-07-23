import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Letter, LetterSchema } from './schema/letter.schema';
import { LetterService } from './letter.service';
import { LetterController } from './letter.controller';
import { AwsModule } from '../aws.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Letter.name, schema: LetterSchema }]),
    AwsModule,
  ],
  providers: [LetterService],
  controllers: [LetterController],
  exports: [MongooseModule],
})
export class LetterModule {}
