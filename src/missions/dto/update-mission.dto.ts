//update-mission.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateMissionDto } from './create-mission.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMissionDto extends PartialType(CreateMissionDto) {
  @ApiProperty({ description: 'The ID of the Mission' })
  _id: string;

  @ApiProperty({ description: 'The ID of the couple' })
  coupleId: string;

  @ApiProperty({ description: 'mission 설명' })
  mission?: string;

  @ApiProperty({ description: '미션등록 날짜' })
  date: Date;

  @ApiProperty({ required: false })
  diary?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  photos?: string[];

  @ApiProperty({ required: false })
  aiComment?: string;
}