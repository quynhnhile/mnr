import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryInfoContByContNoOrEstimateNoRequestDto {
  @ApiPropertyOptional({
    example: 'DFSU7723129',
    description: 'Số Container',
  })
  @IsOptional()
  containerNo?: string;

  @ApiPropertyOptional({
    example: 'E2411010004',
    description: 'Số Estimate',
  })
  @IsOptional()
  estimateNo?: string;
}
