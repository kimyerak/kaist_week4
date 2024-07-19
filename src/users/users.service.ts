//users.servive.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { Couple } from './schemas/couple.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

    //커플관련 로직
    let coupleId: mongoose.Schema.Types.ObjectId = null;
    if (createUserDto.partnerUsername) {
      const partner = await this.userModel.findOne({
        username: createUserDto.partnerUsername,
      });
      if (!partner) {
        throw new NotFoundException('Partner not found');
      }

      // startDate에서 시간 제거 (년/월/일만 남김)
      const startDate = new Date(createUserDto.startDate);
      startDate.setHours(0, 0, 0, 0);

      const couple = new this.coupleModel({
        user1Id: partner._id,
        user2Id: null, // User2Id는 나중에 추가됩니다
        startDate: createUserDto.startDate,
      });
      const createdCouple = await couple.save();
      coupleId = createdCouple._id as MongooseSchema.Types.ObjectId;

      partner.coupleId = coupleId as any;
      await partner.save();
    }

    //드디어 새로운 유저 등록
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      coupleId,
    });
    const createdUser = await newUser.save();

    if (createUserDto.partnerUsername) {
      const couple = await this.coupleModel.findById(coupleId);
      couple.user2Id = createdUser._id as MongooseSchema.Types.ObjectId;
      await couple.save();
    }

    return createdUser;
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
