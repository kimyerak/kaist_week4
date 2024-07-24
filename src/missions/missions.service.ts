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

  // async update(
  //   id: string,
  //   updateMissionDto: UpdateMissionDto,
  //   photos: Express.Multer.File[],
  // ): Promise<Mission> {
  //   const mission = await this.missionModel.findById(id).exec();
  //   if (
  //     updateMissionDto.photos === null ||
  //     updateMissionDto.photos.length === 0
  //   ) {
  //     // photos가 null인 경우, 모든 사진을 삭제
  //     mission.photos = [];
  //   } else if (photos && photos.length > 0) {
  //     const photoUrls = await Promise.all(
  //       photos.map((photo) => this.s3Service.uploadFile('mission', photo)),
  //     );
  //     mission.photos.push(...photoUrls);
  //   }
  //   Object.assign(mission, updateMissionDto);
  //   return mission.save();
  // }

  //1. 내용만 변경. 사진은 그대로
  async updateContent(
    id: string,
    updateMissionDto: UpdateMissionDto,
  ): Promise<Mission> {
    const mission = await this.missionModel.findById(id).exec();
    if (!mission) {
      throw new Error('Mission not found');
    }

    // 텍스트 기반 필드 업데이트
    mission.mission = updateMissionDto.mission || mission.mission;
    mission.diary = updateMissionDto.diary || mission.diary;
    mission.aiComment = updateMissionDto.aiComment || mission.aiComment;
    mission.date = updateMissionDto.date || mission.date;

    return mission.save();
  }

  //2. 사진 삭제
  async deleteMissionImage(id: string, imageUrl: string): Promise<Mission> {
    const mission = await this.missionModel.findById(id).exec();
    if (!mission) {
      throw new Error('Mission not found');
    }

    // 해당 이미지 URL을 미션의 photos에서 제거
    mission.photos = mission.photos.filter((photo) => photo !== imageUrl);

    // S3에서 실제로 파일을 삭제하려면 아래 주석을 해제하세요
    // await this.s3Service.deleteFile(imageUrl);

    return mission.save();
  }

  //3. 사진 추가
  async addMissionImages(
    id: string,
    photos: Express.Multer.File[],
  ): Promise<Mission> {
    const mission = await this.missionModel.findById(id).exec();
    if (!mission) {
      throw new Error('Mission not found');
    }

    // 새로운 사진을 S3에 업로드하고, 그 URL을 미션의 photos에 추가
    const photoUrls = await Promise.all(
      photos.map((photo) => this.s3Service.uploadFile('mission', photo)),
    );

    mission.photos.push(...photoUrls);

    return mission.save();
  }

  async remove(id: string): Promise<Mission> {
    return this.missionModel.findByIdAndDelete(id).exec();
  }
}
