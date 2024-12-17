import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GroupLocationLocalResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: '',
    description: 'Mã nhóm vị trí',
  })
  groupLocLocalCode: string;

  @ApiProperty({
    example: '',
    description: 'Tên nhóm vị trí',
  })
  groupLocLocalName: string;

  @ApiProperty({
    example: '',
    description: 'Loại cont',
  })
  contType: string;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'Ghi chú',
  })
  note?: string | null;
}
