//mission.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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

  @ApiOperation({ summary: 'Update a mission by id' })
  @ApiBody({
    schema: {
      properties: {
        coupleId: { type: 'string' },
        mission: { type: 'string' },
        diary: { type: 'string' },
        aiComment: { type: 'string' },
        photos: { type: 'array', items: { type: 'string', format: 'binary' } },
        date: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'The mission has been successfully updated.',
    type: Mission,
  })
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('photos'))
  update(
    @Param('id') id: string,
    @Body() updateMissionDto: UpdateMissionDto,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    return this.missionsService.update(id, updateMissionDto, photos);
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
