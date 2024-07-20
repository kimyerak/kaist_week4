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
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @ApiOperation({ summary: 'Get couple anniversaries' })
  @ApiParam({ name: 'coupleId', description: 'Couple ID' })
  @Get('couples/:coupleId/anniversaries')
  async getCoupleAnniversaries(@Param('coupleId') coupleId: string) {
    return this.calendarService.getCoupleAnniversaries(coupleId);
  }

  @ApiOperation({ summary: 'Get couple info' })
  @ApiParam({ name: 'coupleId', description: 'Couple ID' })
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
        description: { type: 'string' },
      },
    },
  })
  @Post('schedule')
  async createSchedule(
    @Body('coupleId') coupleId: string,
    @Body('date') date: Date,
    @Body('description') description: string,
  ) {
    return this.calendarService.createSchedule(coupleId, date, description);
  }

  @ApiOperation({ summary: 'Update schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiBody({
    schema: {
      properties: {
        date: { type: 'string', format: 'date-time' },
        description: { type: 'string' },
      },
    },
  })
  @Put('schedule/:id')
  async updateSchedule(
    @Param('id') scheduleId: string,
    @Body('date') date: Date,
    @Body('description') description: string,
  ) {
    return this.calendarService.updateSchedule(scheduleId, date, description);
  }

  @ApiOperation({ summary: 'Delete schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @Delete('schedule/:id')
  async deleteSchedule(@Param('id') scheduleId: string) {
    return this.calendarService.deleteSchedule(scheduleId);
  }

  @ApiOperation({ summary: 'Get schedules' })
  @ApiParam({ name: 'coupleId', description: 'Couple ID' })
  @ApiParam({ name: 'date', description: 'Date' })
  @Get('schedule/:coupleId/:date')
  async getSchedules(
    @Param('coupleId') coupleId: string,
    @Param('date') date: Date,
  ) {
    return this.calendarService.getSchedules(coupleId, date);
  }

  @ApiOperation({ summary: '이건 편지탭에서 쓰임. 편지개수와 기념일반환' })
  @ApiParam({ name: 'coupleId', description: 'Couple ID' })
  @Get('couples/:coupleId/progress')
  async getProgressInfo(@Param('coupleId') coupleId: string) {
    return this.calendarService.getProgressInfo(coupleId);
  }
}
