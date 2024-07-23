import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Letter } from './schema/letter.schema';
import { S3Service } from '../S3.service';

@Injectable()
export class LetterService {
  constructor(
    @InjectModel(Letter.name) private letterModel: Model<Letter>,
    private readonly s3Service: S3Service,
  ) {}

  async createLetter(
    coupleId: string,
    senderId: string,
    receiverId: string,
    title: string,
    content: string,
    photos: Express.Multer.File[],
    date: Date,
  ) {
    // photos가 undefined일 때 빈 배열로 초기화
    const photoUrls = photos
      ? await Promise.all(
          photos.map((photo) => this.s3Service.uploadFile('letter', photo)),
        )
      : [];

    const newLetter = new this.letterModel({
      coupleId,
      senderId,
      receiverId,
      title,
      content,
      photos: photoUrls,
      date,
    });
    return await newLetter.save();
  }

  async updateLetter(
    letterId: string,
    title?: string,
    content?: string,
    photos?: Express.Multer.File[],
    date?: Date,
  ) {
    const updateFields: any = {};
    if (title !== undefined) updateFields.title = title;
    if (content !== undefined) updateFields.content = content;
    if (date !== undefined) updateFields.date = date;
    if (photos !== undefined) {
      const photoUrls = await Promise.all(
        photos.map((photo) => this.s3Service.uploadFile('letter', photo)),
      );
      updateFields.photos = photoUrls;
    }

    return await this.letterModel.findByIdAndUpdate(letterId, updateFields, {
      new: true,
    });
  }

  async deleteLetter(letterId: string) {
    return await this.letterModel.findByIdAndDelete(letterId);
  }

  async getLetters(coupleId: string) {
    return await this.letterModel.find({ coupleId });
  }

  async getLetter(letterId: string) {
    return await this.letterModel.findById(letterId);
  }
}
