import { IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CancelEstimateRequestDto {
  @ApiPropertyOptional({
    example: false,
    description: 'IS OPR CANCEL',
  })
  @IsBoolean()
  isOprCancel?: boolean;
}
