import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { LetterService } from './letter.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

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
        receiverId: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string' },
        photos: { type: 'array', items: { type: 'string' } },
        date: { type: 'string', format: 'date-time' },
      },
    },
  })
  @Post()
  async createLetter(
    @Body('coupleId') coupleId: string,
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('photos') photos: string[],
    @Body('date') date: Date,
  ) {
    return this.letterService.createLetter(
      coupleId,
      senderId,
      receiverId,
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
        photos: { type: 'array', items: { type: 'string' } },
        date: { type: 'string', format: 'date-time' },
      },
    },
  })
  @Put(':id')
  async updateLetter(
    @Param('id') letterId: string,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('photos') photos: string[],
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
  @Delete(':id')
  async deleteLetter(@Param('id') letterId: string) {
    return this.letterService.deleteLetter(letterId);
  }

  @ApiOperation({ summary: 'whole letter history' })
  @ApiParam({ name: 'coupleId', description: 'Couple ID' })
  @Get('couple/:coupleId')
  async getLetters(@Param('coupleId') coupleId: string) {
    return this.letterService.getLetters(coupleId);
  }

  @ApiOperation({ summary: 'Get specific letter' })
  @ApiParam({ name: 'id', description: 'Letter ID' })
  @Get(':id')
  async getLetter(@Param('id') letterId: string) {
    return this.letterService.getLetter(letterId);
  }
}
