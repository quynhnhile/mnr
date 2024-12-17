import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateContSizeMapRequestDto {
  @ApiPropertyOptional({
    example: 'ZIM',
    description: 'MÃ HÃNG TÀU',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  operationCode: string;

  @ApiPropertyOptional({
    example: '20G0',
    description: 'LOCAL SIZE TYPE',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(10)
  localSizeType: string;

  @ApiPropertyOptional({
    example: '45G1',
    description: 'ISO SIZE TYPE',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(10)
  isoSizeType: string;

  @ApiPropertyOptional({
    example: `20'`,
    description: 'SIZE',
  })
  @IsOptional()
  @MaxLength(50)
  size?: string;

  @ApiPropertyOptional({
    example: 20,
    description: 'HEIGHT',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  height?: Prisma.Decimal;

  @ApiPropertyOptional({
    example: 'DR',
    description: 'LOẠI CONTAINER',
  })
  @IsOptional()
  @MaxLength(50)
  contType?: string;

  @ApiPropertyOptional({
    example: 'TÊN LOẠI CONTAINER',
    description: 'TÊN LOẠI CONTAINER',
  })
  @IsOptional()
  @MaxLength(100)
  contTypeName?: string;
}
