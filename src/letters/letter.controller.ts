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
  Query,
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
  ApiQuery,
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

  // @ApiOperation({ summary: 'Update letter' })
  // @ApiParam({ name: 'id', description: 'Letter ID' })
  // @ApiBody({
  //   schema: {
  //     properties: {
  //       title: { type: 'string' },
  //       content: { type: 'string' },
  //       photos: { type: 'array', items: { type: 'string', format: 'binary' } },
  //       date: { type: 'string', format: 'date-time' },
  //     },
  //   },
  // })
  // @ApiConsumes('multipart/form-data')
  // @ApiResponse({
  //   status: 200,
  //   description: 'The letter has been successfully updated.',
  //   type: LetterDto,
  // })
  // @Put(':id')
  // @UseInterceptors(FilesInterceptor('photos'))
  // async updateLetter(
  //   @Param('id') letterId: string,
  //   @Body('title') title: string,
  //   @Body('content') content: string,
  //   @UploadedFiles() photos: Express.Multer.File[],
  //   @Body('date') date: Date,
  // ) {
  //   return this.letterService.updateLetter(
  //     letterId,
  //     title,
  //     content,
  //     photos.length === 0 ? undefined : photos,
  //     date,
  //   );
  // }

  // PUT letters/:id --> 이게 지금건데 이걸 없애
  // PUT letters/:id/content --> 내용만 수정 --> 1사진은 수정 안됨.
  // DELETE letters/:id/images/?img-url={url} --> 2사진 삭제
  // POST letters/:id/images <- body에 파일 넣어서 보내주기 --> 3 사진 추가
  // PUT letters/:id/images <-     -->4교체
  // {update_query: [ {url: "...", image: File}, {} ]}

  //1. 내용만 수정. 사진은 그대로
  @ApiOperation({ summary: 'Update letter content' })
  @ApiParam({ name: 'id', description: 'Letter ID' })
  @ApiBody({
    schema: {
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        date: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The letter content has been successfully updated.',
    type: LetterDto,
  })
  @Put(':id/content')
  async updateLetterContent(
    @Param('id') letterId: string,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('date') date: Date,
  ) {
    return this.letterService.updateLetterContent(
      letterId,
      title,
      content,
      date,
    );
  }

  //2. 사진 삭제
  @ApiOperation({ summary: 'Delete specific photo from letter' })
  @ApiParam({ name: 'id', description: 'Letter ID' })
  @ApiQuery({ name: 'img-url', description: 'URL of the image to delete' })
  @ApiResponse({
    status: 200,
    description: 'The specified image has been successfully deleted.',
  })
  @Delete(':id/images')
  async deleteLetterImage(
    @Param('id') letterId: string,
    @Query('img-url') imageUrl: string,
  ) {
    return this.letterService.deleteLetterImage(letterId, imageUrl);
  }

  //3. 사진추가
  @ApiOperation({ summary: 'Add new photo(s) to the letter' })
  @ApiParam({ name: 'id', description: 'Letter ID' })
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
    description: 'New photo(s) have been successfully added.',
  })
  @UseInterceptors(FilesInterceptor('photos'))
  @Post(':id/images')
  async addLetterImages(
    @Param('id') letterId: string,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    return this.letterService.addLetterImages(letterId, photos);
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
