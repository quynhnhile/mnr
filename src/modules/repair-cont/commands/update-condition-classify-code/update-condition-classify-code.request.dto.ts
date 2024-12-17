import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateConditionClassifyCodeItemRequestDto } from './update-condition-classify-code-item.request.dto';

export class UpdateConditionClassifyCodeRequestDto {
  @ApiProperty({
    description: 'list update',
    type: [UpdateConditionClassifyCodeItemRequestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateConditionClassifyCodeItemRequestDto)
  dataUpdate: UpdateConditionClassifyCodeItemRequestDto[];
}
