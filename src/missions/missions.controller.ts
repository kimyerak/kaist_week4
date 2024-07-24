//mission.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Query,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { Mission } from './schemas/mission.schema';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('missions')
@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @ApiOperation({ summary: 'Create a new mission' })
  @ApiBody({
    schema: {
      properties: {
        coupleId: { type: 'string' },
        mission: { type: 'string' },
        diary: { type: 'string' },
        aicomment: { type: 'string' },
        photos: { type: 'array', items: { type: 'string', format: 'binary' } },
        date: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'The mission has been successfully created.',
    type: CreateMissionDto,
  })
  @Post()
  @UseInterceptors(FilesInterceptor('photos'))
  create(
    @Body() createMissionDto: CreateMissionDto,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    return this.missionsService.create(createMissionDto, photos);
  }

  @ApiOperation({ summary: 'Get all missions for a couple' })
  @ApiResponse({
    status: 200,
    description: 'Return all missions for a couple.',
    type: [Mission],
  })
  @Get(':coupleId')
  findAll(@Param('coupleId') coupleId: string) {
    return this.missionsService.findAll(coupleId);
  }

  @ApiOperation({ summary: 'Get a mission by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the mission with the given id.',
    type: Mission,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionsService.findOne(id);
  }

  // @ApiOperation({ summary: 'Update a mission by id' })
  // @ApiBody({
  //   schema: {
  //     properties: {
  //       coupleId: { type: 'string' },
  //       mission: { type: 'string' },
  //       diary: { type: 'string' },
  //       aiComment: { type: 'string' },
  //       photos: { type: 'array', items: { type: 'string', format: 'binary' } },
  //       date: { type: 'string', format: 'date-time' },
  //     },
  //   },
  // })
  // @ApiConsumes('multipart/form-data')
  // @ApiResponse({
  //   status: 200,
  //   description: 'The mission has been successfully updated.',
  //   type: Mission,
  // })
  // @Patch(':id')
  // @UseInterceptors(FilesInterceptor('photos'))
  // update(
  //   @Param('id') id: string,
  //   @Body() updateMissionDto: UpdateMissionDto,
  //   @UploadedFiles() photos: Express.Multer.File[],
  // ) {
  //   return this.missionsService.update(id, updateMissionDto, photos);
  // }

  //1. 내용만 수정. 사진은 그대로
  @ApiOperation({ summary: 'Update mission content' })
  @ApiBody({
    schema: {
      properties: {
        coupleId: { type: 'string' },
        mission: { type: 'string' },
        diary: { type: 'string' },
        aiComment: { type: 'string' },
        date: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Mission content updated successfully.',
    type: Mission,
  })
  @Put(':id/content')
  async updateContent(
    @Param('id') id: string,
    @Body() updateMissionDto: UpdateMissionDto,
  ) {
    return this.missionsService.updateContent(id, updateMissionDto);
  }
  //2. 사진 삭제
  @ApiOperation({ summary: 'Delete specific photo from mission' })
  @ApiParam({ name: 'id', description: 'Mission ID' })
  @ApiQuery({ name: 'img-url', description: 'URL of the image to delete' })
  @ApiResponse({
    status: 200,
    description: 'Photo deleted successfully.',
  })
  @Delete(':id/images')
  async deleteMissionImage(
    @Param('id') id: string,
    @Query('img-url') imageUrl: string,
  ) {
    return this.missionsService.deleteMissionImage(id, imageUrl);
  }
  //3. 사진추가
  @ApiOperation({ summary: 'Add new photo(s) to the mission' })
  @ApiParam({ name: 'id', description: 'Mission ID' })
  @ApiBody({
    schema: {
      properties: {
        photos: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Photos added successfully.',
  })
  @UseInterceptors(FilesInterceptor('photos'))
  @Post(':id/images')
  async addMissionImages(
    @Param('id') id: string,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    return this.missionsService.addMissionImages(id, photos);
  }

  @ApiOperation({ summary: 'Delete a mission by id' })
  @ApiResponse({
    status: 200,
    description: 'The mission has been successfully deleted.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionsService.remove(id);
  }
}
