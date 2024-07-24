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
    // receiverId: string,
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
      // receiverId,
      title,
      content,
      photos: photoUrls,
      date,
    });
    return await newLetter.save();
  }

  // async updateLetter(
  //   letterId: string,
  //   title?: string,
  //   content?: string,
  //   photos?: Express.Multer.File[],
  //   date?: Date,
  // ) {
  //   console.log('photos', photos);
  //   const updateFields: any = {};
  //   if (title !== undefined) updateFields.title = title;
  //   if (content !== undefined) updateFields.content = content;
  //   if (date !== undefined) updateFields.date = date;
  //   if (photos !== undefined) {
  //     const photoUrls = await Promise.all(
  //       photos.map((photo) => this.s3Service.uploadFile('letter', photo)),
  //     );
  //     updateFields.photos = photoUrls;
  //   }

  //   return await this.letterModel.findByIdAndUpdate(letterId, updateFields, {
  //     new: true,
  //   });
  // }

  // 1. 기존 letter 내용만 수정 (사진 변경 없음)
  async updateLetterContent(
    letterId: string,
    title?: string,
    content?: string,
    date?: Date,
  ) {
    const updateFields: any = {};
    if (title !== undefined) updateFields.title = title;
    if (content !== undefined) updateFields.content = content;
    if (date !== undefined) updateFields.date = date;

    return await this.letterModel.findByIdAndUpdate(letterId, updateFields, {
      new: true,
    });
  }

  // 2. 특정 사진 삭제
  async deleteLetterImage(letterId: string, imageUrl: string) {
    const letter = await this.letterModel.findById(letterId);
    if (!letter) {
      throw new Error('Letter not found');
    }

    const updatedPhotos = letter.photos.filter((photo) => photo !== imageUrl);

    // S3에서 실제로 파일을 삭제하려면 이 부분을 사용
    // await this.s3Service.deleteFile(imageUrl);

    return await this.letterModel.findByIdAndUpdate(
      letterId,
      { photos: updatedPhotos },
      { new: true },
    );
  }

  // 3. 새로운 사진 추가
  async addLetterImages(letterId: string, photos: Express.Multer.File[]) {
    const letter = await this.letterModel.findById(letterId);
    if (!letter) {
      throw new Error('Letter not found');
    }

    const newPhotoUrls = await Promise.all(
      photos.map((photo) => this.s3Service.uploadFile('letter', photo)),
    );

    const updatedPhotos = letter.photos.concat(newPhotoUrls);

    return await this.letterModel.findByIdAndUpdate(
      letterId,
      { photos: updatedPhotos },
      { new: true },
    );
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
