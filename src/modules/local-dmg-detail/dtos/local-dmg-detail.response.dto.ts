import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LocalDmgDetailResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: '1',
    description: 'Survey ID',
  })
  idSurvey: string;

  @ApiProperty({
    example: '',
    description: 'id cont',
  })
  idCont: string;

  @ApiProperty({
    example: '',
    description: 'Mã hư hỏng nội bộ',
  })
  damLocalCode: string;

  @ApiProperty({
    example: '',
    description: 'Vị trí hư hỏng nội bộ',
  })
  locLocalCode: string;

  @ApiProperty({
    example: '*',
    description: 'Symbol code',
  })
  symbolCode: string;

  @ApiProperty({
    example: '20',
    description: 'SIZE',
  })
  size: string;

  @ApiPropertyOptional({
    example: 'note 123',
    description: 'Diễn giải hư hỏng',
  })
  damDesc?: string | null;

  @ApiPropertyOptional({
    example: 'note 123',
    description: 'Note',
  })
  note?: string | null;
}
