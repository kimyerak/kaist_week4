//users.servive.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { Couple } from './schemas/couple.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCoupleDto } from './dto/update-couple.dto';
import * as mongoose from 'mongoose';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
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
  ): Promise<Couple> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const partner = await this.userModel
      .findOne({ username: updateCoupleDto.partnerUsername })
      .exec();
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

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

  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
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
