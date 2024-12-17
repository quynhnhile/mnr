import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentRequestDto {
  @ApiProperty({
    example: 'CMA',
    description: 'MÃ HÃNG TÀU',
  })
  @IsNotEmpty()
  @MaxLength(10)
  operationCode: string;

  @ApiProperty({
    example: 'ZIM',
    description: 'MÃ ĐẠI LÝ - TÊN ĐẠI LÝ',
  })
  @IsNotEmpty()
  agentCode: string;

  @ApiProperty({
    example: 'Zim Integrated Shipping Services Ltd',
    description: 'TÊN ĐẠI LÝ',
  })
  @IsNotEmpty()
  @MaxLength(100)
  agentName: string;
}
