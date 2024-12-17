import { ApiPropertyOptional } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiPropertyOptional({
    example: '',
    description: 'ID GROUP',
  })
  id?: string;

  @ApiPropertyOptional({
    example: 'ECM_test',
    description: 'TÊN GROUP',
  })
  roleName?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'MÔ TẢ',
  })
  description?: string;
}
