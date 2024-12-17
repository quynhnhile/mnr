import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOperationRequestDto {
  // Add more properties here
  @ApiPropertyOptional({
    example: ['OPR_001'],
    description: 'Mã hãng khai thác',
    type: 'string',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  operationCode?: string[] | null;
}
