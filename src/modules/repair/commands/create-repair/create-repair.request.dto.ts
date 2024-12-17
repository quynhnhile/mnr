import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRepairRequestDto {
  // Add more properties here
  @ApiProperty({
    example: 'ZIM',
    description: 'Mã hãng tàu',
  })
  @IsNotEmpty()
  @MaxLength(50)
  operationCode: string;

  @ApiProperty({
    example: 'CC',
    description: 'Mã sửa chữa',
  })
  @IsNotEmpty()
  @MaxLength(50)
  repCode: string;

  @ApiProperty({
    example: 'Chemical clean',
    description: 'Tên tiếng Anh',
  })
  @IsNotEmpty()
  @MaxLength(200)
  repNameEn: string;

  @ApiPropertyOptional({
    example: 'Rửa hóa chất',
    description: 'Tên tiếng Việt',
  })
  @IsOptional()
  @MaxLength(200)
  repNameVi?: string;

  @ApiProperty({
    example: true,
    description: 'Loại vệ sinh',
  })
  @IsBoolean()
  isClean: boolean;

  @ApiProperty({
    example: false,
    description: 'Loại sửa chữa',
  })
  @IsBoolean()
  isRepair: boolean;

  @ApiProperty({
    example: false,
    description: 'Loại kiểm tra PTI',
  })
  @IsBoolean()
  isPti: boolean;

  @ApiPropertyOptional({
    example: '',
    description: 'Ghi chú',
  })
  @IsOptional()
  note?: string;
}
