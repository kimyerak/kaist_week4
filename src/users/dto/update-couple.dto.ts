import { ApiProperty } from '@nestjs/swagger';

export class UpdateCoupleDto {
  @ApiProperty({ description: 'The username of the partner' })
  partnerUsername: string;

  @ApiProperty({ description: 'The start date of the relationship' })
  startDate: Date;
}
