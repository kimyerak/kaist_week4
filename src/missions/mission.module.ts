import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MissionsService } from './missions.service';
import { MissionsController } from './missions.controller';
import { Mission, MissionSchema } from './schemas/mission.schema';
import { AwsModule } from '../aws.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mission.name, schema: MissionSchema }]),
    AwsModule,
  ],
  providers: [MissionsService],
  controllers: [MissionsController],
  exports: [MongooseModule],
})
export class MissionsModule {}
