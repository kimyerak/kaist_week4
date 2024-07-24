import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { LetterService } from './letter.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { LetterDto } from './letter.dto';

@ApiTags('letters')
@Controller('letters')
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @ApiOperation({ summary: 'Create letter' })
  @ApiBody({
    schema: {
      properties: {
        coupleId: { type: 'string' },
        senderId: { type: 'string' },
        // receiverId: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string' },
        photos: { type: 'array', items: { type: 'string', format: 'binary' } },
        date: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'The letter has been successfully created.',
    type: LetterDto,
  })
  @Post()
  @UseInterceptors(FilesInterceptor('photos'))
  async createLetter(
    @Body('coupleId') coupleId: string,
    @Body('senderId') senderId: string,
    // @Body('receiverId') receiverId: string,
    @Body('title') title: string,
    @Body('content') content: string,
    @UploadedFiles() photos: Express.Multer.File[],
    @Body('date') date: Date,
  ) {
    return this.letterService.createLetter(
      coupleId,
      senderId,
      // receiverId,
      title,
      content,
      photos,
      date,
    );
  }

  @ApiOperation({ summary: 'Update letter' })
  @ApiParam({ name: 'id', description: 'Letter ID' })
  @ApiBody({
    schema: {
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        photos: { type: 'array', items: { type: 'string', format: 'binary' } },
        date: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'The letter has been successfully updated.',
    type: LetterDto,
  })
  @Put(':id')
  @UseInterceptors(FilesInterceptor('photos'))
  async updateLetter(
    @Param('id') letterId: string,
    @Body('title') title: string,
    @Body('content') content: string,
    @UploadedFiles() photos: Express.Multer.File[],
    @Body('date') date: Date,
  ) {
    return this.letterService.updateLetter(
      letterId,
      title,
      content,
      photos,
      date,
    );
  }

  @ApiOperation({ summary: 'Delete letter' })
  @ApiParam({ name: 'id', description: 'Letter ID' })
  @ApiResponse({
    status: 204,
    description: 'The letter has been successfully deleted.',
  })
  @Delete(':id')
  async deleteLetter(@Param('id') letterId: string) {
    return this.letterService.deleteLetter(letterId);
  }

  @ApiOperation({ summary: 'whole letter history' })
  @ApiParam({ name: 'coupleId', description: 'Couple ID' })
  @ApiResponse({
    status: 200,
    description: 'The letters have been successfully retrieved.',
    type: [LetterDto],
  })
  @Get('couple/:coupleId')
  async getLetters(@Param('coupleId') coupleId: string) {
    return this.letterService.getLetters(coupleId);
  }

  @ApiOperation({ summary: 'Get specific letter' })
  @ApiParam({ name: 'id', description: 'Letter ID' })
  @ApiResponse({
    status: 200,
    description: 'The letter has been successfully retrieved.',
    type: LetterDto,
  })
  @Get(':id')
  async getLetter(@Param('id') letterId: string) {
    return this.letterService.getLetter(letterId);
  }
}
