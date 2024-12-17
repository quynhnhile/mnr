import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateEstimateDetailRequestDto } from '../create-estimate-detail/create-estimate-detail.request.dto';

export class CreateEstimateRequestDto {
  @ApiProperty({
    example: '1',
    description: 'REPAIR CONT ID',
  })
  @IsNotEmpty()
  idRef: bigint;

  @ApiProperty({
    example: 'MSC',
    description: 'operation code',
  })
  @IsNotEmpty()
  @MaxLength(50)
  operationCode: string;

  @ApiPropertyOptional({
    example: '202409186859',
    description: 'ESTIMATE NO - ALT',
  })
  @IsOptional()
  @MaxLength(50)
  altEstimateNo?: string;

  @ApiPropertyOptional({
    example: 'estimate note',
    description: 'NOTE ESTIMATE',
  })
  @IsOptional()
  noteEstimate?: string;

  @ApiPropertyOptional({
    example: 'note 123',
    description: 'NOTE',
  })
  @IsOptional()
  note?: string;

  @ApiProperty({
    type: [CreateEstimateDetailRequestDto],
    description: 'Danh sách chi tiết estimate',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEstimateDetailRequestDto)
  estimateDetails: CreateEstimateDetailRequestDto[];
}
