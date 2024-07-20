import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Letter } from './schema/letter.schema';

@Injectable()
export class LetterService {
  constructor(@InjectModel(Letter.name) private letterModel: Model<Letter>) {}

  async createLetter(
    coupleId: string,
    senderId: string,
    receiverId: string,
    title: string,
    content: string,
    photos: string[],
    date: Date,
  ) {
    const newLetter = new this.letterModel({
      coupleId,
      senderId,
      receiverId,
      title,
      content,
      photos,
      date,
    });
    return await newLetter.save();
  }

  async updateLetter(
    letterId: string,
    title: string,
    content: string,
    photos: string[],
    date: Date,
  ) {
    return await this.letterModel.findByIdAndUpdate(
      letterId,
      { title, content, photos, date },
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
