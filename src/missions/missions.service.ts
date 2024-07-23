//mission.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mission } from './schemas/mission.schema';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { S3Service } from '../S3.service';

@Injectable()
export class MissionsService {
  constructor(
    @InjectModel(Mission.name) private missionModel: Model<Mission>,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    createMissionDto: CreateMissionDto,
    photos: Express.Multer.File[],
  ): Promise<Mission> {
    const photoUrls = photos
      ? await Promise.all(
          photos.map((photo) => this.s3Service.uploadFile('mission', photo)),
        )
      : [];

    const createdMission = new this.missionModel({
      ...createMissionDto,
      photos: photoUrls,
    });
    return createdMission.save();
  }

  async findAll(coupleId: string): Promise<Mission[]> {
    return this.missionModel.find({ coupleId }).exec();
  }

  async findOne(id: string): Promise<Mission> {
    return this.missionModel.findById(id).exec();
  }

  async update(
    id: string,
    updateMissionDto: UpdateMissionDto,
    photos: Express.Multer.File[],
  ): Promise<Mission> {
    const mission = await this.missionModel.findById(id).exec();
    if (photos && photos.length > 0) {
      const photoUrls = await Promise.all(
        photos.map((photo) => this.s3Service.uploadFile('mission', photo)),
      );
      mission.photos.push(...photoUrls);
    }
    Object.assign(mission, updateMissionDto);
    return mission.save();
  }

  async remove(id: string): Promise<Mission> {
    return this.missionModel.findByIdAndDelete(id).exec();
  }
}
