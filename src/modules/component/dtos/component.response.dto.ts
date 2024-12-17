import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ComponentResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiPropertyOptional({
    example: 'ZIM',
    description: 'Mã hãng tàu',
  })
  operationCode?: string;

  @ApiProperty({
    example: 'DHR',
    description: 'Mã bộ phận',
  })
  compCode: string;

  @ApiProperty({
    example: 'DOOR HANDLE RETAINER',
    description: 'Tên tiếng Anh',
  })
  compNameEn: string;

  @ApiPropertyOptional({
    example: 'KHOA SEAL(PHAN TINH)',
    description: 'Tên tiếng Việt',
  })
  compNameVi?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Bộ phận lắp ráp',
  })
  assembly?: string;

  @ApiPropertyOptional({
    example: 'L',
    description: 'Mặt lắp ráp',
  })
  side?: string;

  @ApiPropertyOptional({
    example: 'DRY',
    description: 'Loại container (Dry , Reefer , Tank)',
  })
  contType?: string;

  @ApiPropertyOptional({
    example: 'AL',
    description: 'Mã vật tư',
  })
  materialCode?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Phân biệt Vỏ máy (Cont lạnh)',
  })
  isMachine?: boolean;

  @ApiPropertyOptional({
    example: 'Note',
    description: 'Ghi chú',
  })
  note?: string;
}
