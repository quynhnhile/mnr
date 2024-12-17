import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteAllJobRequestDto {
  @ApiProperty({
    example: false,
    description: 'IS CLEAN',
  })
  @IsNotEmpty()
  @IsBoolean()
  isClean: boolean;
}
