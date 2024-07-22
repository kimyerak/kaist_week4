import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CoupleAnniversariesDto,
  CoupleInfoDto,
  ScheduleDto,
  ProgressInfoDto,
} from './calendar.dto';
@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @ApiOperation({ summary: 'Get couple anniversaries' })
  @ApiParam({ name: 'coupleId', description: 'Couple ID' })
  @ApiResponse({
    status: 200,
    description: 'The anniversaries have been successfully retrieved.',
    type: [CoupleAnniversariesDto],
  })
  @Get('couples/:coupleId/anniversaries')
  async getCoupleAnniversaries(@Param('coupleId') coupleId: string) {
    return this.calendarService.getCoupleAnniversaries(coupleId);
  }

  @ApiOperation({ summary: 'Get couple info' })
  @ApiParam({ name: 'coupleId', description: 'Couple ID' })
  @ApiResponse({
    status: 200,
    description: 'The couple information has been successfully retrieved.',
    type: CoupleInfoDto,
  })
  @Get('couples/:coupleId/coupleInfo')
  async getCoupleInfo(@Param('coupleId') coupleId: string) {
    return this.calendarService.getCoupleInfo(coupleId);
  }

  @ApiOperation({ summary: 'Create schedule' })
  @ApiBody({
    schema: {
      properties: {
        coupleId: { type: 'string' },
        date: { type: 'string', format: 'date-time' },
        title: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The schedule has been successfully created.',
    type: ScheduleDto,
  })
  @Post('schedule')
  async createSchedule(
    @Body('coupleId') coupleId: string,
    @Body('date') date: Date,
    @Body('title') title: string,
  ) {
    return this.calendarService.createSchedule(coupleId, date, title);
  }

  @ApiOperation({ summary: 'Update schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiBody({
    schema: {
      properties: {
        date: { type: 'string', format: 'date-time' },
        title: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The schedule has been successfully updated.',
    type: ScheduleDto,
  })
  @Put('schedule/:id')
  async updateSchedule(
    @Param('id') scheduleId: string,
    @Body('date') date: Date,
    @Body('title') title: string,
  ) {
    return this.calendarService.updateSchedule(scheduleId, date, title);
  }

  @ApiOperation({ summary: 'Delete schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({
    status: 204,
    description: 'The schedule has been successfully deleted.',
  })
  @Delete('schedule/:id')
  async deleteSchedule(@Param('id') scheduleId: string) {
    return this.calendarService.deleteSchedule(scheduleId);
  }

  @ApiOperation({ summary: 'Get schedules' })
  @ApiParam({ name: 'coupleId', description: 'Couple ID' })
  @ApiParam({ name: 'date', description: 'Date' })
  @ApiResponse({
    status: 200,
    description: 'The schedules have been successfully retrieved.',
    type: [ScheduleDto],
  })
  @Get('schedule/:coupleId/:date')
  async getSchedules(
    @Param('coupleId') coupleId: string,
    @Param('date') date: Date,
  ) {
    return this.calendarService.getSchedules(coupleId, date);
  }

  @ApiOperation({ summary: 'Get all schedules for a couple' })
  @ApiParam({ name: 'coupleId', description: 'Couple ID' })
  @ApiResponse({
    status: 200,
    description:
      'All schedules for the couple have been successfully retrieved.',
    type: [ScheduleDto],
  })
  @Get('couples/:coupleId/schedules')
  async getAllSchedules(@Param('coupleId') coupleId: string) {
    return this.calendarService.getAllSchedules(coupleId);
  }

  @ApiOperation({ summary: '이건 편지탭에서 쓰임. 편지개수와 기념일반환' })
  @ApiParam({ name: 'coupleId', description: 'Couple ID' })
  @ApiResponse({
    status: 200,
    description: 'Progress information has been successfully retrieved.',
    type: ProgressInfoDto,
  })
  @Get('couples/:coupleId/progress')
  async getProgressInfo(@Param('coupleId') coupleId: string) {
    return this.calendarService.getProgressInfo(coupleId);
  }
}
