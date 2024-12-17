import { IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CancelJobRepairCleanItemRequestDto {
  @ApiPropertyOptional({
    example: 'VZIM',
    description: 'VENDOR CODE',
  })
  @IsOptional()
  @MaxLength(50)
  vendorCode?: string;

  @ApiPropertyOptional({
    example: 'note 123',
    description: 'NOTE',
  })
  @IsOptional()
  note?: string;
}
