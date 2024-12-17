import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupLocationLocalRequestDto {
  @ApiProperty({
    example: '',
    description: 'Mã nhóm vị trí',
  })
  @IsNotEmpty()
  @MaxLength(50)
  groupLocLocalCode: string;

  @ApiProperty({
    example: '',
    description: 'Tên nhóm vị trí',
  })
  @IsNotEmpty()
  @MaxLength(500)
  groupLocLocalName: string;

  @ApiProperty({
    example: '',
    description: 'Loại cont',
  })
  @IsNotEmpty()
  @MaxLength(50)
  contType: string;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'Ghi chú',
  })
  @IsOptional()
  note?: string;
}
