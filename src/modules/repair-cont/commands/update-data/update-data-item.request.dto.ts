import { IsNumber, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatDataItemRequestDto {
  @ApiProperty({
    example: 1,
    description: 'RepairCont ID',
  })
  @IsNumber()
  id: number;

  @ApiPropertyOptional({
    example: 'AA',
    description: 'condition code',
  })
  @IsOptional()
  @MaxLength(50)
  conditionCode?: string;

  @ApiPropertyOptional({
    example: 'AA',
    description: 'classify code',
  })
  @IsOptional()
  @MaxLength(50)
  classifyCode?: string;

  @ApiPropertyOptional({
    example: 'user test',
    description: 'estimate by',
  })
  @IsOptional()
  @MaxLength(36)
  estimateBy?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'estimate date',
  })
  @IsOptional()
  estimateDate?: Date;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'approval date',
  })
  @IsOptional()
  approvalDate?: Date;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'complete date',
  })
  @IsOptional()
  completeDate?: Date;

  @ApiPropertyOptional({
    example: 'note estimate',
    description: 'note estimate',
  })
  @IsOptional()
  noteEstimate?: string;
}
