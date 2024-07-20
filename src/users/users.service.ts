//users.servive.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { Couple } from './schemas/couple.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCoupleDto } from './dto/update-couple.dto';
import * as mongoose from 'mongoose';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Couple.name) private coupleModel: Model<Couple>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      username: createUserDto.username,
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    //새로운 유저 1인 등록
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.save();
  }

  //couple 연결 요청시
  async updateCouple(
    id: string,
    updateCoupleDto: UpdateCoupleDto,
  ): Promise<Couple | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // partnerUsername 또는 startDate가 null인 경우 처리
    if (!updateCoupleDto.partnerUsername || !updateCoupleDto.startDate) {
      user.coupleId = null;
      await user.save();
      return null;
    }

    const partner = await this.userModel
      .findOne({ username: updateCoupleDto.partnerUsername })
      .exec();
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    // 파트너에게 이미 coupleID가 할당되어 있는지 확인
    if (partner.coupleId) {
      throw new ConflictException(
        '그 사람에겐 이미 coupleID가 할당되어 있습니다',
      );
    }

    //날짜 형식 2024-07-20으로 받으면 시간은 자동 0:0:0:0
    const startDate = new Date(updateCoupleDto.startDate);
    startDate.setHours(0, 0, 0, 0);

    const couple = new this.coupleModel({
      user1Id: user._id,
      user2Id: partner._id,
      startDate: startDate,
    });

    const createdCouple = await couple.save();

    user.coupleId = createdCouple._id as mongoose.Types.ObjectId;
    partner.coupleId = createdCouple._id as mongoose.Types.ObjectId;
    await user.save();
    await partner.save();

    return createdCouple;
  }

  //로그인시 비밀번호 비교
  async validateUser(loginUserDto: LoginUserDto): Promise<UserDocument> {
    const { username, password } = loginUserDto;
    const user = await this.userModel.findOne({ username }).exec();

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    throw new NotFoundException('Invalid credentials');
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    Object.assign(user, updateUserDto);
    return user.save();
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
