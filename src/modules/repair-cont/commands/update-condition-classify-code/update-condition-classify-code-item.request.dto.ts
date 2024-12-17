import { IsNumber, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateConditionClassifyCodeItemRequestDto {
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
}
