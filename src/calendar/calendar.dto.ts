import { ApiProperty } from '@nestjs/swagger';

export class CoupleAnniversariesDto {
  @ApiProperty({ description: 'The ID of the anniversary' })
  _id: string;

  @ApiProperty({ description: 'The date of the anniversary' })
  date: Date;

  @ApiProperty({ description: 'The description of the anniversary' })
  description: string;
}

export class CoupleInfoDto {
  @ApiProperty({ description: 'The ID of the couple' })
  _id: string;

  @ApiProperty({ description: 'The start date of the relationship' })
  startDate: Date;

  @ApiProperty({ description: 'The usernames of the couple' })
  usernames: string[];
}

export class ScheduleDto {
  @ApiProperty({ description: 'The ID of the schedule' })
  _id: string;

  @ApiProperty({ description: 'The couple ID of the schedule' })
  coupleId: string;

  @ApiProperty({ description: 'The date of the schedule' })
  date: Date;

  @ApiProperty({ description: 'The description of the schedule' })
  description: string;
}

export class ProgressInfoDto {
  @ApiProperty({ description: 'The number of letters' })
  letterCount: number;

  @ApiProperty({ description: 'The anniversaries information' })
  anniversaries: CoupleAnniversariesDto[];
}
