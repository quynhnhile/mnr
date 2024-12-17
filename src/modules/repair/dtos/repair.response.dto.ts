import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RepairResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiProperty({
    example: 'ZIM',
    description: 'Mã hãng tàu',
  })
  operationCode: string;

  @ApiProperty({
    example: 'CC',
    description: 'Mã sửa chữa',
  })
  repCode: string;

  @ApiProperty({
    example: 'Chemical clean',
    description: 'Tên tiếng Anh',
  })
  repNameEn: string;

  @ApiPropertyOptional({
    example: 'Rửa hóa chất',
    description: 'Tên tiếng Việt',
  })
  repNameVi?: string;

  @ApiProperty({
    example: true,
    description: 'Loại vệ sinh',
  })
  isClean: boolean;

  @ApiProperty({
    example: false,
    description: 'Loại sửa chữa',
  })
  isRepair: boolean;

  @ApiProperty({
    example: false,
    description: 'Loại kiểm tra PTI',
  })
  isPti: boolean;

  @ApiPropertyOptional({
    example: '',
    description: 'Ghi chú',
  })
  note?: string;
}
