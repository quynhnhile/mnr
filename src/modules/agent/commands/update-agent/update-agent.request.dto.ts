import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAgentRequestDto {
  @ApiPropertyOptional({
    example: 'CMA',
    description: 'MÃ HÃNG TÀU',
  })
  @IsNotEmpty()
  @MaxLength(50)
  operationCode: string;

  @ApiPropertyOptional({
    example: 'ZIM',
    description: 'MÃ ĐẠI LÝ',
  })
  @IsNotEmpty()
  @MaxLength(50)
  agentCode: string;

  @ApiPropertyOptional({
    example: 'Zim Integrated Shipping Services Ltd',
    description: 'TÊN ĐẠI LÝ',
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(100)
  agentName: string;
}
