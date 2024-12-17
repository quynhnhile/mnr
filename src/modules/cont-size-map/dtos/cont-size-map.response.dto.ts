import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class ContSizeMapResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: 'ZIM',
    description: 'MÃ HÃNG TÀU',
  })
  operationCode: string;

  @ApiProperty({
    example: '20G0',
    description: 'LOCAL SIZE TYPE',
  })
  localSizeType: string;

  @ApiProperty({
    example: '45G1',
    description: 'ISO SIZE TYPE',
  })
  isoSizeType: string;

  @ApiPropertyOptional({
    example: `20'`,
    description: 'SIZE',
  })
  size?: string;

  @ApiPropertyOptional({
    example: 20,
    description: 'HEIGHT',
  })
  height?: Prisma.Decimal;

  @ApiPropertyOptional({
    example: 'DR',
    description: 'LOẠI CONTAINER',
  })
  contType?: string;

  @ApiPropertyOptional({
    example: 'TÊN LOẠI CONTAINER',
    description: 'TÊN LOẠI CONTAINER',
  })
  contTypeName?: string;
}
