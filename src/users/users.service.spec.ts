import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    deleteOne: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
    new: jest.fn().mockReturnThis(),
  };

  const mockUser = {
    username: 'testuser',
    password: 'hashedpassword',
    nickname: 'testnickname', // nickname 속성 추가
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpassword',
        nickname: 'testnickname', // nickname 속성 추가
      };

      mockUserModel.findOne.mockReturnValue(null);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');
      mockUserModel.new.mockReturnValue(mockUser);
      mockUser.save.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        username: createUserDto.username,
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw conflict exception if username already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpassword',
        nickname: 'testnickname', // nickname 속성 추가
      };

      mockUserModel.findOne.mockReturnValue(mockUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('validateUser', () => {
    it('should validate user credentials', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      mockUserModel.findOne.mockReturnValue({
        ...mockUser,
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser(loginUserDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        username: loginUserDto.username,
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw not found exception if credentials are invalid', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      mockUserModel.findOne.mockReturnValue({
        ...mockUser,
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.validateUser(loginUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        password: 'newpassword',
      };

      mockUserModel.findById.mockReturnValue({
        ...mockUser,
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashednewpassword');
      mockUser.save.mockResolvedValue(mockUser);

      const result = await service.updateUser('1', updateUserDto);

      expect(mockUserModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw not found exception if user does not exist', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const updateUserDto: UpdateUserDto = {
        password: 'newpassword',
      };

      await expect(service.updateUser('1', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockUserModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      await service.deleteUser('1');

      expect(mockUserModel.deleteOne).toHaveBeenCalledWith({ _id: '1' });
    });

    it('should throw not found exception if user does not exist', async () => {
      mockUserModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      });

      await expect(service.deleteUser('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.getUserById('1');

      expect(mockUserModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw not found exception if user does not exist', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getUserById('1')).rejects.toThrow(NotFoundException);
    });
  });
});
