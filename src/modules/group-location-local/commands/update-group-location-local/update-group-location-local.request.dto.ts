import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateGroupLocationLocalRequestDto {
  @ApiPropertyOptional({
    example: '',
    description: 'Mã nhóm vị trí',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  groupLocLocalCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Tên nhóm vị trí',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(500)
  groupLocLocalName?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Loại cont',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  contType?: string;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'Ghi chú',
  })
  @IsOptional()
  note?: string;
}
