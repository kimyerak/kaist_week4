import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Couple } from '../users/schemas/couple.schema';
import { Calendar } from './calendar.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(Couple.name) private coupleModel: Model<Couple>,
    @InjectModel(Calendar.name) private calendarModel: Model<Calendar>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getCoupleAnniversaries(coupleId: string) {
    const calendar = await this.calendarModel.findOne({ coupleId });
    if (!calendar) {
      const couple = await this.coupleModel.findById(coupleId).exec();
      if (!couple) {
        throw new Error('Couple not found');
      }
      const startDate = new Date(couple.startDate);
      const anniversaries = this.calculateAnniversaries(startDate);

      // 새로운 캘린더 문서를 생성하여 저장
      const newCalendar = new this.calendarModel({
        coupleId,
        anniversaries,
      });
      await newCalendar.save();

      return { anniversaries };
    }
    return {
      anniversaries: calendar.anniversaries,
    };
  }

  async getCoupleInfo(coupleId: string) {
    const couple = await this.coupleModel.findById(coupleId).exec();
    if (!couple) {
      throw new Error('Couple not found');
    }

    //id만으로 각자의 닉네임 알아내기
    const [user1, user2] = await Promise.all([
      this.userModel.findById(couple.user1Id).exec(),
      this.userModel.findById(couple.user2Id).exec(),
    ]);

    if (!user1 || !user2) {
      throw new Error('User not found');
    }

    const daysSinceStart = this.calculateDaysSinceStart(couple.startDate);

    return {
      user1Nickname: user1.nickname,
      user2Nickname: user2.nickname,
      daysSinceStart,
    };
  }

  private calculateAnniversaries(startDate: Date) {
    const anniversaries = [];
    const dayIntervals = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    const yearIntervals = [1, 2, 3];

    dayIntervals.forEach((days) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + days);
      anniversaries.push({ title: `${days} day`, date });
    });

    yearIntervals.forEach((years) => {
      const date = new Date(startDate);
      date.setFullYear(date.getFullYear() + years);
      anniversaries.push({ title: `${years} year`, date });
    });

    return anniversaries;
  }

  private calculateDaysSinceStart(startDate: Date) {
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}
