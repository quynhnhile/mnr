import { IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRoleRequestDto {
  @ApiPropertyOptional({
    example: '',
    description: 'MÔ TẢ',
  })
  @IsOptional()
  @MaxLength(200)
  description?: string;
}
