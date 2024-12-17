import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdatDataItemRequestDto } from './update-data-item.request.dto';

export class UpdateDataRequestDto {
  @ApiProperty({
    description: 'list update',
    type: [UpdatDataItemRequestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatDataItemRequestDto)
  dataUpdate: UpdatDataItemRequestDto[];
}
