import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsObject,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class ResourceScopeDto {
  @ApiProperty({
    example: '5e4d2bbc-5483-4747-b865-8bbee107b202',
    description: 'ID HÀNH ĐỘNG CÓ THỂ THỰC HIỆN',
  })
  @IsNotEmpty()
  @MaxLength(200)
  id: string;

  @ApiProperty({
    example: 'view',
    description: 'TÊN HÀNH ĐỘNG CÓ THỂ THỰC HIỆN',
  })
  @IsNotEmpty()
  @MaxLength(200)
  name: string;
}

export class UpdateResourceRequestDto {
  @ApiPropertyOptional({
    example: 'sa-menuss',
    description: 'TÊN MENU',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({
    example: 'Chức năng',
    description: 'TÊN HIỂN THỊ',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(200)
  displayName: string;

  @ApiPropertyOptional({
    example: {
      parent: ['Tác vụ'],
    },
    description: 'THUỘC TÍNH',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsObject()
  attributes: { [index: string]: string[] };

  @ApiProperty({
    example: [
      {
        id: '17215afb-cc9f-4293-9a6c-1c642dbdb74e',
        name: 'view',
      },
      {
        id: '560c50e4-c513-42d0-99cd-76e460ee55fd',
        name: 'update',
      },
      {
        id: '39b7d4d1-ba2a-49a9-93cf-73bd53088f9f',
        name: 'delete',
      },
      {
        id: 'e15f07fc-a6a3-406e-8057-56eb280375a0',
        name: 'create',
      },
    ],
    description: 'HÀNH ĐỘNG CÓ THỂ THỰC HIỆN',
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayUnique((e) => e.id)
  @Type(() => ResourceScopeDto)
  @ValidateNested({ each: true })
  scopes: ResourceScopeDto[];
}
