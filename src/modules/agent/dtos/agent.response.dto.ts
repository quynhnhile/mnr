import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty } from '@nestjs/swagger';

export class AgentResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: 'CMA',
    description: 'MÃ HÃNG TÀU',
  })
  operationCode: string;

  @ApiProperty({
    example: 'ZIM',
    description: 'MÃ ĐẠI LÝ',
  })
  agentCode: string;

  @ApiProperty({
    example: 'Zim Integrated Shipping Services Ltd',
    description: 'TÊN ĐẠI LÝ',
  })
  agentName: string;
}
