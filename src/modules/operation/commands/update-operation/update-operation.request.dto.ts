import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsOptionalNonNullable } from '@libs/decorators/class-validator.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOperationRequestDto {
  @ApiPropertyOptional({
    example: 'ZIM',
    description: 'MÃ HÃNG TÀU',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(10)
  operationCode: string;

  @ApiPropertyOptional({
    example: 'Zim Integrated Shipping Services Ltd',
    description: 'TÊN HÃNG TÀU',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(100)
  operationName: string;

  // @ApiPropertyOptional({
  //   example: false,
  //   description: 'GIAO DỊCH EDO',
  // })
  // @IsOptionalNonNullable()
  // @IsBoolean()
  // @Transform(({ value }) => value ?? false)
  // isEdo: boolean;

  // @ApiPropertyOptional({
  //   example: OperationType.LOCAL,
  //   description: 'GIAO DỊCH LF',
  //   enum: OperationType,
  // })
  // @IsOptionalNonNullable()
  // @IsNotEmpty()
  // @IsIn([OperationType.LOCAL, OperationType.FOREIGN])
  // isLocalForeign?: OperationType;

  @ApiPropertyOptional({
    example: true,
    description: 'KÍCH HOẠT',
  })
  @IsOptionalNonNullable()
  @IsBoolean()
  @Transform(({ value }) => value ?? true)
  isActive: boolean;

  @ApiPropertyOptional({
    example: 'chính sách hãng tàu',
    description: 'CHÍNH SÁCH HÃNG TÀU',
  })
  @IsOptional()
  @MaxLength(500)
  policyInfo?: string;

  @ApiPropertyOptional({
    example: 'VSHT',
    description: 'PHƯƠNG THỨC VỆ SINH',
  })
  @IsOptional()
  @MaxLength(50)
  cleanMethodCode?: string;
  // @ApiPropertyOptional({
  //   example: 'M',
  //   description: 'PHƯƠNG THỨC THANH TOÁN',
  // })
  // @IsOptional()
  // moneyCredit?: string;
}
