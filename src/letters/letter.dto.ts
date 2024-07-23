import { ApiProperty } from '@nestjs/swagger';

export class LetterDto {
  @ApiProperty({ description: 'The ID of the letter' })
  _id: string;

  @ApiProperty({ description: 'The ID of the couple' })
  coupleId: string;

  @ApiProperty({ description: 'The ID of the sender' })
  senderId: string;

  // @ApiProperty({ description: 'The ID of the receiver' })
  // receiverId: string;

  @ApiProperty({ description: 'The title of the letter' })
  title: string;

  @ApiProperty({ description: 'The content of the letter' })
  content: string;

  @ApiProperty({
    description: 'The photos attached to the letter',
    type: [String],
  })
  photos: string[];

  @ApiProperty({
    description: 'The date the letter was created',
    format: 'date-time',
  })
  date: Date;
}
