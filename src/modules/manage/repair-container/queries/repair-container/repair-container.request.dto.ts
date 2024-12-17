import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ManageRepairContainerRequestDto {
  @ApiPropertyOptional({
    example: 'E',
    description: 'Trạng thái S , E, A, C, X',
  })
  @IsOptional()
  statusCode?: string;

  @ApiPropertyOptional({
    example: new Date(),
    description: 'Từ ngày',
  })
  @IsOptional()
  fromDate?: Date;

  @ApiPropertyOptional({
    example: new Date(),
    description: 'Đến ngày',
  })
  @IsOptional()
  toDate?: Date;

  @ApiPropertyOptional({
    example: '*',
    description: 'chủ kt',
  })
  @IsOptional()
  operationCode?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'giám định lại',
  })
  @IsOptional()
  isRevice?: boolean;
}
