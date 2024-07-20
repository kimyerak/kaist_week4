import { Controller, Get, Param } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('couples/:id/anniversaries')
  async getCoupleAnniversaries(@Param('id') id: string) {
    return this.calendarService.getCoupleAnniversaries(id);
  }
  @Get('couples/:id/coupleInfo')
  async getCoupleInfo(@Param('id') id: string) {
    return this.calendarService.getCoupleInfo(id);
  }
}
