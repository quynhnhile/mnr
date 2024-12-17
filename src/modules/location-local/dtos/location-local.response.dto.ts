import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LocationLocalResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: '',
    description: 'Nhóm mã vị trí nội bộ container',
  })
  groupLocLocalCode: string;

  @ApiProperty({
    example: '',
    description: 'Mã vị trí nội bộ container',
  })
  locLocalCode: string;

  @ApiProperty({
    example: '',
    description: 'Tên tiếng anh',
  })
  locLocalNameEn: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Tên tiếng việt',
  })
  locLocalNameVi?: string | null;

  @ApiPropertyOptional({
    example: '123',
    description: 'Ghi chú',
  })
  note?: string | null;
}
