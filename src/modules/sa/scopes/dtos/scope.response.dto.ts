import { ApiPropertyOptional } from '@nestjs/swagger';

export class ScopeResponseDto {
  @ApiPropertyOptional({
    example: '',
    description: 'ID THAO TÁC',
  })
  id?: string;

  @ApiPropertyOptional({
    example: 'view',
    description: 'TÊN THAO TÁC',
  })
  name?: string;
}
