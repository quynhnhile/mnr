import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateJobRepairCleanRequestDto {
  @ApiPropertyOptional({
    example: 'RM',
    description: 'REPAIR CODE',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  repCode?: string;

  @ApiPropertyOptional({
    example: 'VZIM',
    description: 'VENDOR CODE',
  })
  @IsOptional()
  @MaxLength(50)
  vendorCode?: string;

  @ApiPropertyOptional({
    example: 'GHI CHÚ COM_DAM_REP',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
