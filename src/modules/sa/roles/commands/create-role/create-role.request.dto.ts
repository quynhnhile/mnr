import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleRequestDto {
  @ApiProperty({
    example: 'ECM_test',
    description: 'TÊN GROUP',
  })
  @IsNotEmpty()
  @MaxLength(200)
  roleName: string;

  @ApiPropertyOptional({
    example: null,
    description: 'MÔ TẢ',
  })
  @IsOptional()
  @MaxLength(200)
  description?: string;
}
