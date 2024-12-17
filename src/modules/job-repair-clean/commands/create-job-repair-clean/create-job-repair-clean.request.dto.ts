import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobRepairCleanRequestDto {
  @ApiProperty({
    example: '1',
    description: 'ID - DT_REPAIR_CONT',
  })
  @IsNotEmpty()
  idRef: bigint;

  @ApiProperty({
    example: '3',
    description: 'ID - DT_ESTIMATE_DETAIL',
  })
  @IsNotEmpty()
  idEstItem: bigint;

  @ApiProperty({
    example: 'RM',
    description: 'REPAIR CODE',
  })
  @IsNotEmpty()
  @MaxLength(50)
  repCode: string;

  @ApiPropertyOptional({
    example: 'VZIM',
    description: 'VENDOR CODE',
  })
  @IsOptional()
  @MaxLength(50)
  vendorCode?: string;

  @ApiProperty({
    example: false,
    description: 'IS RECLEAN',
  })
  @IsBoolean()
  isReclean: boolean;

  @ApiPropertyOptional({
    example: 2,
    description: 'IS REF RECLEAN - ID JOB_REPAIR_CLEAN',
  })
  @IsOptional()
  idRefReclean?: bigint;

  @ApiPropertyOptional({
    example: 'note reclean reason 123',
    description: 'RECLEAN REASON',
  })
  @IsOptional()
  recleanReason?: string;

  @ApiPropertyOptional({
    example: 'note 123',
    description: 'NOTE',
  })
  @IsOptional()
  note?: string;
}
