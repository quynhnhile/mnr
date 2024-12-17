import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JobTaskResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiProperty({
    example: '',
    description: 'MÃ TÁC NGHIỆP',
  })
  jobTaskCode: string;

  @ApiProperty({
    example: '',
    description: 'TÊN TÁC NGHIỆP',
  })
  jobTaskName: string;

  @ApiPropertyOptional({
    example: null,
    description: 'GHI CHÚ',
  })
  note?: string;
}
